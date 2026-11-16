'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_KEY = 'sidoku_chat_memory_v1';

const INITIAL_SUGGESTIONS = [
  'Menu Dashboard ada dimana?',
  'Dimana fitur Upload Dokumen?',
  'Bagaimana cara akses Explorer Eviden?',
  'Dimana fitur Jadwal Retensi Arsip (JRA)?',
];

const DEFAULT_WELCOME: Message = {
  id: 'welcome-init',
  role: 'assistant',
  content:
    'Halo! Saya SIDOKU AI, asisten panduan fitur aplikasi SIDOKU Kecamatan Bandung Kidul. Tanyakan menu atau fitur yang ingin Anda cari, saya akan langsung memandu Anda!',
  timestamp: '',
};

// Fungsi helper untuk merender teks tebal bersih dan tombol navigasi link langsung
function renderCleanText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Regex memisahkan [Label](URL), **bold**, dan *italic*
    const parts = line.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/g);
    return (
      <span key={lineIdx} className={lineIdx > 0 ? 'block mt-1.5' : 'block'}>
        {parts.map((part, partIdx) => {
          // Format Link tombol: [Label](URL)
          const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
          if (linkMatch) {
            const [, label, href] = linkMatch;
            return (
              <span key={partIdx} className="block my-2">
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gov-navy hover:bg-gov-blue text-white text-xs font-semibold rounded-xl shadow-xs transition hover:shadow-md transform hover:-translate-y-0.5 border border-white/10"
                >
                  <span>{label}</span>
                  <span className="text-amber-300 font-bold">→</span>
                </Link>
              </span>
            );
          }

          // Format Tebal: **text**
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-bold text-gov-navy">
                {part.slice(2, -2)}
              </strong>
            );
          }

          // Format Miring: *text*
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <span key={partIdx} className="font-semibold text-gov-text">
                {part.slice(1, -1)}
              </span>
            );
          }

          return part;
        })}
      </span>
    );
  });
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const supabaseRef = useRef(createClient());

  // Muat memori riwayat chat dari Database Supabase (dengan fallback ke LocalStorage)
  useEffect(() => {
    async function loadChatHistory() {
      const supabase = supabaseRef.current;
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('id, role, content, created_at')
          .order('created_at', { ascending: true })
          .limit(50);

        if (!error && data && data.length > 0) {
          const loaded: Message[] = data.map((item: { id: string; role: string; content: string; created_at: string }) => ({
            id: item.id,
            role: item.role as 'user' | 'assistant',
            content: item.content,
            timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setMessages(loaded);
          return;
        }
      } catch {
        // Abaikan jika tabel di Supabase belum ada / koneksi offline
      }

      // Fallback ke LocalStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {}

      setMessages([
        {
          ...DEFAULT_WELCOME,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }

    loadChatHistory();
  }, []);

  // Simpan memori riwayat chat ke LocalStorage & Supabase
  const saveMemory = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMsgs));
    } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMessage];
    saveMemory(updated);
    setInput('');
    setLoading(true);

    // Simpan pesan pengguna ke database Supabase (background)
    try {
      supabaseRef.current.from('chat_messages').insert([{ role: 'user', content: text }]).then(() => {});
    } catch {}

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Maaf, saya tidak dapat memproses pertanyaan tersebut.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      saveMemory([...updated, botMessage]);

      // Simpan respons AI ke database Supabase (background)
      try {
        supabaseRef.current.from('chat_messages').insert([{ role: 'assistant', content: botMessage.content }]).then(() => {});
      } catch {}
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        const cancelMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⏹️ *(Respons dibatalkan oleh pengguna)*',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        saveMemory([...updated, cancelMessage]);
      } else {
        const errMsg = err instanceof Error ? err.message : 'Gagal terhubung ke server.';
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Kendala koneksi:** ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        saveMemory([...updated, errorMessage]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Bersihkan memori percakapan SIDOKU AI?')) {
      const resetList: Message[] = [
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Memori percakapan telah dibersihkan. Tanyakan letak fitur SIDOKU yang ingin Anda temukan!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      saveMemory(resetList);
      setSuggestions(INITIAL_SUGGESTIONS);
      try {
        supabaseRef.current.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000').then(() => {});
      } catch {}
    }
  };

  return (
    <>
      {/* Tombol Mengambang (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Chatbot AI"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-gov-navy hover:bg-gov-blue text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-cyan-900/30 transition-all duration-200 border border-white/20 focus:outline-none focus:ring-4 focus:ring-gov-sky/30"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <svg
          className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <span className="font-semibold text-sm tracking-wide">SIDOKU AI</span>
      </button>

      {/* Pop-up Window Chatbot */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[78vh] bg-white rounded-2xl shadow-2xl border border-gov-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header Pop-up */}
          <div className="bg-gov-navy text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">SIDOKU AI</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                    Aktif
                  </span>
                </div>
                <p className="text-blue-200 text-[11px] leading-tight">
                  Panduan Navigasi & Fitur
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              {/* Tombol Bersihkan Memori */}
              <button
                onClick={handleClearChat}
                title="Bersihkan Memori Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-blue-200 hover:text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              {/* Tombol Tutup Pop-up */}
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-blue-200 hover:text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Isi Pesan (Chat Thread) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gov-surface/60">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? 'bg-gov-navy text-white'
                        : 'bg-gov-blue text-amber-300 shadow-xs'
                    }`}
                  >
                    {isUser ? 'U' : 'AI'}
                  </div>

                  {/* Bubble Chat */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                      isUser
                        ? 'bg-gov-navy text-white rounded-tr-none'
                        : 'bg-white text-gov-text border border-gov-border rounded-tl-none'
                    }`}
                  >
                    <div className="font-sans leading-relaxed">
                      {renderCleanText(m.content)}
                    </div>

                    <div
                      className={`flex items-center justify-between gap-3 mt-1.5 pt-1 border-t ${
                        isUser
                          ? 'border-white/15 text-blue-200 text-[10px]'
                          : 'border-gov-border/60 text-gov-muted text-[10px]'
                      }`}
                    >
                      <span>{m.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-gov-navy font-medium transition"
                          title="Salin jawaban"
                        >
                          {copiedId === m.id ? (
                            <span className="text-emerald-600 font-semibold">Tersalin ✓</span>
                          ) : (
                            <span>Salin</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Status Loading */}
            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-gov-blue text-amber-300 flex items-center justify-center text-xs font-bold shadow-xs">
                  AI
                </div>
                <div className="bg-white border border-gov-border px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-gov-muted flex items-center gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gov-navy rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gov-navy rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gov-navy rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>Mencari letak fitur...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Area Input & Tombol Cancel */}
          <div className="p-3 bg-white border-t border-gov-border flex-shrink-0">
            {/* Saran Pertanyaan yang Selalu Refresh Sesuai Topik (ala Gemini) */}
            {!loading && suggestions.length > 0 && (
              <div className="mb-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gov-surface hover:bg-gov-light text-gov-navy border border-gov-border hover:border-gov-blue/40 text-[11px] font-medium rounded-full whitespace-nowrap transition shadow-2xs hover:shadow-xs flex-shrink-0"
                    >
                      <span className="text-amber-500 text-xs">✨</span>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Tombol Cancel / Batal yang muncul saat AI sedang menjawab (ala Gemini) */}
            {loading && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium rounded-full transition shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  <span>Hentikan Jawaban</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-gov-surface border border-gov-border focus-within:border-gov-blue focus-within:ring-2 focus-within:ring-gov-sky/20 rounded-xl px-3 py-1.5 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya letak fitur di SIDOKU..."
                rows={1}
                disabled={loading}
                className="w-full bg-transparent resize-none outline-none text-xs sm:text-sm text-gov-text placeholder:text-gov-muted max-h-24 py-1"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Kirim Pesan"
                className="w-8 h-8 rounded-lg bg-gov-navy hover:bg-gov-blue disabled:opacity-40 disabled:hover:bg-gov-navy text-white flex items-center justify-center transition flex-shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gov-muted mt-2 px-1">
              <span>Memori tersimpan otomatis</span>
              <span>SIDOKU Kec. Bandung Kidul</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
