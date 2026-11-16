'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [aspek, setAspek] = useState('1')
  const [namaDokumen, setNamaDokumen] = useState('')
  const [jenisDokumen, setJenisDokumen] = useState('SK')
  const [keterangan, setKeterangan] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaDokumen || !fileName) {
      alert('Harap lengkapi nama dokumen dan pilih berkas!')
      return
    }
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setNamaDokumen('')
      setKeterangan('')
      setFileName(null)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gov-border">
        <h2 className="text-xl font-bold text-gov-text">Upload Dokumen Eviden</h2>
        <p className="text-gov-muted text-xs mt-1">
          Unggah berkas bukti dukung kearsipan dalam format PDF, JPG, atau PNG (Maks. 25 MB)
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-semibold">Dokumen Berhasil Diunggah!</p>
            <p className="text-xs text-emerald-600">
              Berkas eviden Anda telah disimpan dan siap ditinjau untuk audit kearsipan.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gov-border space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Aspek Audit */}
          <div>
            <label className="block text-xs font-semibold text-gov-text mb-2">
              Aspek Audit Kearsipan
            </label>
            <select
              value={aspek}
              onChange={(e) => setAspek(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 text-gov-text"
            >
              <option value="1">Aspek 1 — Kebijakan Kearsipan</option>
              <option value="2">Aspek 2 — Pembinaan Kearsipan</option>
              <option value="3">Aspek 3 — Pengelolaan Arsip Dinamis</option>
              <option value="4">Aspek 4 — Sumber Daya Kearsipan</option>
            </select>
          </div>

          {/* Jenis Dokumen */}
          <div>
            <label className="block text-xs font-semibold text-gov-text mb-2">
              Jenis Dokumen
            </label>
            <select
              value={jenisDokumen}
              onChange={(e) => setJenisDokumen(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 text-gov-text"
            >
              <option value="SK">Surat Keputusan (SK)</option>
              <option value="SOP">Standar Operasional Prosedur (SOP)</option>
              <option value="Berita Acara">Berita Acara</option>
              <option value="Daftar Berkas">Daftar Berkas / Arsip</option>
              <option value="Foto">Foto / Dokumentasi Sarpras</option>
              <option value="Lainnya">Dokumen Lainnya</option>
            </select>
          </div>
        </div>

        {/* Nama Dokumen */}
        <div>
          <label className="block text-xs font-semibold text-gov-text mb-2">
            Nama / Judul Dokumen Eviden <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={namaDokumen}
            onChange={(e) => setNamaDokumen(e.target.value)}
            placeholder="Contoh: SK Tim Pembina Kearsipan Kecamatan Bandung Kidul Tahun 2026"
            className="w-full px-3.5 py-2.5 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 text-gov-text"
            required
          />
        </div>

        {/* File Drag and Drop Area */}
        <div>
          <label className="block text-xs font-semibold text-gov-text mb-2">
            Pilih Berkas Dokumen <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gov-border hover:border-gov-blue rounded-2xl p-8 text-center transition bg-gov-surface/50">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gov-blue/60 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-xs font-semibold text-gov-navy hover:underline">
                {fileName ? fileName : 'Klik untuk memilih berkas atau tarik ke sini'}
              </span>
              <span className="text-[11px] text-gov-muted mt-1">
                Format yang didukung: PDF, JPG, PNG (Maksimal 25MB)
              </span>
            </label>
          </div>
        </div>

        {/* Catatan / Keterangan */}
        <div>
          <label className="block text-xs font-semibold text-gov-text mb-2">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            rows={3}
            placeholder="Keterangan singkat mengenai dokumen yang diunggah..."
            className="w-full px-3.5 py-2.5 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 text-gov-text"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => {
              setNamaDokumen('')
              setFileName(null)
              setKeterangan('')
            }}
            className="px-5 py-2.5 text-xs font-medium text-gov-muted hover:text-gov-text border border-gov-border rounded-xl hover:bg-gov-surface transition"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold bg-gov-navy hover:bg-gov-blue text-white rounded-xl shadow-xs transition"
          >
            Simpan Dokumen Eviden
          </button>
        </div>
      </form>
    </div>
  )
}
