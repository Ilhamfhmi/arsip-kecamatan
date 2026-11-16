'use client'

export default function LaporanPage() {
  const aspekReport = [
    {
      aspek: 'Aspek 1 — Kebijakan Kearsipan',
      target: 8,
      terpenuhi: 7,
      persen: 87.5,
      status: 'Sangat Baik',
    },
    {
      aspek: 'Aspek 2 — Pembinaan Kearsipan',
      target: 6,
      terpenuhi: 4,
      persen: 66.7,
      status: 'Cukup',
    },
    {
      aspek: 'Aspek 3 — Pengelolaan Arsip Dinamis',
      target: 12,
      terpenuhi: 9,
      persen: 75.0,
      status: 'Baik',
    },
    {
      aspek: 'Aspek 4 — Sumber Daya Kearsipan',
      target: 5,
      terpenuhi: 4,
      persen: 80.0,
      status: 'Baik',
    },
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gov-border">
        <div>
          <h2 className="text-xl font-bold text-gov-text">Laporan Kesiapan Audit Kearsipan</h2>
          <p className="text-gov-muted text-xs mt-1">
            Rekapitulasi pencapaian eviden dan evaluasi kearsipan Kantor Kecamatan Bandung Kidul
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold bg-gov-navy hover:bg-gov-blue text-white rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gov-border">
          <p className="text-xs text-gov-muted mb-2">Nilai Kesiapan Keseluruhan</p>
          <p className="text-3xl font-bold text-gov-navy">78.5%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Kategori: B (Baik)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gov-border">
          <p className="text-xs text-gov-muted mb-2">Total Dokumen Eviden</p>
          <p className="text-3xl font-bold text-gov-text">24 / 31</p>
          <p className="text-[11px] text-gov-muted mt-1">7 eviden belum dilengkapi</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gov-border">
          <p className="text-xs text-gov-muted mb-2">Jadwal Audit Kearsipan</p>
          <p className="text-xl font-bold text-gov-text">Desember 2026</p>
          <p className="text-[11px] text-gov-muted mt-1">Oleh Dispusipda Kota Bandung</p>
        </div>
      </div>

      {/* Tabel Rincian per Aspek */}
      <div className="bg-white rounded-2xl border border-gov-border p-6">
        <h3 className="font-semibold text-sm text-gov-text mb-4">
          Rincian Capaian per Aspek Kearsipan
        </h3>
        <div className="space-y-4">
          {aspekReport.map((asp, idx) => (
            <div key={idx} className="border border-gov-border rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1">
                <span className="font-semibold text-gov-text">{asp.aspek}</span>
                <span className="text-gov-muted">
                  {asp.terpenuhi} dari {asp.target} dokumen ({asp.persen}%) •{' '}
                  <span className="font-semibold text-gov-navy">{asp.status}</span>
                </span>
              </div>
              <div className="h-2.5 bg-gov-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gov-navy rounded-full transition-all duration-500"
                  style={{ width: `${asp.persen}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
