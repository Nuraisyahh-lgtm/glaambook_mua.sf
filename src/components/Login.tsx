/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { Eye, EyeOff, User as UserIcon, Lock, AtSign, Info, ShieldCheck, Heart, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onRegister: (newUser: User, targetRole: Role) => void;
}

export default function Login({ onLoginSuccess, users, onRegister }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Show/Hide Password
  const [showPass, setShowPass] = useState(false);
  
  // Errors and successes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength logic
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('Masukkan password untuk cek kekuatan');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthText('Masukkan password untuk cek kekuatan');
      return;
    }
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++; // Dosen requirement
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const texts = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    setStrength(score);
    setStrengthText(texts[score] || 'Sangat Kuat');
  }, [password]);

  // Clean error messages when toggling views
  const handleToggleView = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('customer');
    setError('');
    setSuccess('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Username dan Password wajib diisi.');
      return;
    }

    // Find user
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === trimmedPass
    );

    if (foundUser) {
      if (foundUser.role === 'mua' && foundUser.status === 'pending') {
        setError('Akun Anda sedang diverifikasi. Menunggu persetujuan Admin.');
        return;
      }
      setSuccess('Login berhasil! Mengarahkan...');
      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 800);
    } else {
      setError('Username atau password salah.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // ── VALIDATION 1: Username tidak boleh kosong dan minimal 4 karakter, hanya boleh huruf/angka/underscores ──
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

    // ── VALIDATION 2: Password minimal 8 karakter (Syarat Dosen) ──
    if (!trimmedPass) {
      setError('Password wajib diisi.');
      return;
    }
    if (trimmedPass.length < 8) {
      setError('Sesuai aturan, panjang password baru minimal harus 8 karakter.');
      return;
    }

    // ── VALIDATION 3: Konfirmasi Password harus cocok ──
    if (trimmedPass !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    // Check duplicate username
    const exists = users.some((u) => u.username.toLowerCase() === trimmedUser.toLowerCase());
    if (exists) {
      setError('Username sudah terdaftar di sistem. Silakan pilih username lain.');
      return;
    }

    // Save registration
    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: newUserId,
      username: trimmedUser,
      password: trimmedPass,
      role: role,
      status: role === 'mua' ? 'pending' : 'active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onRegister(newUser, role);
    
    if (role === 'mua') {
      setSuccess('Registrasi sukses! Akun MUA Anda sedang diverifikasi. Menunggu persetujuan Admin sebelum login.');
    } else {
      setSuccess('Registrasi sukses! Silakan login menggunakan akun baru Anda.');
    }
    
    // Clear registration fields
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    
    // Transition to login page
    setTimeout(() => {
      setIsRegister(false);
      setSuccess('');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full flex items-stretch">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row shadow-2xl overflow-hidden bg-dark">
        
        {/* Left Visual Panel for LOGIN or Right Visual Panel for REGISTER */}
        <div className={`hidden md:flex flex-col justify-center px-12 lg:px-20 relative overflow-hidden bg-gradient-to-br from-[#2d0a4f] via-[#5b1a8a] to-[#c73468] text-white transition-all duration-700 w-[45%] lg:w-[50%] ${
          isRegister ? 'order-2' : 'order-1'
        }`}>
          {/* Floating Neon Orbs */}
          <div className="absolute w-80 h-80 rounded-full bg-rose/40 blur-[60px] top-[-80px] right-[-60px] animate-pulse" />
          <div className="absolute w-72 h-72 rounded-full bg-purple/40 blur-[60px] bottom-[-60px] left-[-40px]" />
          
          <div className="relative z-10 text-center md:text-left space-y-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto md:mx-0">
              💄
            </div>
            
            <div className="space-y-3">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">
                GlamBook<br />MUA
              </h1>
              <p className="text-white/70 text-sm lg:text-base max-w-sm">
                Platform booking Makeup Artist (MUA) profesional tepercaya untuk menyempurnakan hari istimewa Anda.
              </p>
            </div>

            {/* Feature List (Dynamic based on login/register view) */}
            <ul className="space-y-4 text-left max-w-sm pt-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-rose">
                  <Sparkles size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">Portfolio MUA Terpilih & Profesional</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gold">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">Sistem Akun & Keamanan Data Terjaga</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-purple-light">
                  <Star size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">Rating & Ulasan Asli dari Pelanggan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Panel */}
        <div className={`flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 relative overflow-hidden bg-dark ${
          isRegister ? 'order-1' : 'order-2'
        }`}>
          {/* Subtle Background Glows */}
          <div className="absolute w-[400px] h-[400px] bg-purple/10 blur-[80px] top-[-100px] right-[-100px] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] bg-rose/5 blur-[80px] bottom-[-100px] left-[-100px] pointer-events-none" />

          <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
            {/* Header */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold">{isRegister ? 'Bergabung Sekarang' : 'Selamat Datang'}</span>
              <h2 className="font-serif text-3xl font-bold text-white mt-1">
                {isRegister ? 'Daftar Akun Baru' : 'Masuk ke GlamBook'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {isRegister 
                  ? 'Daftar sebagai pelanggan atau Makeup Artist untuk memulai layanan.' 
                  : 'Gunakan akun terdaftar Anda (Admin, Customer, atau MUA).'}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm flex items-start gap-2.5">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-sm flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username unik Anda"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:bg-rose/5 focus:ring-4 focus:ring-rose/10 transition-all"
                  />
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegister ? 'Panjang minimal 8 karakter' : 'Masukkan password Anda'}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:bg-rose/5 focus:ring-4 focus:ring-rose/10 transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-rose cursor-pointer focus:outline-none"
                    title={showPass ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Registration Specific Fields */}
              {isRegister && (
                <>
                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="confirm_password">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        id="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password di atas"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose focus:bg-rose/5 focus:ring-4 focus:ring-rose/10 transition-all"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            seg <= strength
                              ? strength <= 1
                                ? 'bg-red-500'
                                : strength === 2
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 block mt-1">{strengthText}</span>
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Daftar Sebagai
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`py-3 px-4 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          role === 'customer'
                            ? 'bg-rose/10 border-rose text-rose shadow-lg shadow-rose/10'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        👜 Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('mua')}
                        className={`py-3 px-4 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          role === 'mua'
                            ? 'bg-purple/20 border-purple text-purple-light shadow-lg shadow-purple/10'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        💄 Make-Up Artist
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Login Specific Fields */}
              {!isRegister && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 accent-rose cursor-pointer"
                    />
                    <span>Ingat saya 10 menit</span>
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg ${
                  isRegister
                    ? 'bg-gradient-to-r from-purple to-purple-dark hover:shadow-purple/30'
                    : 'bg-gradient-to-r from-rose to-rose-dark hover:shadow-rose/30'
                }`}
              >
                {isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark px-3 text-gray-500 uppercase font-semibold tracking-wider">Atau</span>
              </div>
            </div>

            {/* Bottom link toggle */}
            <div className="text-center text-xs sm:text-sm text-gray-400">
              {isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}{' '}
              <button
                onClick={handleToggleView}
                className="text-rose font-bold hover:underline bg-transparent border-none cursor-pointer focus:outline-none"
              >
                {isRegister ? 'Masuk di sini' : 'Daftar sebagai Customer / MUA'}
              </button>
            </div>

            {/* Quick credentials helper for debug / evaluation */}
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl space-y-1.5 text-[11px] text-gray-400/80">
              <div className="font-bold text-gray-300 flex items-center gap-1">
                <Info size={12} className="text-gold shrink-0" />
                <span>Uji Coba Cepat (Akun Seeding SQL):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <strong className="text-white">Admin:</strong> admin<br />
                  <span className="text-gray-500">pass:</span> admin123
                </div>
                <div>
                  <strong className="text-white">Customer:</strong> ascee<br />
                  <span className="text-gray-500">pass:</span> 123
                </div>
                <div>
                  <strong className="text-white">MUA:</strong> ayumua<br />
                  <span className="text-gray-500">pass:</span> password123
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
