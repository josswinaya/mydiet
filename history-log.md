# History Log — Ringkas

**Instruksi Khusus untuk AI: Workflow Pencatatan (Semi-Otomatis)**
Sebagai asisten AI, kamu bertindak sebagai "Sekretaris Proyek" untuk file ini. Terapkan aturan berikut selama sesi coding:
1. **Konteks Awal:** Setiap kali memulai sesi, jadikan file ini sebagai acuan utama untuk mengetahui status terakhir proyek dan *bug* apa saja yang masih berstatus "Sedang Dikerjakan" atau "Belum Ditangani".
2. **Inisiatif Pembaruan:** Setiap kali kita berhasil menyelesaikan implementasi fitur inti atau berhasil memperbaiki sebuah *bug*, tawarkan diri secara proaktif: *"Apakah Anda ingin saya membuatkan teks pembaruan untuk history-log.md?"*
3. **Perintah "Update Log":** Jika saya memberikan perintah "Update log" atau "Catat progres", kamu wajib merangkum pekerjaan yang baru saja kita lakukan di sesi ini, lalu menghasilkan draf Markdown yang sudah disesuaikan untuk tabel **Log Kemajuan** atau **Daftar Bug**.
4. **Aturan Output:** Selalu berikan hasil pembaruanmu dalam bentuk *Code Block* Markdown utuh agar saya bisa langsung melakukan *copy-paste* (atau *apply*) ke file ini tanpa perlu memformat ulang tabelnya.
Dokumen ini mencatat kemajuan pengerjaan (Log) dan daftar masalah yang belum selesai (Bug) selama pengembangan projek.

---

## 📋 Log Kemajuan

Format: `[Tanggal] — [Ringkasan pekerjaan]`

| Tanggal | Progres | Catatan |
|---|---|---|
| 2026-08-06 | Setup credential: Neon PostgreSQL + Gemini API Key + `.env.local` | NEXTAUTH_SECRET di-generate via Node.js crypto |
| 2026-08-06 | Install dependencies: Prisma v5, NextAuth v5 beta, bcryptjs, recharts, @google/genai, ts-node | Downgrade Prisma v7→v5 karena breaking change `prisma.config.ts` |
| 2026-08-06 | Buat struktur folder: `src/components`, `lib`, `hooks`, `types`, `actions` + folder `prisma/` | Sesuai arsitektur GEMINI.md |
| 2026-08-06 | Setup Prisma schema: User, WeightLog, FoodItem, MetActivity, FoodEntry, ExerciseEntry, Prediction | Tambah model MetActivity (tidak ada di PRD tapi dibutuhkan seed) |
| 2026-08-06 | Konfigurasi Tailwind v4 + Design Tokens dari DESIGN.md di `globals.css` | Font Poppins via Google Fonts, semua color token dari DESIGN.md |
| 2026-08-06 | Buat lib: `prisma.ts` (singleton), `auth.ts` (NextAuth), `calories.ts` (BMR/TDEE/MET) | Formula BMR Mifflin-St Jeor, proyeksi 7700 kcal/kg |
| 2026-08-06 | Buat types: `index.ts` (semua interface), `next-auth.d.ts` (session augmentation) | Semua kontrak data sudah terdefinisi |
| 2026-08-06 | `prisma migrate dev --name init` → database Neon tersinkron | Migration SQL berhasil diapply ke Neon PostgreSQL |
| 2026-08-06 | `prisma db seed` → 53 FoodItems + 30 MetActivities tersimpan | Makanan umum Indonesia + aktivitas olahraga dengan nilai MET |
| 2026-08-06 | `npm run dev` berjalan di http://localhost:3000 ✅ | Next.js 16.2.12 + Turbopack, env loaded dari `.env.local` dan `.env` |
| 2026-08-07 | Init Shadcn/ui v4 + install lucide-react | Shadcn tambahkan `button.tsx`, `utils.ts`, update globals.css |
| 2026-08-07 | Buat `src/actions/auth.ts`: loginAction + registerAction (Server Actions) | Auto-login setelah register, redirect ke /profile/setup |
| 2026-08-07 | Buat `src/actions/profile.ts`: saveProfileAction (validasi + transaksi Prisma) | Update user + buat WeightLog awal dalam 1 transaksi |
| 2026-08-07 | Buat API route `POST /api/auth/register` dengan validasi + bcrypt hash | Validasi email, cek duplikat, hash cost 12 |
| 2026-08-07 | Buat halaman Login `/login` + Register `/register` sesuai DESIGN.md | Hero gradient hijau, form container rounded, error state |
| 2026-08-07 | Buat halaman Setup Profil `/profile/setup` | Radio pill gender, card input fisik, radio card aktivitas dengan :has CSS |
| 2026-08-07 | Buat middleware proteksi route + app/auth route groups + dashboard placeholder | Zero TypeScript errors, `npm run dev` berjalan ✅ |
| 2026-08-08 | Rename `middleware.ts` → `proxy.ts` (Next.js 16 convention) | Fix deprecation warning ⚠️ → ✅ |
| 2026-08-08 | Update Prisma schema v2: FoodItem (gizi per 100g), FoodEntry & ExerciseEntry (relasi FK), enum MealType | Migrasi v2 berhasil ke Neon, seed ulang 45 FoodItems + 30 MetActivities |
| 2026-08-08 | Buat API routes: `GET/POST/DELETE /api/food-entries`, `GET/POST/DELETE /api/exercise-entries`, `GET /api/food-items`, `GET /api/activities` | Auth guard + ownership check di semua endpoint |
| 2026-08-08 | Buat komponen: `FoodSearch`, `FoodLogForm`, `ExerciseLogForm`, `LogPageClient` | Debounced search, live preview kalori, optimistic UI delete, toast Sonner |
| 2026-08-08 | Buat halaman `/log` (server component) + install sonner + tambah Toaster ke root layout | Zero TypeScript errors ✅ |
| | | |
| | | |
| | | |
| | | |
| | | |

---

## 🐛 Daftar Bug / Masalah Belum Selesai

| ID | Deskripsi Masalah | Prioritas | Status | Ditemukan | Catatan |
|---|---|---|---|---|---|
| BUG-01 | | Tinggi / Sedang / Rendah | Belum Ditangani / Sedang Dikerjakan / Selesai | YYYY-MM-DD | |
| BUG-02 | | | | | |
| BUG-03 | | | | | |
| BUG-04 | | | | | |
| BUG-05 | | | | | |

**Keterangan Prioritas:**
- **Tinggi** — menghalangi fitur inti berfungsi, harus diperbaiki sebelum lanjut
- **Sedang** — mengganggu tapi ada workaround sementara
- **Rendah** — kosmetik/edge case jarang terjadi, bisa ditunda

**Keterangan Status:**
- **Belum Ditangani** — sudah tercatat, belum mulai dikerjakan
- **Sedang Dikerjakan** — sedang dalam proses perbaikan
- **Selesai** — sudah diperbaiki dan diverifikasi

---

## ✅ Bug Selesai (Arsip)

| ID | Deskripsi Masalah | Tanggal Selesai | Solusi |
|---|---|---|---|
| | | | |
| | | | |
