'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [remember, setRemember]   = useState(false)
  const [error, setError]         = useState('')
  const [notice, setNotice]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [capsLock, setCapsLock]   = useState(false)
  const [shake, setShake]         = useState(false)

  const router   = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const triggerError = (msg: string) => {
    setError(msg); setNotice('')
    setShake(true); setTimeout(() => setShake(false), 500)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || success) return
    setLoading(true); setError(''); setNotice('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        triggerError(error.message)
        setLoading(false); return
      }
      setSuccess(true)
      setTimeout(() => { router.push('/dashboard'); router.refresh() }, 800)
    } catch {
      triggerError('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!emailValid) {
      triggerError('Masukkan email yang valid dulu untuk reset password.')
      emailRef.current?.focus(); return
    }
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setNotice('Link reset password sudah dikirim ke email Anda.')
    } catch {
      triggerError('Gagal mengirim link reset. Coba beberapa saat lagi.')
    }
  }

  const detectCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') setCapsLock(e.getModifierState('CapsLock'))
  }

  const features = [
    'Inventarisasi eviden UP & UK',
    'Upload & klasifikasi per aspek audit',
    'Memory map kesiapan dokumen',
    'Laporan PDF & Excel otomatis',
  ]

  return (
    <>
      <style>{`
        @keyframes float-slow   { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(18px,-24px) scale(1.06);} }
        @keyframes float-slower { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-20px,16px) scale(0.94);} }
        @keyframes shake        { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }
        @keyframes pop-in       { 0%{transform:scale(0.6);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        @keyframes fade-up      { 0%{opacity:0;transform:translateY(10px);} 100%{opacity:1;transform:translateY(0);} }
        .anim-shake   { animation: shake 0.4s ease-in-out; }
        .anim-pop     { animation: pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .anim-fade-up { animation: fade-up 0.5s ease-out both; }
      `}</style>

      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">

        {/* SUCCESS OVERLAY */}
        {success && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center anim-fade-up">
            <div className="bg-white rounded-2xl p-8 shadow-2xl anim-pop flex flex-col items-center gap-3 border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="font-semibold text-gov-text">Berhasil masuk</p>
              <p className="text-sm text-gov-muted">Mengarahkan ke dashboard…</p>
            </div>
          </div>
        )}

        <div
          className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl border border-slate-300"
          style={{ height: 'min(660px, calc(100vh - 48px))' }}
        >

          {/* LEFT */}
          <div className="hidden lg:flex w-[42%] h-full bg-gov-navy flex-col justify-between p-10 relative overflow-hidden flex-shrink-0">
            <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs><pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.8"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#g)" />
            </svg>
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gov-blue opacity-30"
              style={{ animation: 'float-slow 9s ease-in-out infinite' }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-gov-sky opacity-15"
              style={{ animation: 'float-slower 11s ease-in-out infinite' }}
            />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3 anim-fade-up">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10">
                <span className="text-gov-navy font-bold text-xl">S</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">SIDOKU</p>
                <p className="text-blue-300 text-xs">Sistem Informasi Dokumen Kecamatan</p>
              </div>
            </div>

            {/* Teks + fitur */}
            <div className="relative z-10">
              <h2 className="text-white text-3xl font-bold leading-snug mb-4 anim-fade-up" style={{ animationDelay: '80ms' }}>
                Kelola Eviden<br/>Audit Kearsipan<br/>
                <span className="text-gov-sky">Lebih Mudah.</span>
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed mb-8 anim-fade-up" style={{ animationDelay: '160ms' }}>
                Platform digital pengelolaan dokumen dan monitoring kesiapan audit kearsipan Kecamatan Bandung Kidul.
              </p>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 anim-fade-up"
                    style={{ animationDelay: `${240 + i * 90}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full border border-gov-sky bg-gov-sky bg-opacity-20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-gov-sky" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-blue-200 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative z-10 text-blue-400 text-xs">© 2026 Dinas Arsip Kota Bandung</p>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[58%] h-full bg-white flex items-center justify-center px-12">
            <div className="w-full max-w-sm">

              <div className="flex lg:hidden items-center gap-3 mb-8">
                <div className="w-9 h-9 bg-gov-navy rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <p className="font-bold text-gov-text text-sm">SIDOKU</p>
                  <p className="text-gov-muted text-xs">Sistem Informasi Dokumen Kecamatan</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gov-text mb-1">Selamat Datang</h2>
              <p className="text-gov-muted text-sm mb-8">Masuk menggunakan akun instansi Anda.</p>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gov-text mb-1.5">Email</label>
                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-muted group-focus-within:text-gov-blue transition-colors" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <input
                      id="email"
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError('')
                        if (notice) setNotice('')
                      }}
                      required
                      autoComplete="email"
                      placeholder="nama@kecamatan.go.id"
                      className="w-full border border-gov-border rounded-xl pl-10 pr-10 py-3 text-sm text-gov-text placeholder:text-gov-muted focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent transition"
                    />
                    {emailValid && (
                      <svg
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 anim-pop"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                        strokeLinecap="round" strokeLinejoin="round" aria-label="Email valid"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gov-text">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-gov-blue hover:text-gov-navy font-medium transition-colors"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-muted group-focus-within:text-gov-blue transition-colors" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (error) setError('')
                        if (notice) setNotice('')
                      }}
                      onKeyUp={detectCapsLock}
                      onKeyDown={detectCapsLock}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full border border-gov-border rounded-xl pl-10 pr-11 py-3 text-sm text-gov-text placeholder:text-gov-muted focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gov-muted hover:text-gov-text hover:bg-slate-100 transition"
                    >
                      {showPass
                        ? <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                        : <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>}
                    </button>
                  </div>
                  {capsLock && (
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1 anim-fade-up">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
                      </svg>
                      Caps Lock sedang aktif
                    </p>
                  )}
                </div>

                {/* REMEMBER */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gov-muted hover:text-gov-text transition-colors">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
                  <span className="w-4 h-4 rounded border border-gov-border bg-white flex items-center justify-center peer-checked:bg-gov-navy peer-checked:border-gov-navy transition-colors">
                    {remember && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  Ingat saya
                </label>

                {/* ERROR / NOTICE */}
                {error && (
                  <div className={`flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl ${shake ? 'anim-shake' : ''}`}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                {notice && (
                  <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl anim-fade-up">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>{notice}</span>
                  </div>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gov-navy hover:bg-gov-blue active:scale-[0.99] text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  />
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Memverifikasi...
                    </>
                  ) : 'Masuk ke Sistem'}
                </button>
              </form>

              <p className="text-center text-xs text-gov-muted mt-6">
                Butuh akses?{' '}
                <span className="text-gov-blue font-medium cursor-pointer hover:underline">Hubungi Administrator</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}