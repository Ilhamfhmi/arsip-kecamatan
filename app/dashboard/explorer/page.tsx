'use client'

import { useState } from 'react'

const aspekList = [
  { id: 'all', name: 'Semua Aspek' },
  { id: '1', name: 'Aspek 1 — Kebijakan Kearsipan' },
  { id: '2', name: 'Aspek 2 — Pembinaan Kearsipan' },
  { id: '3', name: 'Aspek 3 — Pengelolaan Arsip Dinamis' },
  { id: '4', name: 'Aspek 4 — Sumber Daya Kearsipan' },
]

const sampleEviden = [
  {
    id: 1,
    aspek: '1',
    kode: 'EVD-KBJ-01',
    nama: 'SK Penetapan Tata Naskah Dinas Kecamatan',
    kategori: 'Kebijakan',
    status: 'Lengkap',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tanggal: '12 Okt 2026',
    ukuran: '2.4 MB',
    format: 'PDF',
  },
  {
    id: 2,
    aspek: '1',
    kode: 'EVD-KBJ-02',
    nama: 'Instruksi Camat Mengenai Klasifikasi Arsip',
    kategori: 'Kebijakan',
    status: 'Lengkap',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tanggal: '18 Okt 2026',
    ukuran: '1.8 MB',
    format: 'PDF',
  },
  {
    id: 3,
    aspek: '2',
    kode: 'EVD-PBN-01',
    nama: 'Laporan Bimbingan Teknis Kearsipan Internal Triwulan II',
    kategori: 'Pembinaan',
    status: 'Dalam Proses',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    tanggal: '25 Okt 2026',
    ukuran: '3.1 MB',
    format: 'PDF',
  },
  {
    id: 4,
    aspek: '3',
    kode: 'EVD-PAD-01',
    nama: 'Daftar Arsip Aktif Seksi Pemerintahan',
    kategori: 'Pengelolaan',
    status: 'Lengkap',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tanggal: '02 Nov 2026',
    ukuran: '850 KB',
    format: 'PDF',
  },
  {
    id: 5,
    aspek: '3',
    kode: 'EVD-PAD-02',
    nama: 'Berita Acara Pemindahan Arsip Inaktif ke Central File',
    kategori: 'Pengelolaan',
    status: 'Belum Upload',
    statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
    tanggal: '-',
    ukuran: '-',
    format: '-',
  },
  {
    id: 6,
    aspek: '4',
    kode: 'EVD-SDK-01',
    nama: 'Daftar Inventaris Sarana & Prasarana Ruang Arsip',
    kategori: 'Sumber Daya',
    status: 'Lengkap',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tanggal: '08 Nov 2026',
    ukuran: '4.2 MB',
    format: 'PDF',
  },
]

export default function ExplorerPage() {
  const [selectedAspek, setSelectedAspek] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = sampleEviden.filter((item) => {
    const matchAspek = selectedAspek === 'all' || item.aspek === selectedAspek
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
    return matchAspek && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gov-border">
        <div>
          <h2 className="text-xl font-bold text-gov-text">Explorer Dokumen Eviden</h2>
          <p className="text-gov-muted text-xs mt-1">
            Telusuri dan kelola bukti dukung kearsipan berdasarkan 4 aspek audit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode eviden..."
            className="px-4 py-2 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 w-64"
          />
        </div>
      </div>

      {/* Tabs Filter Aspek */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {aspekList.map((asp) => (
          <button
            key={asp.id}
            onClick={() => setSelectedAspek(asp.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition ${
              selectedAspek === asp.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-white text-gov-muted hover:text-gov-text border border-gov-border hover:bg-gov-surface'
            }`}
          >
            {asp.name}
          </button>
        ))}
      </div>

      {/* Grid Kartu Dokumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-gov-border p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-semibold text-gov-muted bg-gov-surface px-2 py-1 rounded-md border border-gov-border">
                  {doc.kode}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${doc.statusColor}`}
                >
                  {doc.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gov-text line-clamp-2 mb-2">
                {doc.nama}
              </h3>
              <p className="text-xs text-gov-muted">Kategori: {doc.kategori}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-gov-border flex items-center justify-between text-xs text-gov-muted">
              <div>
                <span>{doc.format}</span> • <span>{doc.ukuran}</span>
              </div>
              <button className="text-gov-navy hover:text-gov-blue font-semibold hover:underline">
                Lihat Berkas →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gov-border p-12 text-center text-gov-muted">
          <p className="text-sm">Tidak ada dokumen eviden yang sesuai dengan filter.</p>
        </div>
      )}
    </div>
  )
}
