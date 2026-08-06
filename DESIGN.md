# DESIGN.md — MyDiet

Dokumentasi hasil slicing desain Figma ke kode. Referensi ini digunakan agar implementasi (HTML/CSS/React/Tailwind, dsb) konsisten dengan desain asli.

---

## 0. Design Tokens

### 0.1 Color Palette

**Brand / Primary Green**
| Token | Hex | Penggunaan |
|---|---|---|
| `primary` | `#376B00` | Tombol utama, brand text, active state, progress bar/ring |
| `primary-dark` | `#246D00` | Teks hijau (persentase, angka positif) |
| `primary-dark-alt` | `#2D5900` | Teks hijau (angka kalori keluar di log) |
| `primary-alt` | `#267101` | Varian icon/aksen hijau tua |
| `primary-hover` | `#4E9A2E` | State hover/variant tombol hijau |
| `primary-light-icon` | `#8BD44D` | Background icon bulat (kalori masuk, insight bulb) |
| `primary-light-icon-alt` | `#A2F57C` | Varian icon hijau muda |
| `primary-soft-bg` | `#EAF7DC` | Background card highlight (light green) |

**Neutral / Text**
| Token | Hex | Penggunaan |
|---|---|---|
| `text-dark` | `#1B1B1C` | Teks utama/hitam (heading, label) |
| `text-dark-alt` | `#1F1F1F` | Varian teks hitam (form auth) |
| `text-secondary` | `#414939` | Teks abu kehijauan (deskripsi/body) |
| `text-muted` | `#8A8A8A` | Teks abu (label, subtext) |
| `text-placeholder` | `#6B7280` | Placeholder input |
| `border` | `#EDEDED` | Stroke/border card & input |
| `bg-neutral` | `#F0EDED` | Background card netral (mis. Prediksi Mingguan) |
| `bg-app` | `#FCF9F8` | Background utama aplikasi (off-white) |
| `white` | `#FFFFFF` | Background card, teks di atas tombol hijau |

**Semantic / Accent**
| Token | Hex | Penggunaan |
|---|---|---|
| `danger` | `#BA1A1A` | Teks kalori keluar (dashboard) |
| `danger-bg` | `#FFDAD6` | Background icon kalori keluar |
| `danger-alt` | `#E85B4E` | Teks selisih negatif, alert |
| `warning-bg` | `#FFAE87` | Bar chart "In" (kalori masuk), light orange |
| `warning-text` | `#9F4203` | Teks kalori masuk (log item) |
| `warning-text-dark` | `#7A3000` | Varian teks oranye tua |
| `warning-strong` | `#873600` | Aksen oranye tua (prediksi) |
| `icon-bg-neutral` | `#E5E2E1` | Background icon log netral |

### 0.2 Typography
- **Font family:** Poppins (satu-satunya font di seluruh aplikasi)
- **Heading besar (hero/angka utama):** Bold, 24–28px
- **Heading section:** SemiBold/Bold, 18–20px, line-height 24
- **Body:** Regular, 14px, line-height 20
- **Label kecil/caption:** Regular, 12px
- **Button text:** SemiBold, 16px, warna putih di atas fill hijau

### 0.3 Radius & Spacing
| Elemen | Radius |
|---|---|
| Card standar | 20px |
| Input field | 12–16px |
| Button | 20px (atau full/pill untuk badge & bottom nav) |
| Badge/pill | 9999px (full) |
| Icon container bulat | 50px (full) / lingkaran |
| Bottom navigation bar | 50px (full pill) |

Padding umum: 16px atau 24px pada card. Gap antar elemen: 8 / 16 / 24px.

### 0.4 Komponen Reusable
- **Primary Button:** fill `#376B00`, radius 20, teks putih bold, padding ±16v/24h, kadang dengan icon (arrow/plus)
- **Card:** fill `#FFFFFF`, stroke `#EDEDED` 1px inside, radius 20, kadang drop shadow
- **Input Field:** fill `#FFFFFF`, stroke `#EDEDED`, radius 12–16, placeholder `#6B7280`, icon kiri opsional
- **Badge/Pill (status):** fill `#376B00` atau `#EAF7DC`, radius full, padding 8/4
- **Bottom Navigation:** container pill putih (shadow), 4 menu (Dashboard/Log/Grafik/Prediksi), item aktif → pill fill `#376B00` teks putih; item non-aktif → icon+teks abu tanpa background

---

## 1. Landing Page

**Header** — Auto layout 390 Fill × 64 Hug, padding 24h/16v
- Logo "MyDiet" (hijau `#376B00`, bold)
- Icon lonceng notifikasi + avatar foto profil (kanan)

