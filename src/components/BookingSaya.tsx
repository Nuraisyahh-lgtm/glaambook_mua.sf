/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Booking, MUA } from '../types';
import { Calendar, Trash, XCircle, Info, Phone, MapPin, Eye, CheckCircle, Clock } from 'lucide-react';

interface BookingSayaProps {
  user: User;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  muas: MUA[];
  onNavigateToMuaDetail: (id: number) => void;
}

export default function BookingSaya({
  user,
  bookings,
  setBookings,
  muas,
  onNavigateToMuaDetail
}: BookingSayaProps) {

  // Handle booking cancellation (Update booking status to 'batal')
  const handleCancelBooking = (bookingId: number) => {
    const confirmation = window.confirm('Apakah Anda yakin ingin membatalkan booking riasan ini?');
    if (confirmation) {
      setBookings(
        bookings.map((b) => (b.id === bookingId ? { ...b, status: 'batal' } : b))
      );
    }
  };

  // Handle booking deletion (Delete booking record entirely)
  const handleDeleteBooking = (bookingId: number) => {
    const confirmation = window.confirm('Apakah Anda yakin ingin menghapus riwayat booking ini secara permanen?');
    if (confirmation) {
      setBookings(bookings.filter((b) => b.id !== bookingId));
    }
  };

  // Filter bookings belonging to the currently logged-in customer
  const myBookings = bookings
    .filter((b) => b.id_user === user.id)
    .map((b) => {
      const associatedMUA = muas.find((m) => m.id === b.id_mua);
      return {
        ...b,
        nama_mua: associatedMUA ? associatedMUA.nama : 'Unknown MUA'
      };
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-rose">Riwayat Aktivitas</span>
        <h2 className="font-serif text-3xl font-bold text-white mt-1">Booking Saya</h2>
        <p className="text-sm text-gray-400 mt-1">Daftar semua janji temu makeup yang telah Anda buat. Anda dapat melihat status pengerjaan atau membatalkan jadwal.</p>
      </div>

      {/* Main Booking List */}
      {myBookings.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl space-y-4">
          <Calendar size={48} className="mx-auto text-gray-500 opacity-40 animate-bounce" />
          <h3 className="text-base font-bold text-white">Belum Ada Riwayat Booking</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Anda belum pernah membuat janji rias dengan MUA manapun. Silakan jelajahi beranda dan tentukan pilihan Makeup Artist Anda!
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Responsive Desktop Table layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">No</th>
                  <th className="p-4">Makeup Artist</th>
                  <th className="p-4">Tanggal &amp; Waktu</th>
                  <th className="p-4">Alamat Penugasan</th>
                  <th className="p-4">Status Pesanan</th>
                  <th className="p-4 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {myBookings.map((b, idx) => {
                  let badgeStyle = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                  if (b.status === 'selesai') badgeStyle = 'bg-green-500/10 text-green-400 border border-green-500/20';
                  if (b.status === 'batal') badgeStyle = 'bg-red-500/10 text-red-400 border border-red-500/20';

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-xs">{idx + 1}</td>
                      <td className="p-4">
                        <button
                          onClick={() => onNavigateToMuaDetail(b.id_mua)}
                          className="font-semibold text-white hover:text-rose cursor-pointer transition-colors text-left"
                        >
                          {b.nama_mua}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{b.tanggal}</div>
                        <div className="text-xs text-gray-500">{b.jam} WIB</div>
                      </td>
                      <td className="p-4">
                        <div className="truncate max-w-[200px] text-white/90" title={b.alamat}>{b.alamat}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-green-400" />
                          <span>{b.no_hp}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          <button
                            onClick={() => onNavigateToMuaDetail(b.id_mua)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title="Lihat Detail MUA"
                          >
                            <Eye size={14} />
                          </button>
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-white text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                              title="Batalkan Acara"
                            >
                              Batalkan
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all cursor-pointer animate-pulse"
                            title="Hapus Riwayat"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-based layout for smaller viewports */}
          <div className="block sm:hidden divide-y divide-white/5">
            {myBookings.map((b) => {
              let badgeColor = 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
              let statusText = 'Pending';
              let statusIcon = <Clock size={13} />;

              if (b.status === 'selesai') {
                badgeColor = 'bg-green-500/15 text-green-400 border border-green-500/25';
                statusText = 'Selesai';
                statusIcon = <CheckCircle size={13} />;
              }
              if (b.status === 'batal') {
                badgeColor = 'bg-red-500/15 text-red-400 border border-red-500/25';
                statusText = 'Batal';
                statusIcon = <XCircle size={13} />;
              }

              return (
                <div key={b.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => onNavigateToMuaDetail(b.id_mua)}
                      className="font-serif text-base font-bold text-white hover:text-rose transition-colors text-left"
                    >
                      {b.nama_mua}
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${badgeColor}`}>
                      {statusIcon}
                      <span>{statusText}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-rose shrink-0" />
                      <span>{b.tanggal} pukul {b.jam} WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-rose shrink-0" />
                      <span className="truncate" title={b.alamat}>{b.alamat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-rose shrink-0" />
                      <span>{b.no_hp}</span>
                    </div>
                    {b.catatan && (
                      <p className="italic text-gray-400 border-l border-rose/30 pl-2 mt-1">"{b.catatan}"</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onNavigateToMuaDetail(b.id_mua)}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Detail MUA
                    </button>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="flex-1 py-2 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Batalkan
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="px-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                      title="Hapus"
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
