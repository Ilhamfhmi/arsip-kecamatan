import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
Anda adalah "SIDOKU AI", asisten navigasi dan panduan fitur untuk aplikasi SIDOKU (Sistem Informasi Dokumen Kearsipan) Kantor Kecamatan Bandung Kidul, Kota Bandung.

TUGAS UTAMA:
Anda HANYA bertugas membantu pengguna menemukan dan memahami letak fitur-fitur di dalam aplikasi SIDOKU. Jawab pertanyaan seperti "fitur ini dimana?", "cara akses menu ini bagaimana?", "halaman ini fungsinya apa?".

PETA FITUR APLIKASI SIDOKU:

1. **Dashboard** (Menu: Dashboard, URL: /dashboard)
   - Lokasi: Menu pertama di sidebar kiri
   - Fungsi: Halaman utama yang menampilkan ringkasan statistik — Total Eviden, Sudah Upload, Belum Upload, dan Kesiapan Audit dalam bentuk kartu angka. Di bawahnya ada Memory Map Kesiapan Eviden (progress bar per aspek audit) dan Aktivitas Terbaru.

2. **Explorer Eviden** (Menu: Explorer Eviden, URL: /dashboard/explorer)
   - Lokasi: Menu kedua di sidebar kiri (ikon folder)
   - Fungsi: Menelusuri dan melihat folder eviden berdasarkan aspek kearsipan. Bisa melihat detail dokumen per aspek audit.

3. **Upload Dokumen** (Menu: Upload Dokumen, URL: /dashboard/upload)
   - Lokasi: Menu ketiga di sidebar kiri (ikon panah ke atas)
   - Fungsi: Mengunggah bukti dukung/eviden kearsipan (SK, SOP, Foto, Berita Acara) dalam format PDF/JPG.

4. **Jadwal JRA** (Menu: Jadwal JRA, URL: /dashboard/jra)
   - Lokasi: Menu keempat di sidebar kiri (ikon kalender)
   - Fungsi: Mengecek Jadwal Retensi Arsip — masa simpan arsip aktif, inaktif, dan nasib akhir (musnah/permanen).

5. **Log Aktivitas** (Menu: Log Aktivitas, URL: /dashboard/activity)
   - Lokasi: Menu kelima di sidebar kiri (ikon dokumen)
   - Fungsi: Melihat riwayat aktivitas pengguna di sistem (upload, edit, hapus dokumen, dsb.).

6. **Laporan** (Menu: Laporan, URL: /dashboard/laporan)
   - Lokasi: Menu keenam di sidebar kiri (ikon link)
   - Fungsi: Mengunduh rekapitulasi dan laporan audit kearsipan.

7. **SIDOKU AI (Chatbot)**
   - Lokasi: Tombol mengambang (pop-up) di pojok kanan bawah layar
   - Fungsi: Memandu letak fitur dan cara navigasi aplikasi SIDOKU.

ELEMEN NAVIGASI UMUM:
- Sidebar Kiri: Navigasi utama aplikasi. Bisa dikecilkan/diperbesar dengan tombol "Sembunyikan" di bagian bawah sidebar.
- Header Atas: Menampilkan nama halaman aktif, nama instansi (Kantor Kecamatan Bandung Kidul — Kota Bandung), tombol notifikasi, dan profil pengguna.
- Tombol Notifikasi: Di pojok kanan atas header, ikon lonceng.
- Profil Pengguna: Di pojok kanan atas header setelah tombol notifikasi, menampilkan avatar dan nama role.

GAYA KOMUNIKASI & ATURAN FORMAT:
- Bahasa Indonesia yang ramah, santun, singkat, dan langsung pada intinya.
- JANGAN gunakan tanda bintang ganda (**) atau tanda bintang tunggal (*) untuk menebalkan/memiringkan teks. Hindari format bintang sama sekali. Gunakan teks polos yang rapi dan bersih.
- Langsung jelaskan letak menu dan fungsinya.
- WAJIB: Setiap kali menjelaskan atau merekomendasikan menu/fitur, SELALU sertakan tautan tombol langsung di akhir jawaban dengan format [Buka Nama Fitur](URL_HALAMAN).
  Daftar tautan:
  * Dashboard: [Buka Halaman Dashboard](/dashboard)
  * Explorer Eviden: [Buka Explorer Eviden](/dashboard/explorer)
  * Upload Dokumen: [Buka Halaman Upload Dokumen](/dashboard/upload)
  * Jadwal JRA: [Buka Jadwal JRA](/dashboard/jra)
  * Log Aktivitas: [Buka Log Aktivitas](/dashboard/activity)
  * Laporan: [Buka Halaman Laporan](/dashboard/laporan)