**Hero Section**
- Gambar bowl salad (cover, rounded)
- Heading 2 baris: "Capai Berat Badan" (hitam) + "Ideal dengan Sehat" (hijau `#376B00`), keduanya bold
- Body abu: "Pantau asupan nutrisi harian Anda dengan mudah. Teknologi AI kami memberikan prediksi akurat untuk membantu Anda mencapai target kesehatan tanpa rasa lapar yang berlebihan."
- CTA Button "Mulai Sekarang" — full width (342 Fill), radius 20, fill `#376B00`, teks putih

**Card "Prediksi AI Pintar"** — background `#EAF7DC`
- Badge pill "✨ Prediksi AI Pintar" — fill `#376B00`, radius full, teks putih, padding 8/4
- Heading "Tahu Masa Depan Berat Badanmu" — bold `#1B1B1C`
- Body — `#414939`: "Algoritma cerdas kami menganalisis kebiasaan makan Anda dan memprediksi progres berat badan dalam 30 hari ke depan secara akurat."

**Card "Log Cepat"** — fill putih, W Fill 292
- Heading: Poppins SemiBold 18/24, `#1B1B1C`
- Body: Poppins Regular 14/20, `#414939`
- "Catat apa pun yang Anda makan hanya dengan satu ketukan atau foto makanan Anda."

**Card "Detail Nutrisi"** — fill putih
- "Bukan hanya kalori. Pantau makro (protein, karbo, lemak) dan mikro nutrisi Anda."

**Testimonial Card**
- Background foto dapur (blur/overlay), card putih rounded 32, padding 24/20/24/24.75
- Icon quote hijau besar
- Quote italic SemiBold 18/24.8, `#1B1B1C`, center: "Berkat MyDiet, saya turun 8kg dalam 3 bulan tanpa merasa sedang diet ketat. Prediksi AI-nya sangat membantu saya tetap termotivasi!"
- Nama "Joshua" — hijau `#376B00` bold
- Role "Mahasiswa TI | Founder" — `#414939`

---

## 2. Auth & Onboarding

### 2.1 Login
**Frame:** 390 × 1000.71 Hug
- Image cover atas (foto sayuran, full width, tanpa rounded)
- Form container: W Fill × H 687.71 Hug, padding 24h/32v, radius 20 (top only) menyambung image
- Header: "MyDiet" hijau bold + subtext "Kelola asupan nutrisi Anda dengan lebih cerdas." (`#8A8A8A`)
- Input Email & Password: W 342 Fill × H 55 Hug, radius 16, fill putih, stroke `#EDEDED`, placeholder `#6B7280`, icon kiri (mail/lock), password ada toggle eye kanan
- Link "Lupa password?" — hijau, kanan atas field password
- Button "Masuk →" — W 342 Fill × H 52, radius 20, fill `#376B00`, icon arrow
- Divider "Atau masuk dengan"
- Button "Google" — W 342 Fill × H 54, radius 16, fill putih, stroke `#EDEDED`, logo Google
- Footer: teks ToS/privacy kecil abu, "Belum punya akun? Daftar di sini" (link hijau)
- Footer bar bawah: H 73 Hug, stroke top `#EDEDED`, "© 2026 MyDiet. Digital Nutrition Assistant."

### 2.2 Registrasi
**Frame:** 390 × 1029 Hug — struktur identik dengan Login (image cover, form container, footer bar)
- Header: "MyDiet" + subtext "Mulai perjalanan hidup sehatmu hari ini."
- 4 field (masing-masing W 342 Fill × H 87 Hug, gap 8), style sama seperti login:
  1. Nama Lengkap — icon person, placeholder "John Doe"
  2. Email — icon mail
  3. Password — icon lock, toggle eye
  4. Konfirmasi Password — icon lock+refresh, toggle eye
- Button "Buat Akun →" — style sama seperti tombol Masuk
- Link "Sudah punya akun? Masuk"
- Footer bar sama seperti login

### 2.3 Lengkapi Profil (Onboarding)
**Frame:** 427 × 1059.67 Hug, background `#FCF9F8`
- Top nav: "← Biodata Profil" (hijau) + avatar
- Heading: "Mari Lengkapi Profil Anda" (bold) + subtext "Data ini membantu kami menghitung kebutuhan kalori harian Anda secara akurat." (`#414939`)

**Section Jenis Kelamin** (2 pill button sejajar, W 181.5 Fill × H ~80 Hug, radius 20, padding 16)
- Selected: fill `#EAF7DC`, stroke `#376B00`, icon+teks hijau bold
- Unselected: fill putih, stroke `#EDEDED`, icon+teks abu

