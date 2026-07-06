/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, MUA, Booking, MUAPhoto, Review } from '../types';
import { ArrowLeft, Star, ImageIcon, Calendar, Phone, MapPin, Clipboard, MessageSquare, Plus, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface MuaDetailProps {
  user: User;
  muaId: number;
  muas: MUA[];
  setMuas: React.Dispatch<React.SetStateAction<MUA[]>>;
  photos: MUAPhoto[];
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  users: User[];
  onNavigate: (view: string) => void;
}

export default function MuaDetail({
  user,
  muaId,
  muas,
  setMuas,
  photos,
  reviews,
  setReviews,
  bookings,
  setBookings,
  users,
  onNavigate
}: MuaDetailProps) {

  // Active sub-tab on details view
  const [activeTab, setActiveTab] = useState<'gallery' | 'reviews' | 'booking'>('gallery');

  // Find targeted MUA
  const m = muas.find((mua) => mua.id === muaId);
  if (!m) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertCircle size={40} className="mx-auto text-rose" />
        <p className="text-gray-400">Makeup Artist tidak ditemukan.</p>
        <button onClick={() => onNavigate('home')} className="text-rose font-bold hover:underline">Kembali ke Beranda</button>
      </div>
    );
  }

  // Get MUA specific reviews and photos
  const muaReviews = reviews
    .filter((r) => r.id_mua === m.id)
    .map((r) => {
      const reviewer = users.find((u) => u.id === r.id_user);
      return {
        ...r,
        username: reviewer ? reviewer.username : 'Pelanggan'
      };
    });

  const muaPhotos = photos.filter((p) => p.id_mua === m.id);

  // ── BOOKING FORM STATE ──
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [catatan, setCatatan] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // ── REVIEW FORM STATE ──
  const [newRating, setNewRating] = useState<number>(5);
  const [newKomentar, setNewKomentar] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // ── SUBMIT BOOKING (with 3+ Validations) ──
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    const cleanAlamat = alamat.trim();
    const cleanNoHp = noHp.trim();

    // Validasi 1: Tanggal booking tidak boleh di masa lalu
    if (!tanggal || !jam) {
      setBookingError('Tanggal dan Jam booking wajib ditentukan.');
      return;
    }
    const selectedDate = new Date(tanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare date only
    if (selectedDate < today) {
      setBookingError('Tanggal booking tidak valid. Silakan pilih tanggal hari ini atau masa depan.');
      return;
    }

    // Validasi 2: Alamat harus jelas (minimal 10 karakter)
    if (!cleanAlamat) {
      setBookingError('Alamat lengkap lokasi rias wajib diisi.');
      return;
    }
    if (cleanAlamat.length < 10) {
      setBookingError('Alamat terlalu pendek. Harap tulis alamat lengkap secara detail (minimal 10 karakter).');
      return;
    }

    // Validasi 3: No HP wajib berupa angka dan minimal 10 karakter
    if (!cleanNoHp) {
      setBookingError('Nomor WhatsApp / HP wajib diisi untuk konfirmasi.');
      return;
    }
    if (!/^[0-9]+$/.test(cleanNoHp) || cleanNoHp.length < 10) {
      setBookingError('Format nomor HP tidak valid. Gunakan format angka saja (minimal 10 digit, cth: 08123456789).');
      return;
    }

    // Process Booking creation
    const newBookingId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
    const newBooking: Booking = {
      id: newBookingId,
      id_user: user.id,
      id_mua: m.id,
      tanggal,
      jam,
      no_hp: cleanNoHp,
      alamat: cleanAlamat,
      catatan: catatan.trim(),
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setBookings([newBooking, ...bookings]);
    setBookingSuccess(`Booking MUA ${m.nama} berhasil disimpan! Status pesanan Anda saat ini adalah PENDING.`);
    
    // Clear Form Fields
    setTanggal('');
    setJam('');
    setAlamat('');
    setNoHp('');
    setCatatan('');

    setTimeout(() => {
      onNavigate('booking-saya');
    }, 1500);
  };

  // ── SUBMIT REVIEW ──
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    const cleanKomentar = newKomentar.trim();
    if (!cleanKomentar) {
      setReviewError('Isi komentar ulasan Anda terlebih dahulu.');
      return;
    }

    const newReviewId = reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
    const newReview: Review = {
      id: newReviewId,
      id_user: user.id,
      id_mua: m.id,
      rating: newRating,
      komentar: cleanKomentar,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating of this MUA
    const mReviews = updatedReviews.filter((r) => r.id_mua === m.id);
    const avgRating = mReviews.reduce((sum, r) => sum + r.rating, 0) / mReviews.length;

    setMuas(
      muas.map((mua) =>
        mua.id === m.id ? { ...mua, rating: Number(avgRating.toFixed(1)) } : mua
      )
    );

    setReviewSuccess('Terima kasih! Ulasan jujur Anda telah disimpan.');
    setNewKomentar('');
    setTimeout(() => setReviewSuccess(''), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> Kembali ke Daftar MUA
      </button>

      {/* Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Profile Info Main Card (1/3 column) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple to-rose rounded-full flex items-center justify-center font-serif text-3xl font-bold text-white shadow-lg mx-auto">
              {m.nama.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white leading-tight">{m.nama}</h2>
              <div className="flex items-center justify-center gap-1.5 text-sm text-gold font-bold mt-1">
                <Star size={14} fill="currentColor" />
                <span>{m.rating.toFixed(1)} / 5.0</span>
                <span className="text-gray-500 font-semibold text-xs">({muaReviews.length} Ulasan)</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Profile Spec Rows */}
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Clipboard size={16} className="text-rose shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Spesialisasi Rias</span>
                <span className="text-gray-200 font-medium">{m.spesialisasi || 'Belum diatur'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Star size={16} className="text-rose shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Tarif Harga Jasa</span>
                <span className="text-rose font-bold">
                  {m.harga !== null && m.harga !== undefined && m.harga > 0 ? `Rp ${m.harga.toLocaleString('id-ID')}` : 'Belum diatur'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar size={16} className="text-rose shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Jadwal Operasional</span>
                <span className="text-gray-200">{m.jadwal || 'Belum diatur'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone size={16} className="text-rose shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Kontak MUA</span>
                {m.whatsapp ? (
                  <a
                    href={`https://wa.me/${m.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-400 font-semibold hover:underline"
                  >
                    +{m.whatsapp} (WhatsApp)
                  </a>
                ) : (
                  <span className="text-gray-400">Belum diatur</span>
                )}
              </div>
            </div>
          </div>

          {m.ulasan_singkat && m.ulasan_singkat.trim() !== '' && (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 italic text-xs text-gray-400 text-center relative">
              <span className="text-2xl font-serif text-rose/30 absolute left-2 top-0 leading-none">“</span>
              "{m.ulasan_singkat}"
              <span className="text-2xl font-serif text-rose/30 absolute right-2 bottom-0 leading-none">”</span>
            </div>
          )}

          <button
            onClick={() => setActiveTab('booking')}
            className="w-full py-3.5 bg-rose hover:bg-rose-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-rose/10 hover:shadow-rose/25 transition-all text-center block"
          >
            Pesan Jadwal Sekarang
          </button>
        </div>

        {/* Dynamic Detail Sections (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub Tab selection bar */}
          <div className="flex border-b border-white/10 gap-6">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-3 font-serif text-base sm:text-lg font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gallery' ? 'text-rose' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon size={16} /> Galeri Hasil Makeup ({muaPhotos.length})
              {activeTab === 'gallery' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-serif text-base sm:text-lg font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews' ? 'text-rose' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={16} /> Ulasan Pelanggan ({muaReviews.length})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`pb-3 font-serif text-base sm:text-lg font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'booking' ? 'text-rose' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar size={16} /> Form Janji Rias
              {activeTab === 'booking' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
              )}
            </button>
          </div>

          {/* TAB CONTENTS */}
          
          {/* 1. PHOTO PORTFOLIO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {muaPhotos.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl">
                  <ImageIcon className="mx-auto text-gray-500 opacity-40 mb-3" size={32} />
                  <p className="text-gray-400 text-sm">MUA belum mengunggah foto portofolio hasil makeup.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {muaPhotos.map((f) => (
                    <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-rose/30 transition-all flex flex-col">
                      <div className="overflow-hidden relative">
                        <img
                          src={f.file}
                          alt={f.caption || 'Foto Riasan'}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400';
                          }}
                        />
                      </div>
                      {f.caption && (
                        <div className="p-3 bg-white/5">
                          <p className="text-xs font-semibold text-white/90 line-clamp-1 leading-snug">{f.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. CUSTOMER REVIEWS BOARD */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
              {/* Review Listings */}
              <div className="space-y-4">
                {muaReviews.length === 0 ? (
                  <p className="text-gray-400 text-sm italic py-4">Belum ada ulasan untuk Makeup Artist ini. Jadilah yang pertama memberikan ulasan!</p>
                ) : (
                  <div className="space-y-4">
                    {muaReviews.map((r) => (
                      <div key={r.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white text-sm">{r.username}</span>
                          <span className="bg-gold/15 border border-gold/25 text-gold text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
                            {r.rating}/5.0 <Star size={11} fill="currentColor" />
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {r.komentar}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Write Form */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Star size={16} className="text-rose fill-rose" />
                  <span>Beri Ulasan Anda</span>
                </h4>

                {reviewError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex gap-1.5">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{reviewError}</span>
                  </div>
                )}
                {reviewSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs flex gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>{reviewSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating Penilaian</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                    >
                      {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val} className="bg-dark text-white">
                          Penilaian {val} Bintang {val === 5 ? '(Sangat Bagus)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tulis Komentar Ulasan</label>
                    <textarea
                      value={newKomentar}
                      onChange={(e) => setNewKomentar(e.target.value)}
                      placeholder="Bagikan pengalaman rias Anda menggunakan jasa MUA ini secara jujur..."
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose h-24"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-rose hover:bg-rose-dark text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full cursor-pointer transition-colors shadow-md shadow-rose/10"
                    >
                      Kirim Ulasan Riasan
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* 3. BOOKING FORM COMPONENT */}
          {activeTab === 'booking' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-1.5">
                  <Calendar size={18} className="text-rose" />
                  <span>Isi Rincian Janji Rias</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Silakan tentukan jadwal dan alamat pengerjaan rias secara detail.</p>
              </div>

              {bookingError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs sm:text-sm flex gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}
              {bookingSuccess && (
                <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs sm:text-sm flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal Acara Rias</label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jam Pelaksanaan</label>
                    <input
                      type="time"
                      value={jam}
                      onChange={(e) => setJam(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp Anda</label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="Contoh: 08123456789 (Hanya angka, minimal 10 digit)"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Lengkap Lokasi Acara</label>
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Masukkan nama jalan, nomor rumah, perumahan, kelurahan, kecamatan secara detail..."
                    required
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 h-20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Minta tema riasan soft rose gold look, pengantin hijab"
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 h-16"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className="flex-1 py-3 border border-white/10 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:text-white cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-dark cursor-pointer transition-colors shadow-lg shadow-rose/15 hover:shadow-rose/30"
                  >
                    Simpan Booking Jasa MUA
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
