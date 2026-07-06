/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MUA, Booking, MUAPhoto, User } from '../types';
import { Plus, Edit, Trash, Search, Image as ImageIcon, Calendar, Check, X, Phone, User as UserIcon, BookOpen, AlertCircle, Sparkles, Star } from 'lucide-react';

interface AdminDashboardProps {
  muas: MUA[];
  setMuas: React.Dispatch<React.SetStateAction<MUA[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  photos: MUAPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<MUAPhoto[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentView: string; // 'admin-mua' | 'admin-bookings'
  onNavigate: (view: string) => void;
}

export default function AdminDashboard({
  muas,
  setMuas,
  bookings,
  setBookings,
  photos,
  setPhotos,
  users,
  setUsers,
  currentView,
  onNavigate
}: AdminDashboardProps) {
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [muaStatusFilter, setMuaStatusFilter] = useState('all'); // 'all' | 'pending' | 'active'

  // Form states (MUA Modal)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [nama, setNama] = useState('');
  const [spesialisasi, setSpesialisasi] = useState('');
  const [harga, setHarga] = useState<number | ''>(0);
  const [jadwal, setJadwal] = useState('');
  const [rating, setRating] = useState<number>(5.0);
  const [ulasanSingkat, setUlasanSingkat] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formError, setFormError] = useState('');

  // Photo management modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedMuaForPhotos, setSelectedMuaForPhotos] = useState<MUA | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [muaToDelete, setMuaToDelete] = useState<number | null>(null);

  // ── MUA FORM UTILITIES ──
  const openAddForm = () => {
    setFormType('add');
    setEditingId(null);
    setNama('');
    setSpesialisasi('');
    setHarga(500000);
    setJadwal('Senin - Jumat, 08:00 - 17:00');
    setRating(5.0);
    setUlasanSingkat('');
    setWhatsapp('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (mua: MUA) => {
    setFormType('edit');
    setEditingId(mua.id);
    setNama(mua.nama);
    setSpesialisasi(mua.spesialisasi);
    setHarga(mua.harga !== null ? mua.harga : '');
    setJadwal(mua.jadwal);
    setRating(mua.rating);
    setUlasanSingkat(mua.ulasan_singkat || '');
    setWhatsapp(mua.whatsapp || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleMUAFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // ── INPUT VALIDATIONS ──
    const cleanNama = nama.trim();
    const cleanSpe = spesialisasi.trim();
    const cleanJadwal = jadwal.trim();
    const cleanWa = whatsapp.trim();

    // Validasi 1: Form tidak boleh kosong untuk field wajib
    if (!cleanNama || !cleanSpe || !cleanJadwal) {
      setFormError('Nama, Spesialisasi, dan Jadwal tidak boleh kosong.');
      return;
    }

    // Validasi 2: Harga harus bernilai positif dan wajar (misal minimal 50000 rupiah)
    const finalHarga = harga === '' ? null : Number(harga);
    if (finalHarga === null || finalHarga < 50000) {
      setFormError('Harga layanan MUA minimal adalah Rp 50.000.');
      return;
    }

    // Validasi 3: Rating harus di antara 0 dan 5
    if (rating < 0 || rating > 5) {
      setFormError('Rating harus berupa desimal antara 0.0 sampai 5.0.');
      return;
    }

    // Validasi 4: WhatsApp harus berupa angka dan minimal 10 digit jika diisi
    if (cleanWa && (!/^[0-9]+$/.test(cleanWa) || cleanWa.length < 10)) {
      setFormError('Format WhatsApp tidak valid. Gunakan format angka saja (minimal 10 digit, contoh: 6281234567890).');
      return;
    }

    if (formType === 'add') {
      const newId = muas.length > 0 ? Math.max(...muas.map((m) => m.id)) + 1 : 1;
      const newMua: MUA = {
        id: newId,
        nama: cleanNama,
        spesialisasi: cleanSpe,
        harga: finalHarga,
        jadwal: cleanJadwal,
        rating,
        ulasan_singkat: ulasanSingkat.trim() || null,
        whatsapp: cleanWa || null,
        status: 'aktif'
      };
      setMuas([...muas, newMua]);
    } else if (formType === 'edit' && editingId !== null) {
      setMuas(
        muas.map((m) =>
          m.id === editingId
            ? {
                ...m,
                nama: cleanNama,
                spesialisasi: cleanSpe,
                harga: finalHarga,
                jadwal: cleanJadwal,
                rating,
                ulasan_singkat: ulasanSingkat.trim() || null,
                whatsapp: cleanWa || null
              }
            : m
        )
      );
    }

    setIsFormOpen(false);
  };

  const handleDeleteMUA = (id: number) => {
    setMuaToDelete(id);
  };

  const confirmDeleteMUA = () => {
    if (muaToDelete !== null) {
      setMuas(muas.filter((m) => m.id !== muaToDelete));
      setPhotos(photos.filter((p) => p.id_mua !== muaToDelete));
      // Cancel associated bookings
      setBookings(
        bookings.map((b) => (b.id_mua === muaToDelete ? { ...b, status: 'batal' } : b))
      );
      setMuaToDelete(null);
    }
  };

  // ── BOOKING MANAGEMENT ──
  const updateBookingStatus = (id: number, status: 'selesai' | 'batal') => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleAcceptMUA = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: 'active' } : u))
    );
    setMuas((prevMuas) =>
      prevMuas.map((m) => (m.userId === userId ? { ...m, status: 'aktif' } : m))
    );
  };

  // ── PHOTO PORTFOLIO MANAGEMENT ──
  const openPhotoManager = (mua: MUA) => {
    setSelectedMuaForPhotos(mua);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setPhotoError('');
    setIsPhotoModalOpen(true);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError('');

    const cleanUrl = newPhotoUrl.trim();
    if (!cleanUrl) {
      setPhotoError('URL foto wajib diisi.');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setPhotoError('Masukkan format URL foto yang valid (harus dimulai dengan http:// atau https://).');
      return;
    }

    if (selectedMuaForPhotos) {
      const newPhotoId = photos.length > 0 ? Math.max(...photos.map((p) => p.id)) + 1 : 1;
      const newPhoto: MUAPhoto = {
        id: newPhotoId,
        id_mua: selectedMuaForPhotos.id,
        file: cleanUrl,
        caption: newPhotoCaption.trim() || 'Hasil Makeup',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setPhotos([newPhoto, ...photos]);
      setNewPhotoUrl('');
      setNewPhotoCaption('');
    }
  };

  const handleDeletePhoto = (photoId: number) => {
    if (window.confirm('Hapus foto portofolio ini?')) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  };

  // ── SEARCH FILTERS ──
  const filteredMuas = muas.filter((m) => {
    const associatedUser = users.find((u) => u.id === m.userId);
    const userStatus = associatedUser?.status || 'active';

    if (muaStatusFilter === 'pending' && userStatus !== 'pending') return false;
    if (muaStatusFilter === 'active' && userStatus !== 'active') return false;

    const query = searchQuery.toLowerCase();
    return m.nama.toLowerCase().includes(query) || m.spesialisasi.toLowerCase().includes(query);
  });

  const filteredBookings = bookings
    .map((b) => {
      // Find virtual details
      const customerUser = users.find((u) => u.id === b.id_user);
      const targetMUA = muas.find((m) => m.id === b.id_mua);
      return {
        ...b,
        username: customerUser ? customerUser.username : 'Customer',
        nama_mua: targetMUA ? targetMUA.nama : 'Unknown MUA'
      };
    })
    .filter((b) => {
      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Search query filter (Customer name or MUA name)
      const query = searchQuery.toLowerCase();
      return b.username.toLowerCase().includes(query) || b.nama_mua.toLowerCase().includes(query) || b.alamat.toLowerCase().includes(query);
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose">Panel Kontrol</span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">
            {currentView === 'admin-mua' ? 'Kelola Data MUA' : 'Data Booking Pelanggan'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {currentView === 'admin-mua' 
              ? 'Tambah, edit, hapus profile Makeup Artist dan kelola portofolio foto.' 
              : 'Pantau status booking dari semua customer. Konfirmasi selesai atau batalkan.'}
          </p>
        </div>

        {currentView === 'admin-mua' && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-gradient-to-r from-rose to-rose-dark text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose/25 hover:shadow-rose/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Plus size={16} /> Tambah MUA Baru
          </button>
        )}
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              currentView === 'admin-mua'
                ? 'Cari MUA berdasarkan nama atau spesialisasi...'
                : 'Cari booking berdasarkan nama customer, nama MUA, atau alamat...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rose focus:bg-rose/5 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17} />
        </div>

        {/* Status Filter for Booking view */}
        {currentView === 'admin-bookings' && (
          <div className="flex gap-1 bg-dark p-1 rounded-xl border border-white/5">
            {['all', 'pending', 'selesai', 'batal'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-rose text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {/* Status Filter for MUA view */}
        {currentView === 'admin-mua' && (
          <div className="flex gap-1 bg-dark p-1 rounded-xl border border-white/5 flex-wrap">
            {['all', 'pending', 'active'].map((st) => (
              <button
                key={st}
                onClick={() => setMuaStatusFilter(st)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  muaStatusFilter === st
                    ? 'bg-rose text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua MUA' : st === 'pending' ? 'Butuh Persetujuan' : 'Aktif'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN VIEW CONTENTS */}
      {currentView === 'admin-mua' ? (
        /* ── DATA MUA GRID ── */
        filteredMuas.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <Search size={40} className="mx-auto text-gray-500 opacity-40" />
            <p className="text-gray-400 text-sm">Tidak ada Makeup Artist yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMuas.map((m) => {
              const associatedUser = users.find((u) => u.id === m.userId);
              const isPending = associatedUser?.status === 'pending';

              return (
                <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-rose/30 transition-all flex flex-col group relative">
                  <div className="h-1 bg-gradient-to-r from-rose to-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6 flex-1 space-y-4">
                    {/* Top Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple to-rose flex items-center justify-center font-bold text-lg text-white font-serif shadow-inner select-none shrink-0">
                        {m.nama.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="font-serif text-lg font-bold text-white leading-snug truncate" title={m.nama}>{m.nama}</h3>
                          {isPending && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                              Butuh Persetujuan
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gold font-semibold mt-0.5">
                          <Star size={13} fill="currentColor" />
                          <span>{m.rating.toFixed(1)} / 5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                      <p><strong className="text-white font-medium">Spesialisasi:</strong> {m.spesialisasi || 'Belum diatur'}</p>
                      <p><strong className="text-white font-medium">Harga:</strong> {m.harga !== null && m.harga !== undefined && m.harga > 0 ? `Rp ${m.harga.toLocaleString('id-ID')}` : 'Belum diatur'}</p>
                      <p><strong className="text-white font-medium">Jadwal:</strong> {m.jadwal || 'Belum diatur'}</p>
                      <p className="flex items-center gap-1.5 text-green-400">
                        <Phone size={13} />
                        <span>{m.whatsapp ? `+${m.whatsapp}` : 'Belum diatur'}</span>
                      </p>
                    </div>

                    {m.ulasan_singkat && m.ulasan_singkat.trim() !== '' && (
                      <blockquote className="border-l-2 border-rose/40 pl-3 italic text-xs text-gray-400">
                        "{m.ulasan_singkat}"
                      </blockquote>
                    )}
                  </div>

                  {/* Actions bar */}
                  <div className="p-4 bg-white/5 border-t border-white/5 flex flex-wrap gap-2 justify-end items-center">
                    {isPending && associatedUser && (
                      <button
                        onClick={() => handleAcceptMUA(associatedUser.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-500 hover:bg-green-600 text-white transition-colors cursor-pointer shadow-md shadow-green-500/15"
                      >
                        <Check size={13} /> Setujui
                      </button>
                    )}
                    <button
                      onClick={() => openPhotoManager(m)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple/20 text-purple-light hover:bg-purple/30 transition-colors cursor-pointer"
                    >
                      <ImageIcon size={13} /> Foto ({photos.filter((p) => p.id_mua === m.id).length})
                    </button>
                    <button
                      onClick={() => openEditForm(m)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-300 hover:bg-green-500/25 transition-colors cursor-pointer"
                    >
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMUA(m.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors cursor-pointer"
                    >
                      <Trash size={13} /> Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ── DATA BOOKING LISTING (TABLE) ── */
        filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <Calendar size={40} className="mx-auto text-gray-500 opacity-40" />
            <p className="text-gray-400 text-sm">Tidak ada data booking yang sesuai dengan pencarian atau filter.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4">No</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Makeup Artist</th>
                    <th className="p-4">Tanggal & Jam</th>
                    <th className="p-4 max-w-xs">Alamat & WA</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredBookings.map((b, idx) => {
                    let statusBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                    if (b.status === 'selesai') statusBadge = 'bg-green-500/10 text-green-400 border border-green-500/20';
                    if (b.status === 'batal') statusBadge = 'bg-red-500/10 text-red-400 border border-red-500/20';

                    return (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-xs">{idx + 1}</td>
                        <td className="p-4 font-semibold text-white">{b.username}</td>
                        <td className="p-4 text-white font-medium">{b.nama_mua}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{b.tanggal}</div>
                          <div className="text-xs text-gray-500">{b.jam} WIB</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="truncate font-medium text-white/90" title={b.alamat}>{b.alamat}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Phone size={11} className="text-green-400" />
                            <span>{b.no_hp}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusBadge}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'selesai')}
                                  className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                                  title="Tandai Selesai"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'batal')}
                                  className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                                  title="Batalkan Booking"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                            {b.status !== 'pending' && (
                              <span className="text-xs text-gray-500 italic">No Actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ── MODAL FORM: TAMBAH / EDIT MUA ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden my-8 animate-in zoom-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-rose" />
                <span>{formType === 'add' ? 'Tambah Data MUA Baru' : 'Edit Data Profile MUA'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleMUAFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nama Makeup Artist (MUA)</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Linda Makeup"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Spesialisasi</label>
                <input
                  type="text"
                  value={spesialisasi}
                  onChange={(e) => setSpesialisasi(e.target.value)}
                  placeholder="Contoh: Wedding, Graduation, Party Look"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Harga Layanan (IDR)</label>
                  <input
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(Number(e.target.value))}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rating Awal (0 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Jadwal Operasional</label>
                <input
                  type="text"
                  value={jadwal}
                  onChange={(e) => setJadwal(e.target.value)}
                  placeholder="Contoh: Senin - Sabtu, 09:00 - 18:00"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">No WhatsApp (Opsional)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 6281234567890"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ulasan Singkat / Slogan</label>
                <textarea
                  value={ulasanSingkat}
                  onChange={(e) => setUlasanSingkat(e.target.value)}
                  placeholder="Masukkan moto layanan atau deskripsi singkat MUA..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded-xl text-sm font-semibold hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose text-white rounded-xl text-sm font-semibold hover:bg-rose-dark transition-colors cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: PORTFOLIO PHOTOS MANAGER ── */}
      {isPhotoModalOpen && selectedMuaForPhotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden my-8 animate-in zoom-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Kelola Foto Makeup</h3>
                <p className="text-xs text-gray-400">Makeup Artist: {selectedMuaForPhotos.nama}</p>
              </div>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Add New Photo Form */}
              <form onSubmit={handleAddPhoto} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose">Upload Foto Makeup Baru</h4>
                {photoError && (
                  <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg flex gap-1.5">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{photoError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">URL Link Foto</label>
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Contoh: https://images.unsplash.com/..."
                      required
                      className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Caption Foto</label>
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Contoh: Look akad, natural glam"
                      className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1 bg-rose text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-dark transition-colors"
                  >
                    <Plus size={14} /> Tambahkan Foto
                  </button>
                </div>
              </form>

              {/* Gallery Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Foto Portofolio Saat Ini</h4>
                
                {photos.filter((p) => p.id_mua === selectedMuaForPhotos.id).length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">Belum ada foto portofolio diupload.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos
                      .filter((p) => p.id_mua === selectedMuaForPhotos.id)
                      .map((p) => (
                        <div key={p.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden group relative flex flex-col justify-between">
                          <img
                            src={p.file}
                            alt={p.caption}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              // Fallback on broken image link
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200';
                            }}
                          />
                          <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                            <p className="text-[11px] font-medium text-white/95 line-clamp-2 leading-snug">{p.caption}</p>
                            <button
                              onClick={() => handleDeletePhoto(p.id)}
                              className="w-full mt-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Hapus Foto
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL FOR DELETING MUA */}
      {muaToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setMuaToDelete(null)}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-[#161226] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash size={22} />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">Hapus Makeup Artist</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus data Makeup Artist ini secara permanen? Semua data terkait (termasuk foto) juga akan terhapus secara otomatis.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMuaToDelete(null)}
                className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteMUA}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-500/15"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
