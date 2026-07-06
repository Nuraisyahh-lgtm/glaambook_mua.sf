/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { LogOut, Home, Calendar, User as UserIcon, Users, ClipboardList, Menu, X, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Navbar({ user, currentView, onNavigate, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
  };

  const isCustomer = user.role === 'customer';
  const isAdmin = user.role === 'admin';
  const isMua = user.role === 'mua';

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0a1ea6] backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <button 
          onClick={() => handleNav(isCustomer ? 'home' : isAdmin ? 'admin-mua' : 'mua-dashboard')} 
          className="flex items-center gap-2 cursor-pointer group text-left"
        >
          <span className="text-2xl">💄</span>
          <span className="font-serif text-lg md:text-xl font-bold text-white tracking-tight">
            GlamBook <span className="text-rose group-hover:text-rose/80 transition-colors">MUA</span>
          </span>
        </button>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-1.5 ml-auto">
          {isCustomer && (
            <>
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'home' || currentView === 'detail' || currentView === 'booking-form'
                      ? 'text-rose bg-rose/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home size={15} /> Beranda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('booking-saya')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'booking-saya' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar size={15} /> Booking Saya
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('account')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserIcon size={15} /> Akun
                </button>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li>
                <button 
                  onClick={() => handleNav('admin-mua')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'admin-mua' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users size={15} /> Data MUA
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('admin-bookings')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'admin-bookings' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ClipboardList size={15} /> Data Booking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('account')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserIcon size={15} /> Atur Akun
                </button>
              </li>
            </>
          )}

          {isMua && (
            <>
              <li>
                <button 
                  onClick={() => handleNav('mua-dashboard')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'mua-dashboard' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ClipboardList size={15} /> Dashboard Booking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('mua-photos')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'mua-photos' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ImageIcon size={15} /> Kelola Foto
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('account')} 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserIcon size={15} /> Atur Akun
                </button>
              </li>
            </>
          )}

          <li>
            <button 
              onClick={onLogout} 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} /> Keluar
            </button>
          </li>
        </ul>

        {/* User Badge Chip */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full ml-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose to-purple flex items-center justify-center font-bold text-sm text-white select-none">
            {user.username.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col pr-1">
            <span className="text-xs font-semibold text-white leading-tight">{user.username}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isAdmin ? 'text-gold' : isMua ? 'text-purple' : 'text-rose'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {isCustomer && (
            <>
              <button 
                onClick={() => handleNav('home')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'home' || currentView === 'detail' || currentView === 'booking-form'
                    ? 'text-rose bg-rose/10' 
                    : 'text-gray-400'
                }`}
              >
                <Home size={16} /> Beranda
              </button>
              <button 
                onClick={() => handleNav('booking-saya')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'booking-saya' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <Calendar size={16} /> Booking Saya
              </button>
              <button 
                onClick={() => handleNav('account')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <UserIcon size={16} /> Akun Saya
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button 
                onClick={() => handleNav('admin-mua')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'admin-mua' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <Users size={16} /> Data MUA
              </button>
              <button 
                onClick={() => handleNav('admin-bookings')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'admin-bookings' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <ClipboardList size={16} /> Data Booking
              </button>
              <button 
                onClick={() => handleNav('account')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <UserIcon size={16} /> Pengaturan Akun
              </button>
            </>
          )}

          {isMua && (
            <>
              <button 
                onClick={() => handleNav('mua-dashboard')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'mua-dashboard' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <ClipboardList size={16} /> Dashboard Booking
              </button>
              <button 
                onClick={() => handleNav('mua-photos')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'mua-photos' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <ImageIcon size={16} /> Kelola Foto Portofolio
              </button>
              <button 
                onClick={() => handleNav('account')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  currentView === 'account' ? 'text-rose bg-rose/10' : 'text-gray-400'
                }`}
              >
                <UserIcon size={16} /> Atur Akun Saya
              </button>
            </>
          )}

          <div className="h-px bg-white/5 my-1" />

          {/* User Details info inside Drawer */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose to-purple flex items-center justify-center font-bold text-sm text-white">
              {user.username.substring(0, 1).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">{user.username}</span>
              <span className="text-[10px] text-gray-400 capitalize">{user.role}</span>
            </div>
          </div>

          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 text-left transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      )}
    </nav>
  );
}
