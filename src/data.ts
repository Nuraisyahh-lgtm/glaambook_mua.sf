/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, MUA, Booking, MUAPhoto, Review } from './types';

export const INITIAL_USERS: User[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', created_at: '2025-12-10 19:17:57' },
  { id: 2, username: 'ascee', password: '123', role: 'customer', created_at: '2025-12-10 19:45:21' },
  { id: 3, username: 'yayaw', password: '123', role: 'customer', created_at: '2025-12-10 19:47:39' },
  { id: 4, username: 'aisyah', password: '12345', role: 'customer', created_at: '2025-12-10 20:10:19' },
  // Pre-seeded MUA accounts linking to the MUA records
  { id: 5, username: 'ayumua', password: 'password123', role: 'mua', created_at: '2025-12-10 19:17:57' },
  { id: 6, username: 'dewiglam', password: 'password123', role: 'mua', created_at: '2025-12-10 19:17:57' },
  { id: 7, username: 'ratumakeup', password: 'password123', role: 'mua', created_at: '2025-12-10 19:17:57' },
  { id: 8, username: 'liaartist', password: 'password123', role: 'mua', created_at: '2025-12-10 19:17:57' },
  { id: 9, username: 'sintabeauty', password: 'password123', role: 'mua', created_at: '2025-12-10 19:17:57' }
];

export const INITIAL_MUA: MUA[] = [
  {
    id: 1,
    userId: 5,
    nama: 'Ayu MUA',
    spesialisasi: 'Pernikahan',
    harga: 1500000,
    jadwal: 'Senin - Jumat, 09:00 - 17:00',
    rating: 5.0,
    ulasan_singkat: 'bagus sangat',
    whatsapp: '6281234567891',
    status: 'aktif'
  },
  {
    id: 2,
    userId: 6,
    nama: 'Dewi Glam',
    spesialisasi: 'Photoshoot',
    harga: 1000000,
    jadwal: 'Sabtu & Minggu, 10:00 - 15:00',
    rating: 3.0,
    ulasan_singkat: 'Sangat direkomendasikan untuk look glamor',
    whatsapp: '6281234567892',
    status: 'aktif'
  },
  {
    id: 3,
    userId: 7,
    nama: 'Ratu Makeup',
    spesialisasi: 'Party Look',
    harga: 800000,
    jadwal: 'Setiap Hari, 08:00 - 22:00',
    rating: 5.0,
    ulasan_singkat: 'Makeup awet seharian tanpa luntur',
    whatsapp: '6281234567893',
    status: 'aktif'
  },
  {
    id: 4,
    userId: 8,
    nama: 'Lia Artist',
    spesialisasi: 'Makeup Wisuda',
    harga: 750000,
    jadwal: 'Senin - Jumat, 08:00 - 18:00',
    rating: 4.5,
    ulasan_singkat: 'Natural look, sangat cocok untuk wisuda',
    whatsapp: '6281234567894',
    status: 'aktif'
  },
  {
    id: 5,
    userId: 9,
    nama: 'Sinta Beauty',
    spesialisasi: 'Engagement',
    harga: 1200000,
    jadwal: 'Weekend only',
    rating: 4.8,
    ulasan_singkat: 'Hasil makeup halus dan tidak crack',
    whatsapp: '6281234567895',
    status: 'aktif'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 1,
    id_user: 2,
    id_mua: 1,
    tanggal: '2026-08-11',
    jam: '08:00',
    no_hp: '08123456789',
    alamat: 'btp Blok M No. 12',
    catatan: 'Tolong makeup natural rose gold look ya kak.',
    status: 'pending',
    created_at: '2025-12-10 19:46:24'
  },
  {
    id: 2,
    id_user: 4,
    id_mua: 3,
    tanggal: '2025-12-12',
    jam: '04:12',
    no_hp: '08529944882',
    alamat: 'Samata, Gowa',
    catatan: 'Untuk wisuda jam 7 pagi, mohon datang tepat waktu.',
    status: 'selesai',
    created_at: '2025-12-10 20:12:33'
  }
];

export const INITIAL_PHOTOS: MUAPhoto[] = [
  {
    id: 1,
    id_mua: 1,
    file: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    caption: 'Traditional Wedding Look',
    created_at: '2025-12-11 00:30:39'
  },
  {
    id: 2,
    id_mua: 2,
    file: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    caption: 'High Fashion Editorial Glam',
    created_at: '2025-12-11 00:31:48'
  },
  {
    id: 3,
    id_mua: 3,
    file: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    caption: 'Glowy Soft Party Makeup',
    created_at: '2025-12-11 00:34:19'
  },
  {
    id: 4,
    id_mua: 4,
    file: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    caption: 'Natural Dewy Graduation Look',
    created_at: '2025-12-11 00:33:14'
  },
  {
    id: 5,
    id_mua: 5,
    file: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80',
    caption: 'Elegant Engagement Look',
    created_at: '2025-12-11 00:35:26'
  },
  // Extra photos for gallery
  {
    id: 6,
    id_mua: 1,
    file: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80',
    caption: 'Modern Bridal Makeup',
    created_at: '2025-12-11 00:40:00'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    id_user: 2,
    id_mua: 3,
    rating: 5,
    komentar: 'Bagus banget hasilnya, awet seharian dari akad sampai resepsi tidak crack sama sekali!',
    created_at: '2025-12-10 19:45:46'
  },
  {
    id: 2,
    id_user: 4,
    id_mua: 2,
    rating: 3,
    komentar: 'Lumayan worth it dengan harga segitu, tapi di bagian hidung agak berminyak setelah 5 jam.',
    created_at: '2025-12-10 20:23:38'
  }
];
