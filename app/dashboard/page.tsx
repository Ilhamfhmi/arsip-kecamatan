export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Eviden',    value: '0',   unit: 'dokumen', color: 'bg-gov-navy',   icon: '📁' },
          { label: 'Sudah Upload',    value: '0',   unit: 'eviden',  color: 'bg-status-green', icon: '✅' },
          { label: 'Belum Upload',    value: '0',   unit: 'eviden',  color: 'bg-status-yellow', icon: '⚠️' },
          { label: 'Kesiapan Audit',  value: '0%',  unit: 'lengkap', color: 'bg-gov-blue',   icon: '📊' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gov-border p-5">
            <p className="text-gov-muted text-xs mb-3">{s.label}</p>
            <p className="text-3xl font-bold text-gov-text">{s.value}</p>
            <p className="text-gov-muted text-xs mt-1">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Memory map placeholder */}
      <div className="bg-white rounded-2xl border border-gov-border p-6">
        <h2 className="font-semibold text-gov-text mb-1">Memory Map Kesiapan Eviden</h2>
        <p className="text-gov-muted text-xs mb-4">Progress per aspek audit kearsipan</p>
        <div className="space-y-3">
          {['Aspek 1 — Kebijakan Kearsipan','Aspek 2 — Pembinaan Kearsipan','Aspek 3 — Pengelolaan Arsip Dinamis','Aspek 4 — Sumber Daya Kearsipan'].map((asp) => (
            <div key={asp}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gov-text">{asp}</span>
                <span className="text-gov-muted">0 / 0</span>
              </div>
              <div className="h-2 bg-gov-border rounded-full">
                <div className="h-2 bg-gov-navy rounded-full w-0"/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-2xl border border-gov-border p-6">
        <h2 className="font-semibold text-gov-text mb-4">Aktivitas Terbaru</h2>
        <div className="text-center py-8 text-gov-muted">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p className="text-sm">Belum ada aktivitas</p>
        </div>
      </div>
    </div>
  )
}