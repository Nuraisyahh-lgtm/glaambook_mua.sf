/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, MUA, Booking, MUAPhoto } from '../types';
import { ClipboardList, Sparkles, Star, Edit, Phone, Calendar, Check, X, Plus, Trash, AlertCircle, Eye, Image as ImageIcon, Search, User as UserIcon } from 'lucide-react';

interface MuaDashboardProps {
  user: User;
  muas: MUA[];
  setMuas: React.Dispatch<React.SetStateAction<MUA[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  photos: MUAPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<MUAPhoto[]>>;
  users: User[];
  currentView: string; // 'mua-dashboard' | 'mua-photos'
  onNavigate: (view: string) => void;
}

export default function MuaDashboard({
  user,
  muas,
  setMuas,
  bookings,
  setBookings,
  photos,
  setPhotos,
  users,
  currentView,
  onNavigate
}: MuaDashboardProps) {

  // Find the MUA profile associated with this user
  const myProfile = muas.find((m) => m.userId === user.id);

  // Profile edit form states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nama, setNama] = useState(myProfile?.nama || '');
  const [spesialisasi, setSpesialisasi] = useState(myProfile?.spesialisasi || '');
  const [harga, setHarga] = useState<number | ''>(myProfile?.harga !== null && myProfile?.harga !== undefined ? myProfile.harga : '');
  const [jadwal, setJadwal] = useState(myProfile?.jadwal || '');
  const [whatsapp, setWhatsapp] = useState(myProfile?.whatsapp || '');
  const [ulasanSingkat, setUlasanSingkat] = useState(myProfile?.ulasan_singkat || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [alamat, setAlamat] = useState(myProfile?.alamat || '');
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);

  // Photo uploads states
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');

  // Search state inside MUA dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // If MUA profile does not exist, offer to auto-create it or show a placeholder
  if (!myProfile) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-rose" />
        <h3 className="font-serif text-xl font-bold text-white">Profil MUA Belum Dibuat</h3>
        <p className="text-sm text-gray-400">
          Akun Anda telah terdaftar sebagai MUA, namun profil detail layanan belum diinisialisasi. Silakan klik tombol di bawah untuk membuat profil MUA Anda.
        </p>
        <button
          onClick={() => {
            const newId = muas.length > 0 ? Math.max(...muas.map((m) => m.id)) + 1 : 1;
            const newMUAProfile: MUA = {
              id: newId,
              userId: user.id,
              nama: user.username + ' Makeup',
              spesialisasi: '',
              harga: null,
              jadwal: '',
              rating: 5.0,
              ulasan_singkat: null,
              whatsapp: null
            };
            setMuas([...muas, newMUAProfile]);
          }}
          className="bg-rose hover:bg-rose-dark text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider cursor-pointer"
        >
          Buat Profil Sekarang
        </button>
      </div>
    );
  }

  // Handle Edit Profile Submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const cleanNama = nama.trim();
    const cleanSpe = spesialisasi.trim();
    const cleanJadwal = jadwal.trim();
    const cleanWa = whatsapp.trim();

    // ── INPUT VALIDATIONS ──
    if (!cleanNama || !cleanSpe || !cleanJadwal) {
      setProfileError('Nama, Spesialisasi, dan Jadwal operasional wajib diisi.');
      return;
    }
    const finalHarga = harga === '' ? null : Number(harga);
    if (finalHarga === null || finalHarga < 50000) {
      setProfileError('Harga minimum layanan makeup adalah Rp 50.000.');
      return;
    }
    if (cleanWa && (!/^[0-9]+$/.test(cleanWa) || cleanWa.length < 10)) {
      setProfileError('Nomor WhatsApp harus angka saja dan minimal 10 digit (contoh: 6281234567890).');
      return;
    }

    setMuas(
      muas.map((m) =>
        m.id === myProfile.id
          ? {
              ...m,
              nama: cleanNama,
              spesialisasi: cleanSpe,
              harga: finalHarga,
              jadwal: cleanJadwal,
              whatsapp: cleanWa || null,
              ulasan_singkat: ulasanSingkat.trim() || null
            }
          : m
      )
    );

    setProfileSuccess('Profil layanan MUA Anda berhasil diperbarui!');
    setTimeout(() => {
      setIsEditingProfile(false);
      setProfileSuccess('');
    }, 1000);
  };

  // Handle Photo Portfolio Submission
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError('');
    setPhotoSuccess('');

    const cleanUrl = newPhotoUrl.trim();
    if (!cleanUrl) {
      setPhotoError('URL link foto wajib diisi.');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setPhotoError('Masukkan format URL foto yang valid (harus dimulai dengan http:// atau https://).');
      return;
    }

    const newPhotoId = photos.length > 0 ? Math.max(...photos.map((p) => p.id)) + 1 : 1;
    const newPhoto: MUAPhoto = {
      id: newPhotoId,
      id_mua: myProfile.id,
      file: cleanUrl,
      caption: newPhotoCaption.trim() || 'Hasil Makeup Terbaru',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setPhotos([newPhoto, ...photos]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setPhotoSuccess('Foto portofolio baru berhasil ditambahkan!');
    setTimeout(() => setPhotoSuccess(''), 1500);
  };

  const handleDeletePhoto = (photoId: number) => {
    setPhotoToDelete(photoId);
  };

  const confirmDeletePhoto = () => {
    if (photoToDelete !== null) {
      setPhotos(photos.filter((p) => p.id !== photoToDelete));
      setPhotoToDelete(null);
    }
  };

  // Handle Booking status action
  const updateBookingStatus = (bookingId: number, newStatus: 'selesai' | 'batal') => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Filter Bookings addressed to this specific MUA
  const myBookings = bookings
    .filter((b) => b.id_mua === myProfile.id)
    .map((b) => {
      const customer = users.find((u) => u.id === b.id_user);
      return {
        ...b,
        username: customer ? customer.username : 'Pelanggan'
      };
    })
    .filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      const query = searchQuery.toLowerCase();
      return b.username.toLowerCase().includes(query) || b.alamat.toLowerCase().includes(query);
    });

  // Get MUA portfolio photos
  const myPhotos = photos.filter((p) => p.id_mua === myProfile.id);

  const handleUpdateMUAAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const cleanNama = nama.trim();
    const cleanWa = whatsapp.trim();
    const cleanAlamat = alamat.trim();

    if (!cleanNama) {
      setProfileError('Nama MUA tidak boleh kosong.');
      return;
    }
    if (cleanWa && (!/^[0-9]+$/.test(cleanWa) || cleanWa.length < 10)) {
      setProfileError('Nomor WhatsApp harus berupa angka saja (minimal 10 digit, contoh: 6281234567890).');
      return;
    }

    setMuas(
      muas.map((m) =>
        m.id === myProfile.id
          ? {
              ...m,
              nama: cleanNama,
              whatsapp: cleanWa || null,
              alamat: cleanAlamat || undefined
            }
          : m
      )
    );

    setProfileSuccess('Perubahan profil akun MUA berhasil disimpan!');
    setTimeout(() => {
      setProfileSuccess('');
    }, 2500);
  };

  if (currentView === 'account') {
    return (
      <div className="max-w-xl mx-auto animate-in fade-in duration-300">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose">Pengaturan Profil</span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">Atur Profil MUA</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Lengkapi informasi profil publik Makeup Artist (MUA) Anda di bawah ini agar pelanggan dapat menghubungi Anda dengan mudah.</p>
          </div>

          {/* Alerts */}
          {profileError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs sm:text-sm flex gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <span>{profileError}</span>
            </div>
          )}
          {profileSuccess && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs sm:text-sm flex gap-2">
              <Check size={16} className="shrink-0 mt-0.5 text-green-400" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateMUAAccount} className="space-y-4">
            
            {/* Nama MUA Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Nama Makeup Artist (MUA)
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
                placeholder="Nama bisnis/brand makeup Anda"
              />
            </div>

            {/* WhatsApp Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 6281234567890"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
              />
            </div>

            {/* Alamat Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Alamat MUA
              </label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat lengkap lokasi studio atau rumah MUA"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 h-24 resize-none transition-all"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
              <button
                type="button"
                onClick={() => onNavigate('mua-dashboard')}
                className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose hover:bg-rose-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-rose/10 hover:shadow-rose/20 transition-all"
              >
                Simpan Perubahan
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* MUA Hero Welcome Card */}
      <div className="bg-gradient-to-r from-purple-dark via-purple to-rose-dark border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-rose/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Panel Dashboard MUA</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
            Halo, <span className="text-gold">{myProfile.nama}</span>!
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-xl">
            Di sini Anda dapat memantau pesanan riasan masuk, memperbarui rincian harga/jadwal Anda, serta mengelola galeri foto portofolio makeup untuk menarik pelanggan.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-4 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-center min-w-[100px]">
            <div className="font-serif text-2xl font-bold text-white">
              {bookings.filter((b) => b.id_mua === myProfile.id && b.status === 'pending').length}
            </div>
            <div className="text-[10px] text-white/50 uppercase font-semibold mt-0.5 tracking-wider">Pending</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-center min-w-[100px]">
            <div className="font-serif text-2xl font-bold text-white flex items-center justify-center gap-0.5">
              <span>{myProfile.rating.toFixed(1)}</span>
              <Star size={14} className="text-gold fill-gold" />
            </div>
            <div className="text-[10px] text-white/50 uppercase font-semibold mt-0.5 tracking-wider">Rating</div>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR TAB BAR */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => onNavigate('mua-dashboard')}
          className={`pb-3 font-serif text-lg font-bold transition-all relative cursor-pointer ${
            currentView === 'mua-dashboard' ? 'text-rose' : 'text-gray-400 hover:text-white'
          }`}
        >
          Kelola Pesanan Booking
          {currentView === 'mua-dashboard' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
          )}
        </button>
        <button
          onClick={() => onNavigate('mua-photos')}
          className={`pb-3 font-serif text-lg font-bold transition-all relative cursor-pointer ${
            currentView === 'mua-photos' ? 'text-rose' : 'text-gray-400 hover:text-white'
          }`}
        >
          Kelola Foto Portofolio ({myPhotos.length})
          {currentView === 'mua-photos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
          )}
        </button>
      </div>

      {/* MAIN LAYOUTS */}
      {currentView === 'mua-dashboard' ? (
        /* ── VIEW 1: BOOKING & PROFILE DETAILS ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List of Bookings (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <ClipboardList size={18} className="text-rose" />
                <span>Pesanan Booking Pelanggan</span>
              </h3>

              {/* Status filter buttons inside panel */}
              <div className="flex gap-1 bg-white/5 border border-white/5 p-1 rounded-xl shrink-0">
                {['all', 'pending', 'selesai', 'batal'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                      statusFilter === st ? 'bg-rose text-white shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pesanan berdasarkan nama customer atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <Calendar size={36} className="mx-auto text-gray-500 opacity-40" />
                <p className="text-gray-400 text-sm">Tidak ada pesanan masuk dalam kategori ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{b.username}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full ${
                          b.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            : b.status === 'selesai'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                            : 'bg-red-500/15 text-red-400 border border-red-500/25'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                        <p><strong className="text-white font-medium">Tanggal:</strong> {b.tanggal} pukul {b.jam} WIB</p>
                        <p><strong className="text-white font-medium">Alamat:</strong> {b.alamat}</p>
                        <p><strong className="text-white font-medium">WA Customer:</strong> {b.no_hp}</p>
                        {b.catatan && <p className="italic text-gray-400">"{b.catatan}"</p>}
                      </div>
                    </div>

                    {b.status === 'pending' && (
                      <div className="flex gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'selesai')}
                          className="flex items-center gap-1 bg-green-500/20 text-green-300 border border-green-500/20 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-green-500/30 transition-all"
                        >
                          <Check size={14} /> Selesai
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'batal')}
                          className="flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/20 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-red-500/30 transition-all"
                        >
                          <X size={14} /> Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MUA Profile card (1/3 width) */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <UserIcon size={18} className="text-rose" />
              <span>Profil Layanan Saya</span>
            </h3>

            {!isEditingProfile ? (
              /* Profile Details mode */
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Nama MUA</span>
                  <div className="text-base font-bold text-white">{myProfile.nama}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Spesialisasi Riasan</span>
                  <div className="text-sm font-semibold text-gray-200">{myProfile.spesialisasi || 'Belum diatur'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Harga Jasa Layanan</span>
                  <div className="text-sm font-bold text-rose">
                    {myProfile.harga !== null && myProfile.harga !== undefined && myProfile.harga > 0 ? `Rp ${myProfile.harga.toLocaleString('id-ID')}` : 'Belum diatur'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Jadwal Operasional</span>
                  <div className="text-sm text-gray-300">{myProfile.jadwal || 'Belum diatur'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Hubungi WhatsApp</span>
                  <div className="text-sm font-medium text-green-400">
                    {myProfile.whatsapp ? `+${myProfile.whatsapp}` : 'Belum diatur'}
                  </div>
                </div>

                {myProfile.ulasan_singkat && myProfile.ulasan_singkat.trim() !== '' && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Slogan / Catatan</span>
                    <div className="text-xs italic text-gray-400">"{myProfile.ulasan_singkat}"</div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setNama(myProfile.nama);
                    setSpesialisasi(myProfile.spesialisasi || '');
                    setHarga(myProfile.harga !== null && myProfile.harga !== undefined ? myProfile.harga : '');
                    setJadwal(myProfile.jadwal || '');
                    setWhatsapp(myProfile.whatsapp || '');
                    setUlasanSingkat(myProfile.ulasan_singkat || '');
                    setIsEditingProfile(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  <Edit size={14} /> Ubah Profil & Jasa
                </button>
              </div>
            ) : (
              /* Profile Editing mode (Lecturer's required CRUD - UPDATE operation) */
              <form onSubmit={handleUpdateProfile} className="bg-white/5 border border-rose/20 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose border-b border-white/5 pb-2">Ubah Data Layanan Jasa</h4>
                
                {profileError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{profileError}</span>
                  </div>
                )}
                {profileSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs flex gap-2">
                    <Check size={14} className="shrink-0 mt-0.5" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Nama Layanan</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Spesialisasi Rias</label>
                  <input
                    type="text"
                    value={spesialisasi}
                    onChange={(e) => setSpesialisasi(e.target.value)}
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Harga Jasa (IDR)</label>
                  <input
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(Number(e.target.value))}
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Jadwal Operasional</label>
                  <input
                    type="text"
                    value={jadwal}
                    onChange={(e) => setJadwal(e.target.value)}
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">WhatsApp (Format Angka)</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 6281234567890"
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Catatan Singkat</label>
                  <textarea
                    value={ulasanSingkat}
                    onChange={(e) => setUlasanSingkat(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose h-16 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded-xl text-xs font-bold uppercase cursor-pointer hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose text-white rounded-xl text-xs font-bold uppercase cursor-pointer hover:bg-rose-dark"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ── VIEW 2: MANAGE PORTFOLIO PHOTOS (CRUD CREATE, READ, DELETE) ── */
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Gallery Grid (2/3 width) - READ & DELETE */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-rose" />
                <span>Foto Portofolio Riasan Saya</span>
              </h3>
              
              {myPhotos.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                  <ImageIcon size={36} className="mx-auto text-gray-500 opacity-40" />
                  <p className="text-gray-400 text-sm">Belum ada foto portofolio riasan diunggah.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {myPhotos.map((p) => (
                    <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-rose/30 transition-all">
                      <div className="relative overflow-hidden">
                        <img
                          src={p.file}
                          alt={p.caption}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400';
                          }}
                        />
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                        <p className="text-xs font-medium text-white/90 leading-relaxed">{p.caption}</p>
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="w-full flex items-center justify-center gap-1 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash size={12} /> Hapus Foto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Photo Form (1/3 width) - CREATE */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-rose" />
                <span>Unggah Portofolio Baru</span>
              </h3>

              <form onSubmit={handleAddPhoto} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-xs text-gray-400">Tambahkan foto baru untuk ditampilkan di galeri profil publik Anda.</p>
                
                {photoError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex gap-1.5">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{photoError}</span>
                  </div>
                )}
                {photoSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs flex gap-1.5">
                    <Check size={14} className="shrink-0 mt-0.5" />
                    <span>{photoSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Link URL Gambar</label>
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Contoh: https://images.unsplash.com/..."
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose"
                  />
                  <span className="text-[10px] text-gray-500 block">Tempel link gambar portofolio Anda.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Keterangan / Caption</label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Contoh: Makeup Pengantin Adat Sunda"
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose hover:bg-rose-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-rose/10"
                >
                  Tambah ke Portofolio
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL FOR DELETING PORTFOLIO PHOTO */}
      {photoToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setPhotoToDelete(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-sm bg-[#161226] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash size={20} />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">Hapus Foto Portofolio</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus foto ini? Foto akan langsung dihapus dari portofolio Anda tanpa perlu refresh.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-500/15"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
