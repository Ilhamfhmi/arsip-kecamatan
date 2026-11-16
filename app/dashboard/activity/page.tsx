'use client'

import { useState } from 'react'

const sampleLogs = [
  {
    id: 1,
    waktu: '15 Nov 2026, 19:42',
    user: 'Admin Kecamatan',
    aksi: 'Upload Dokumen',
    dokumen: 'SK Penetapan Tata Naskah Dinas Kecamatan',
    status: 'Berhasil',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 2,
    waktu: '14 Nov 2026, 14:15',
    user: 'Admin Kecamatan',
    aksi: 'Pembaruan Data',
    dokumen: 'Inventaris Sarana Central File',
    status: 'Berhasil',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 3,
    waktu: '12 Nov 2026, 10:30',
    user: 'Staff Kearsipan',
    aksi: 'Verifikasi Berkas',
    dokumen: 'Daftar Arsip Aktif Seksi Pelayanan',
    status: 'Perlu Revisi',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 4,
    waktu: '10 Nov 2026, 09:00',
    user: 'Admin Kecamatan',
    aksi: 'Inisialisasi Sistem',
    dokumen: 'Audit Kearsipan Semester II',
    status: 'Selesai',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
]

export default function ActivityPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? sampleLogs
    : sampleLogs.filter((log) => log.aksi.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gov-border">
        <div>
          <h2 className="text-xl font-bold text-gov-text">Log Aktivitas Sistem</h2>
          <p className="text-gov-muted text-xs mt-1">
            Rekam jejak tindakan dan mutasi dokumen kearsipan di SIDOKU
          </p>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3.5 py-2 text-xs border border-gov-border rounded-xl bg-gov-surface focus:outline-none focus:ring-2 focus:ring-gov-sky/30 text-gov-text"
          >
            <option value="all">Semua Aktivitas</option>
            <option value="Upload">Upload</option>
            <option value="Pembaruan">Pembaruan</option>
            <option value="Verifikasi">Verifikasi</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gov-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gov-surface border-b border-gov-border text-[11px] font-semibold text-gov-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Aksi</th>
                <th className="py-3.5 px-4">Nama Dokumen / Target</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border text-xs text-gov-text">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gov-surface/50 transition">
                  <td className="py-3.5 px-4 text-gov-muted font-mono">{log.waktu}</td>
                  <td className="py-3.5 px-4 font-semibold text-gov-navy">{log.user}</td>
                  <td className="py-3.5 px-4">{log.aksi}</td>
                  <td className="py-3.5 px-4 font-medium">{log.dokumen}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${log.statusColor}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
