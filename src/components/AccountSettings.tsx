/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { Lock, AtSign, CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface AccountSettingsProps {
  user: User;
  setUser: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onNavigate: (view: string) => void;
}

export default function AccountSettings({
  user,
  setUser,
  users,
  setUsers,
  onNavigate
}: AccountSettingsProps) {

  // Form fields
  const [username, setUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedUser = username.trim();
    const trimmedPass = newPassword.trim();

    // ── VALIDATION 1: Username tidak boleh kosong ──
    if (!trimmedUser) {
      setError('Username tidak boleh kosong.');
      return;
    }
    if (trimmedUser.length < 4) {
      setError('Username minimal harus terdiri dari 4 karakter.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
      setError('Username hanya boleh berisi huruf, angka, atau garis bawah (_), tanpa spasi.');
      return;
    }

    // ── VALIDATION 2: Cek apakah username dipakai user lain ──
    if (trimmedUser.toLowerCase() !== user.username.toLowerCase()) {
      const exists = users.some(
        (u) => u.id !== user.id && u.username.toLowerCase() === trimmedUser.toLowerCase()
      );
      if (exists) {
        setError('Username sudah digunakan oleh akun lain. Silakan pilih username yang berbeda.');
        return;
      }
    }

    // ── VALIDATION 3: Validasi password jika diisi ──
    if (trimmedPass) {
      // Panjang minimal 8 karakter (Syarat Dosen)
      if (trimmedPass.length < 8) {
        setError('Keamanan Tambahan: Panjang password baru minimal harus 8 karakter.');
        return;
      }
      // Konfirmasi password cocok
      if (trimmedPass !== confirmPassword) {
        setError('Konfirmasi password tidak cocok dengan password baru yang dimasukkan.');
        return;
      }
    }

    // Update States
    const updatedUser: User = {
      ...user,
      username: trimmedUser,
      password: trimmedPass ? trimmedPass : user.password
    };

    // Update global users database
    setUsers(
      users.map((u) => (u.id === user.id ? updatedUser : u))
    );

    // Update active login session user
    setUser(updatedUser);

    setSuccess('Pengaturan akun berhasil disimpan! Username baru Anda: ' + trimmedUser);
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSuccess('');
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in duration-300">
      
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose">Profil Keamanan</span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">Akun Saya</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Ubah nama pengguna (username) dan kata sandi (password) akun Anda di sini.</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs sm:text-sm flex gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-xs sm:text-sm flex gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleUpdateAccount} className="space-y-4">
          
          {/* Username row */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="username">
              Username Aktif
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
              />
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* New password Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="new_password">
              Password Baru <span className="text-gray-500 lowercase italic font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="new_password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            </div>
          </div>

          {/* Confirm new password Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="confirm_password">
              Ulangi Password Baru
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Isi konfirmasi jika mengganti password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            </div>
          </div>

          {/* Form action button container */}
          <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
            <button
              type="button"
              onClick={() => {
                const targetView = user.role === 'customer' ? 'home' : user.role === 'admin' ? 'admin-mua' : 'mua-dashboard';
                onNavigate(targetView);
              }}
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
