/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MUA, Booking, MUAPhoto, Review, Role } from './types';
import {
  INITIAL_USERS,
  INITIAL_MUA,
  INITIAL_BOOKINGS,
  INITIAL_PHOTOS,
  INITIAL_REVIEWS
} from './data';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import MuaDetail from './components/MuaDetail';
import BookingSaya from './components/BookingSaya';
import AccountSettings from './components/AccountSettings';
import AdminDashboard from './components/AdminDashboard';
import MuaDashboard from './components/MuaDashboard';

export default function App() {
  
  // ── 1. CORE DATABASE STATE (LocalStorage Persistence) ──
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('glambook_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [muas, setMuas] = useState<MUA[]>(() => {
    const saved = localStorage.getItem('glambook_muas');
    if (saved) {
      try {
        const parsed: MUA[] = JSON.parse(saved);
        return parsed.map((m) => m.status ? m : { ...m, status: 'aktif' });
      } catch (e) {
        return INITIAL_MUA;
      }
    }
    return INITIAL_MUA;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glambook_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [photos, setPhotos] = useState<MUAPhoto[]>(() => {
    const saved = localStorage.getItem('glambook_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('glambook_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // ── 2. SESSION STATE ──
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glambook_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // ── 3. ROUTING STATE ──
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedMuaId, setSelectedMuaId] = useState<number | null>(null);

  // Sync state back to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('glambook_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('glambook_muas', JSON.stringify(muas));
  }, [muas]);

  useEffect(() => {
    localStorage.setItem('glambook_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('glambook_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('glambook_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('glambook_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('glambook_currentUser');
    }
  }, [currentUser]);

  // Adjust starting view on successful login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setCurrentView('admin-mua');
      } else if (currentUser.role === 'mua') {
        setCurrentView('mua-dashboard');
      } else {
        setCurrentView('home');
      }
    } else {
      setCurrentView('login');
    }
  }, [currentUser]);

  // ── 4. EVENT HANDLERS ──
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Completely destroy the session
    localStorage.removeItem('glambook_currentUser');
    setCurrentUser(null);
    setCurrentView('login');
    setShowLogoutConfirm(false);
  };

  const handleRegister = (newUser: User, targetRole: Role) => {
    // 1. Add User to Database
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // 2. If registration role is MUA, automatically create their MUA profile row (CRUD: CREATE)
    if (targetRole === 'mua') {
      const newMUAId = muas.length > 0 ? Math.max(...muas.map((m) => m.id)) + 1 : 1;
      const newMUAProfile: MUA = {
        id: newMUAId,
        userId: newUser.id,
        nama: newUser.username + ' Makeup',
        spesialisasi: '',
        harga: null,
        jadwal: '',
        rating: 5.0,
        ulasan_singkat: null,
        whatsapp: null,
        status: 'pending'
      };
      setMuas([...muas, newMUAProfile]);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleViewMuaDetail = (muaId: number) => {
    setSelectedMuaId(muaId);
    setCurrentView('detail');
  };

  const handleViewBookingForm = (muaId: number) => {
    setSelectedMuaId(muaId);
    setCurrentView('detail');
    // Pre-select 'booking' sub-tab within MuaDetail by rendering MuaDetail with specific triggers
    setTimeout(() => {
      const bookingBtn = document.querySelector('[id="booking-tab-btn"]');
      if (bookingBtn) {
        (bookingBtn as HTMLButtonElement).click();
      }
    }, 100);
  };

  // ── 5. RENDER FLOW ──
  if (!currentUser) {
    return (
      <Login
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark selection:bg-rose selection:text-white">
      {/* Dynamic Role-based Navigation header */}
      <Navbar
        user={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 pb-16">
        
        {/* CUSTOMER VIEWS */}
        {currentUser.role === 'customer' && (
          <>
            {currentView === 'home' && (
              <CustomerDashboard
                muas={muas}
                bookings={bookings}
                users={users}
                onNavigateToMuaDetail={handleViewMuaDetail}
                onNavigateToBookingForm={handleViewBookingForm}
              />
            )}

            {currentView === 'detail' && selectedMuaId !== null && (
              <MuaDetail
                user={currentUser}
                muaId={selectedMuaId}
                muas={muas}
                setMuas={setMuas}
                photos={photos}
                reviews={reviews}
                setReviews={setReviews}
                bookings={bookings}
                setBookings={setBookings}
                users={users}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'booking-saya' && (
              <BookingSaya
                user={currentUser}
                bookings={bookings}
                setBookings={setBookings}
                muas={muas}
                onNavigateToMuaDetail={handleViewMuaDetail}
              />
            )}
          </>
        )}

        {/* ADMIN VIEWS */}
        {currentUser.role === 'admin' && currentView !== 'account' && (
          <AdminDashboard
            muas={muas}
            setMuas={setMuas}
            bookings={bookings}
            setBookings={setBookings}
            photos={photos}
            setPhotos={setPhotos}
            users={users}
            setUsers={setUsers}
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        )}

        {/* MUA VIEWS */}
        {currentUser.role === 'mua' && (
          <MuaDashboard
            user={currentUser}
            muas={muas}
            setMuas={setMuas}
            bookings={bookings}
            setBookings={setBookings}
            photos={photos}
            setPhotos={setPhotos}
            users={users}
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        )}

        {/* PROFILE SECURITY VIEW (SHARED ACROSS ALL ROLES EXCEPT MUA) */}
        {currentView === 'account' && currentUser.role !== 'mua' && (
          <AccountSettings
            user={currentUser}
            setUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            onNavigate={handleNavigate}
          />
        )}

      </main>

      {/* CUSTOM LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop with fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Container with slide-up & scale animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
              className="relative w-full max-w-sm bg-[#161226] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
            >
              {/* Soft visual background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-5 text-center relative z-10">
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" x2="9" y1="12" y2="12"/>
                  </svg>
                </div>

                {/* Message headings */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-white tracking-tight">Konfirmasi Keluar</h3>
                  <p className="text-xs text-gray-400 leading-relaxed px-1">
                    Apakah Anda yakin ingin keluar dari sistem <span className="font-semibold text-white">GlamBook MUA</span>? Sesi aktif Anda akan segera dihapus dengan aman.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="flex-1 py-2.5 bg-rose hover:bg-rose-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-rose/15 hover:shadow-rose/30"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