**Card input angka** (fill putih, stroke `#EDEDED`, radius 20, container 379 Fill × 288 Hug)
- 3 field: Usia (Tahun), Tinggi Badan (cm), Berat Badan (kg)
- Input: W 345 Fill × H 54, radius 12, fill putih, stroke `#EDEDED`, placeholder abu

**Section Tingkat Aktivitas** (3 card vertikal, W 379 Fill × H 52–74 Hug, radius 16–20, padding 16)
- Icon bulat kiri + judul bold + deskripsi abu
- Selected ("Sedentary"): fill `#EAF7DC`, stroke `#376B00`, icon bg `#376B00` icon putih
- Unselected: fill putih, stroke `#EDEDED`, icon bg `#EDEDED` icon hijau
  - Sedentary: "Sedikit atau tidak ada olahraga"
  - Moderate: "Olahraga 3-5 kali seminggu"
  - Active: "Olahraga intens setiap hari"

- Button "Simpan Biodata" — W 379 Fill × H 52, radius 20, fill `#376B00`

---

## 3. Fitur Utama

### 3.1 Dashboard
**Frame:** 409 × 839 Hug, background `#FCF9F8`
- Top bar: "MyDiet" (hijau) + icon notifikasi + avatar bulat (border hijau tipis)

**Card "Progress Mingguan"** — W 361 Fill × H 128 Hug, radius 20, fill `#EAF7DC`, drop shadow, padding 16
- "Progress Mingguan" (bold) + "6/7 hari tercapai target" (`#414939`)
- Badge pill "Bagus Sekali!" — fill `#376B00`, teks putih
- Circular progress ring 96×96 warna `#376B00`, teks "85%" di tengah

**2 Card ringkasan kalori** (masing-masing W 172.5 Fill × H 122 Hug, fill putih, stroke `#EDEDED`, radius 20)
- Icon circle 40×40 radius full
  - Kalori Masuk: icon bg `#8BD44D` + arrow down, angka hijau `#376B00` bold
  - Kalori Keluar: icon bg `#FFDAD6` + arrow up merah, angka merah `#BA1A1A` bold
- Label abu `#8A8A8A`

**Card "Log Hari Ini"** — W 361 Fill × H 179 Hug, fill putih, radius 20
- Header + link "Lihat Semua" (hijau, kanan)
- List item (divider antar item): icon circle abu (`#E5E2E1`), judul bold, subtext waktu abu, kalori kanan (`#7A3000`/`#9F4203` untuk masuk, `#2D5900` untuk keluar)

**Card "Prediksi Mingguan"** — W 361 Fill × H 122 Hug, fill `#F0EDED`, stroke `#EDEDED`, radius 20
- Icon circle fill `#8BD44D` (bulb) + judul bold + deskripsi `#414939`

**Bottom Nav:** W 361 × H 72, radius 50, item aktif "Dashboard"

### 3.2 Log
**Frame:** 456 × 1166 Hug (top bar sama dengan Dashboard)

**Card "Target Kalori Harian"** — W 408 Fill × H 150 Hug, fill `#EAF7DC`, stroke `#EDEDED`, radius 20
- "Target Kalori Harian" (`#414939`) + "1,450 / 2,100 kcal" (hijau besar bold) + "69% Terpenuhi" (`#246D00`, kanan)
- Progress bar: W 374 Fill × H 12, radius 10, track putih stroke `#EDEDED`, fill `#376B00`
- Row Karbo/Protein/Lemak (3 kolom): label abu, angka bold hitam

**Card "Tambah Log Baru"** — W 408 Fill × H 418 Hug, fill putih, stroke `#EDEDED`, radius 20, drop shadow, padding 16
- Toggle pill "Sajian"/"Olahraga" — aktif fill `#376B00` teks putih, non-aktif abu transparan
- Field "Nama Item" (placeholder "Misal: Nasi Putih atau Lari Pagi")
- Row "Jumlah" (input angka) + "Satuan" (dropdown, mis. "gram")
- Field "Estimasi Kalori (kcal)" dengan icon ⚡ kanan (indikasi AI auto-estimate)
- Button "+ Tambah Log" — full width, fill `#376B00`, radius 20

**Card "Log Hari Ini"** — W 408 Fill × H 318 Hug, fill putih, radius 20
- Header + "Lihat Semua" (hijau)
- List item: icon circle radius full (bg beda per kategori: `#F0EDED` untuk makan, `#EAF7DC` untuk olahraga), judul bold, subtext abu, kalori kanan (`#9F4203` positif / `#246D00` negatif) + jam kecil abu

Bottom Nav sama, item aktif "Log".

