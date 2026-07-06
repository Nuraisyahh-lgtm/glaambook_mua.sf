/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'admin' | 'customer' | 'mua';

export interface User {
  id: number;
  username: string;
  password?: string; // hashed or plain for school project
  role: Role;
  status?: 'active' | 'pending'; // 'active' for default/approved, 'pending' for newly registered MUAs
  created_at?: string;
}

export interface MUA {
  id: number;
  userId?: number; // Connects a MUA user account to their MUA profile
  nama: string;
  spesialisasi: string;
  harga: number | null;
  jadwal: string;
  rating: number;
  ulasan_singkat: string | null;
  whatsapp: string | null;
  alamat?: string; // Physical address of the MUA
  created_at?: string;
  status?: 'aktif' | 'pending';
}

export interface Booking {
  id: number;
  id_user: number;
  id_mua: number;
  tanggal: string;
  jam: string;
  no_hp: string;
  alamat: string;
  catatan: string;
  status: 'pending' | 'batal' | 'selesai';
  created_at?: string;
  
  // Virtual fields for easy rendering
  username?: string; // Customer username
  nama_mua?: string; // MUA name
}

export interface MUAPhoto {
  id: number;
  id_mua: number;
  file: string; // Image path or URL
  caption: string;
  created_at?: string;
}

export interface Review {
  id: number;
  id_user: number;
  id_mua: number;
  rating: number;
  komentar: string;
  created_at?: string;
  
  // Virtual field
  username?: string;
}
