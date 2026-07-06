/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MUA, Booking, User } from '../types';
import { Search, Star, Eye, CalendarPlus, Crown, Sparkles, MessageCircle, Info, Phone } from 'lucide-react';

interface CustomerDashboardProps {
  muas: MUA[];
  bookings: Booking[];
  users: User[];
  onNavigateToMuaDetail: (id: number) => void;
  onNavigateToBookingForm: (id: number) => void;
}

export default function CustomerDashboard({
  muas,
  bookings,
  users,
  onNavigateToMuaDetail,
  onNavigateToBookingForm
}: CustomerDashboardProps) {
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out MUAs that are not active/approved yet (Only 'aktif' MUAs)
  const activeMuas = muas.filter((m) => m.status === 'aktif');

  // Find Top Rated MUA for the recommendation badge
  const topMUA = activeMuas.length > 0 
    ? [...activeMuas].sort((a, b) => b.rating - a.rating || a.nama.localeCompare(b.nama))[0]
    : null;

  // Real-time search filter applied to active MUAs only
  const filteredMuas = activeMuas.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || m.nama.toLowerCase().includes(q) || m.spesialisasi.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-br from-purple/80 via-rose/50 to-purple-dark border border-white/5 rounded-3xl p-6 sm:p-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-rose/25 rounded-full blur-[70px] pointer-events-none" />
        
        <div className="space-y-5 relative z-10 max-w-xl">
          <div className="flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Platform Booking MUA Terpercaya</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            Temukan MUA <span className="text-rose">Terbaikmu</span><br />untuk Hari Istimewa
          </h1>
          
          <p className="text-white/75 text-xs sm:text-sm md:text-base leading-relaxed">
            Jelajahi koleksi makeup artist profesional terbaik, lihat portofolio hasil rias asli, baca ulasan jujur pelanggan, dan booking jasa dengan aman dan instan.
          </p>

          {topMUA && (
            <button
              onClick={() => onNavigateToMuaDetail(topMUA.id)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-gold/15 border border-gold/30 text-gold shadow-md hover:bg-gold/25 transition-all text-left cursor-pointer"
            >
              <Crown size={12} fill="currentColor" />
              <span>Rekomendasi MUA Teratas: {topMUA.nama} ({topMUA.rating.toFixed(1)}/5.0)</span>
            </button>
          )}
        </div>

        {/* Stats Summary cards */}
        <div className="flex sm:flex-row md:flex-col lg:flex-row gap-4 shrink-0 justify-center relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[120px] backdrop-blur-md">
            <div className="font-serif text-3xl font-bold text-white leading-none">{activeMuas.length}+</div>
            <div className="text-[10px] text-white/40 uppercase font-semibold mt-1.5 tracking-wider">Makeup Artist</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[120px] backdrop-blur-md">
            <div className="font-serif text-3xl font-bold text-white leading-none">{bookings.length}+</div>
            <div className="text-[10px] text-white/40 uppercase font-semibold mt-1.5 tracking-wider">Booking Selesai</div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR (Requirement 3: Search Functionality) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari Makeup Artist impian berdasarkan nama, keahlian, atau spesialisasi (cth: Pernikahan, Wisuda)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-12 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rose focus:bg-rose/5 focus:ring-4 focus:ring-rose/10 transition-all shadow-xl"
        />
        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
      </div>

      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-white">
          Daftar Jasa <span className="text-rose">Makeup Artist</span>
        </h2>
        <span className="text-xs bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-full text-gray-400 font-semibold">
          {filteredMuas.length} MUA Tersedia
        </span>
      </div>

      {/* MUA PORTFOLIO GRID */}
      {filteredMuas.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl space-y-4">
          <Search size={48} className="mx-auto text-gray-500 opacity-40" />
          <h3 className="text-base font-bold text-white">Pencarian Tidak Ditemukan</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Maaf, kami tidak dapat menemukan Makeup Artist yang cocok dengan kata kunci "{searchQuery}". Coba kata kunci lainnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMuas.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-rose/30 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative"
              style={{
                animationDelay: `${idx * 0.05}s`
              }}
            >
              {/* Header Gradient line */}
              <div className="h-1 bg-gradient-to-r from-purple via-rose to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Header Information */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple to-rose flex items-center justify-center font-bold text-lg text-white font-serif shadow-inner">
                    {m.nama.charAt(0)}
                  </div>
                  <div>
                    <button
                      onClick={() => onNavigateToMuaDetail(m.id)}
                      className="font-serif text-lg font-bold text-white hover:text-rose transition-colors cursor-pointer text-left leading-tight block"
                    >
                      {m.nama}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-gold font-bold mt-0.5">
                      <Star size={12} fill="currentColor" />
                      <span>{m.rating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                  <p><span className="text-gray-500 font-medium">Spesialisasi:</span> <span className="text-white font-semibold">{m.spesialisasi || 'Belum diatur'}</span></p>
                  <p><span className="text-gray-500 font-medium">Tarif Jasa:</span> <span className="text-rose font-bold">{m.harga !== null && m.harga !== undefined && m.harga > 0 ? `Rp ${m.harga.toLocaleString('id-ID')}` : 'Belum diatur'}</span></p>
                  <p><span className="text-gray-500 font-medium">Jadwal:</span> <span className="text-gray-300">{m.jadwal || 'Belum diatur'}</span></p>
                </div>

                {/* Slogan */}
                {m.ulasan_singkat && m.ulasan_singkat.trim() !== '' && (
                  <blockquote className="border-l-2 border-rose/30 pl-3 italic text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    "{m.ulasan_singkat}"
                  </blockquote>
                )}

                {/* Actions Button */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <button
                    onClick={() => onNavigateToBookingForm(m.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-rose text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-rose-dark transition-colors cursor-pointer"
                  >
                    <CalendarPlus size={13} /> Booking
                  </button>
                  <button
                    onClick={() => onNavigateToMuaDetail(m.id)}
                    className="px-4 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5 text-gray-300 hover:text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Detail
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* INFO BOX */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-rose flex items-center justify-center gap-1.5">
          <Info size={18} />
          <span>Tentang GlamBook MUA</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Temukan riasan impian Anda sekarang juga. Kami memastikan setiap Make-Up Artist yang terdaftar di platform kami adalah tenaga ahli tepercaya yang siap memberikan pelayanan istimewa di hari kebahagiaan Anda.
        </p>
      </div>

      {/* Simulated Floating WhatsApp Button */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20GlamBook%20MUA,%20saya%20ingin%20bertanya%20seputar%20layanan%20makeup."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95 hover:shadow-green-500/40 transition-all z-40"
        title="Hubungi Admin via WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>

    </div>
  );
}
