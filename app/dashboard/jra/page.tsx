'use client'

import { useState } from 'react'

const sampleJRA = [
  {
    kode: '005.1',
    jenis: 'Undangan Rapat Koordinasi Kecamatan',
    aktif: '1 Tahun',
    inaktif: '1 Tahun',
    nasib: 'Musnah',
    keterangan: 'Pemusnahan berkala sesuai BA',
  },
  {
    kode: '050',
    jenis: 'Rencana Kerja & Program Kecamatan (Renja/Renstra)',
    aktif: '2 Tahun',
    inaktif: '5 Tahun',
    nasib: 'Permanen',
    keterangan: 'Diserahkan ke Lembaga Kearsipan Daerah',
  },
  {
    kode: '100.1',
    jenis: 'Laporan Pelaksanaan Tugas Ketentraman dan Ketertiban',
    aktif: '2 Tahun',
    inaktif: '2 Tahun',
    nasib: 'Musnah',
    keterangan: 'Pemusnahan setelah diverifikasi',
  },
  {
    kode: '400.2',
    jenis: 'Berkas Pelayanan Administrasi Kependudukan',
    aktif: '2 Tahun',
    inaktif: '3 Tahun',
    nasib: 'Musnah',
    keterangan: 'Disimpan di Central File kecamatan',
  },
  {
    kode: '800.1',
    jenis: 'Berkas Kepegawaian & Penilaian Kinerja ASN Kecamatan',
    aktif: 'Selama Bekerja',
    inaktif: '5 Tahun',
    nasib: 'Permanen',
    keterangan: 'Arsip bernilai guna personal',
  },
  {
    kode: '900.3',
    jenis: 'SPJ & Bukti Pengeluaran Kas Keuangan Kecamatan',
    aktif: '1 Tahun',
    inaktif: '9 Tahun',
    nasib: 'Musnah',
    keterangan: 'Setelah diaudit oleh BPK / Inspektorat',
  },
]

export default function JRAPage() {
  const [search, setSearch] = useState('')

  const filtered = sampleJRA.filter(
    (item) =>
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gov-border">
        <div>
          <h2 className="text-xl font-bold text-gov-text">Jadwal Retensi Arsip (JRA)</h2>
          <p className="text-gov-muted text-xs mt-1">
            Pedoman masa simpan dan penentuan nasib akhir arsip dinamis Kecamatan Bandung Kidul
          </p>
        </div>
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode atau jenis arsip..."
            className="px-4 py-2 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gov-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gov-surface border-b border-gov-border text-[11px] font-semibold text-gov-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Kode</th>
                <th className="py-3.5 px-4">Jenis Arsip</th>
                <th className="py-3.5 px-4">Retensi Aktif</th>
                <th className="py-3.5 px-4">Retensi Inaktif</th>
                <th className="py-3.5 px-4">Nasib Akhir</th>
                <th className="py-3.5 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border text-xs text-gov-text">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-gov-surface/50 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-gov-navy">
                    {item.kode}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{item.jenis}</td>
                  <td className="py-3.5 px-4 text-gov-muted">{item.aktif}</td>
                  <td className="py-3.5 px-4 text-gov-muted">{item.inaktif}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.nasib === 'Permanen'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.nasib}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gov-muted text-[11px]">{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gov-muted text-xs">
            Data klasifikasi arsip tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}