### 3.3 Grafik
**Frame:** 440 × 988 Hug (top bar sama)
- Heading "Grafik Progres" (bold)

**Row 3 card: Berat Awal / Sekarang / Selisih** (padding 24, gap 16)
- Berat Awal: label abu + angka hitam bold ("85 kg")
- Sekarang (highlight, editable): fill `#EAF7DC`, stroke `#376B00`, label "Sekarang ✏️" hijau, input angka + "kg", button "Simpan" (fill `#376B00`, pill)
- Selisih: label abu + angka merah/oranye `#E85B4E` ("-7 kg")

**Card "Tren Berat Badan"** — W 408 Fill × H 326 Hug, fill putih, stroke `#EDEDED`, radius 20, padding 24
- Header + "30 Hari Terakhir" (abu, kanan)
- Line chart: garis solid hijau `#376B00` (Aktual), garis putus-putus hijau muda (Prediksi)
- Label sumbu X: "Minggu 1-4"; Legend bawah: "● Aktual" / "● Prediksi"

**Card "Keseimbangan Kalori"** — W 408 Fill × H 218 Hug, fill putih, stroke `#EDEDED`, radius 20, padding 24
- Header + legend "In" (`#FFAE87`) / "Out" (`#376B00`) kanan atas
- Stacked bar chart vertikal, 7 bar (S,S,R,K,J,S,M): atas hijau `#376B00` (Out), bawah oranye `#FFAE87` (In)
- Label hari di bawah tiap bar

Bottom Nav sama, item aktif "Grafik".

### 3.4 Prediksi
**Frame:** 390 × 1373 Hug (top bar sama)

**Card "Proyeksi Berat Badan Anda"** — W 342 Fill × H 194 Hug, fill putih, stroke `#EDEDED`, radius 20, drop shadow, padding 32(v)
- Label kecil center abu: "PROYEKSI BERAT BADAN ANDA"
- Angka besar hijau bold: "68.5 kg"
- Deskripsi center: "Diprediksi tercapai pada **12 Desember 2023** berdasarkan pola makan saat ini." (tanggal bold hijau)

**Card "Tren Masa Depan"** — W 342 Fill × H 306 Hug, fill putih, stroke `#EDEDED`, radius 20, drop shadow, padding 16
- Header "Tren Masa Depan" (bold) + badge pill abu "3 Bulan ke Depan" (kanan)
- Line chart tren menurun, garis solid hijau `#376B00`
- Label sumbu X: "Okt, Nov, Des, Jan"

**Card "Insight AI MyDiet"** — W 342 Fill × H 287 Hug, fill `#EAF7DC`, stroke `#8BD44D`, radius 20, padding 16/16/16/32
- Header "✨ Insight AI MyDiet" — hijau bold
- Body paragraf — `#1B1B1C`: narasi insight personal berdasarkan pola makan (contoh: konsistensi, saran aktivitas, estimasi percepatan target)

**Section "Anjuran Berdasarkan Prediksi"** — card list, W 342 Fill × H 196 Hug
- Heading bold
- List item (dengan chevron kanan `>`): icon circle kiri (bg beda warna per kategori) + judul bold + deskripsi abu
  - "Kurangi Natrium" — icon bg `#8BD44D` (hijau), "Cegah retensi air berlebih"
  - "Fokus Kardio Ringan" — icon bg oranye (`#FFAE87`/`#873600` varian), "Optimalkan pembakaran lemak pagi hari"

**Disclaimer text** — abu kecil, center: "*Prediksi ini dihasilkan oleh kecerdasan buatan berdasarkan data historis Anda. Hasil dapat bervariasi. Harap selalu berkonsultasi dengan dokter atau ahli gizi profesional sebelum melakukan perubahan diet yang signifikan."

Bottom Nav sama, item aktif "Prediksi".

---

## 4. Catatan Implementasi Umum
- Semua frame mobile menggunakan lebar dasar ±390–456px (variasi minor antar screen — sebaiknya distandardisasi ke satu container width, mis. 390px atau max-w-md, saat coding).
- Warna hijau `#376B00` adalah primary color yang mendominasi seluruh UI (button, active state, brand).
- Bottom navigation konsisten di 4 fitur utama (Dashboard, Log, Grafik, Prediksi) — build sebagai satu komponen shared dengan prop `activeTab`.
- Card pattern (fill putih/`#EAF7DC`/`#F0EDED`, stroke `#EDEDED`, radius 20) berulang di hampir semua section — cocok dijadikan komponen `<Card>` reusable dengan varian warna.
- Font Poppins perlu di-load global (Google Fonts atau self-hosted) sejak awal karena dipakai di seluruh layar tanpa pengecualian.
