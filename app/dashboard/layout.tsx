'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Explorer Eviden',
    href: '/dashboard/explorer',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
      </svg>
    ),
  },
  {
    label: 'Upload Dokumen',
    href: '/dashboard/upload',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    label: 'Jadwal JRA',
    href: '/dashboard/jra',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Log Aktivitas',
    href: '/dashboard/activity',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: 'Laporan',
    href: '/dashboard/laporan',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 17H7A5 5 0 017 7h2"/><path d="M15 7h2a5 5 0 010 10h-2"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gov-surface flex">

      {/* SIDEBAR */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-gov-navy flex flex-col transition-all duration-300`}>

        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white border-opacity-10 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-gov-navy font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">SIDOKU</p>
              <p className="text-blue-300 text-[10px]">Kecamatan Bandung Kidul</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${active
                    ? 'bg-white bg-opacity-15 text-white'
                    : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}>
                {item.icon}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 pb-4">
          <button onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-300
                        hover:bg-white hover:bg-opacity-10 hover:text-white transition-all
                        ${collapsed ? 'justify-center' : ''}`}>
            <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {!collapsed && <span className="text-xs">Sembunyikan</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="bg-white border-b border-gov-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-gov-text font-semibold text-base">
              {navItems.find(n => n.href === pathname)?.label ?? 'Dashboard'}
            </h1>
            <p className="text-gov-muted text-xs mt-0.5">
              Kantor Kecamatan Bandung Kidul — Kota Bandung
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notif */}
            <button className="w-9 h-9 rounded-xl border border-gov-border flex items-center justify-center text-gov-muted hover:text-gov-text hover:bg-gov-surface transition relative">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gov-border">
              <div className="w-8 h-8 bg-gov-navy rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-gov-text text-xs font-medium leading-tight">Admin</p>
                <p className="text-gov-muted text-[10px]">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}