- WAJIB SARAN PERTANYAAN LANJUTAN (SUGGESTIONS):
  Di baris paling akhir respons, SELALU buat pemisah persis:
  ---SUGGESTIONS---
  Lalu tuliskan 2 sampai 3 pertanyaan lanjutan yang SANGAT RELEVAN dengan topik yang baru saja ditanyakan (singkat, padat, tanpa tanda bintang), masing-masing diawali tanda minus (-).
  Contoh jika baru membahas upload:
  ---SUGGESTIONS---
  - Format berkas apa saja yang didukung?
  - Dimana melihat dokumen yang sudah diunggah?
  - Bagaimana cara cek kesiapan audit?

- Jika pengguna bertanya di luar topik navigasi SIDOKU, jawab dengan sopan: "Maaf, saya khusus membantu navigasi fitur aplikasi SIDOKU. Silakan tanyakan letak atau cara menggunakan fitur tertentu di SIDOKU."
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'API Key Gemini belum disetel. Harap atur GEMINI_API_KEY pada file .env.local',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Ambil maksimal 10 pesan terakhir untuk menjaga efisiensi memory & kecepatan respon
    const recentMessages = messages.slice(-10);

    // Konversi riwayat pesan ke format Gemini API (role: 'user' | 'model')
    const contents = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    // Urutan model tercepat dan paling responsif (dengan per-request timeout 5 detik)
    const modelsToTry = [
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
    ];
    let lastError: unknown = null;
    let replyText = '';

    for (const model of modelsToTry) {
      const abortCtrl = new AbortController();
      const timeoutId = setTimeout(() => abortCtrl.abort(), 5000);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: abortCtrl.signal,
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
              contents: contents,
              generationConfig: {
                temperature: 0.6,
                topP: 0.9,
                maxOutputTokens: 1024,
              },
            }),
          }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData?.error?.message || `HTTP ${response.status} saat memanggil model ${model}`
          );
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const textPart = candidate?.content?.parts?.[0]?.text;

        if (textPart) {
          replyText = textPart;
          break;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        console.warn(`Model ${model} gagal atau timeout, mencoba model berikutnya...`, err);
      }
    }

    if (!replyText) {
      throw lastError || new Error('Tidak ada respon yang dihasilkan dari model AI.');
    }

    // Pisahkan isi balasan utama dan saran pertanyaan lanjutan (suggestions)
    let cleanReply = replyText;
    let suggestions: string[] = [];

    if (replyText.includes('---SUGGESTIONS---')) {
      const parts = replyText.split('---SUGGESTIONS---');
      cleanReply = parts[0].trim();
      const suggestionsText = parts[1] || '';
      suggestions = suggestionsText
        .split('\n')
        .map((s) => s.replace(/^[-*•\d.]\s*/, '').replace(/\*+/g, '').trim())
        .filter((s) => s.length > 3 && s.length < 80)
        .slice(0, 3);
    }

    // Saran default jika tidak terdeteksi
    if (suggestions.length === 0) {
      suggestions = [
        'Bagaimana cara upload dokumen eviden?',
        'Dimana letak Explorer Dokumen?',
        'Cara cek Jadwal Retensi Arsip (JRA)?',
      ];
    }

    // Simpan riwayat chat ke Supabase secara otomatis di background
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const lastUserMsg = messages[messages.length - 1]?.content;
      try {
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_messages`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            { role: 'user', content: lastUserMsg },
            { role: 'assistant', content: cleanReply },
          ]),
        }).catch(() => {});
      } catch {}
    }

    return NextResponse.json({ reply: cleanReply, suggestions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal saat menghubungi asisten AI Gemini.';
    console.error('Error pada API /api/chat:', error);
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
