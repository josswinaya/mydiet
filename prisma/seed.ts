import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed data for FoodItem — common Indonesian foods with standard portion calories.
 * Calories are approximate values per stated unit.
 */
const foodItems = [
  // Karbohidrat
  { name: "Nasi Putih", calories: 204, unit: "1 centong (100g)" },
  { name: "Nasi Merah", calories: 178, unit: "1 centong (100g)" },
  { name: "Nasi Goreng", calories: 260, unit: "1 porsi (200g)" },
  { name: "Roti Tawar", calories: 79, unit: "1 lembar (30g)" },
  { name: "Mie Goreng", calories: 337, unit: "1 porsi (200g)" },
  { name: "Mie Rebus", calories: 211, unit: "1 porsi (200g)" },
  { name: "Kentang Rebus", calories: 86, unit: "1 buah sedang (100g)" },
  { name: "Singkong Rebus", calories: 154, unit: "100g" },
  { name: "Oatmeal", calories: 68, unit: "100g (kering)" },
  { name: "Roti Gandum", calories: 72, unit: "1 lembar (30g)" },

  // Protein Hewani
  { name: "Ayam Goreng", calories: 246, unit: "1 potong (100g)" },
  { name: "Ayam Bakar", calories: 187, unit: "1 potong (100g)" },
  { name: "Dada Ayam Rebus", calories: 165, unit: "100g" },
  { name: "Telur Goreng", calories: 92, unit: "1 butir" },
  { name: "Telur Rebus", calories: 77, unit: "1 butir" },
  { name: "Ikan Goreng", calories: 196, unit: "1 porsi (100g)" },
  { name: "Ikan Bakar", calories: 136, unit: "1 porsi (100g)" },
  { name: "Ikan Tuna", calories: 132, unit: "100g" },
  { name: "Daging Sapi", calories: 250, unit: "100g" },
  { name: "Bakso", calories: 148, unit: "5 biji (100g)" },
  { name: "Tempe Goreng", calories: 200, unit: "2 potong (100g)" },
  { name: "Tahu Goreng", calories: 76, unit: "1 potong (50g)" },

  // Sayuran
  { name: "Sayur Bayam", calories: 23, unit: "1 porsi (100g)" },
  { name: "Tumis Kangkung", calories: 55, unit: "1 porsi (100g)" },
  { name: "Brokoli Rebus", calories: 35, unit: "100g" },
  { name: "Wortel", calories: 41, unit: "100g" },
  { name: "Toge/Tauge", calories: 30, unit: "100g" },
  { name: "Timun", calories: 16, unit: "100g" },
  { name: "Salad Sayur", calories: 15, unit: "100g (tanpa dressing)" },

  // Buah
  { name: "Pisang", calories: 89, unit: "1 buah sedang (100g)" },
  { name: "Apel", calories: 52, unit: "1 buah sedang (150g)" },
  { name: "Jeruk", calories: 62, unit: "1 buah (130g)" },
  { name: "Semangka", calories: 30, unit: "1 potong (100g)" },
  { name: "Pepaya", calories: 43, unit: "1 potong (100g)" },
  { name: "Mangga", calories: 60, unit: "100g" },
  { name: "Alpukat", calories: 160, unit: "½ buah (100g)" },

  // Minuman & Lainnya
  { name: "Susu Sapi Full Cream", calories: 61, unit: "100ml" },
  { name: "Susu Kedelai", calories: 54, unit: "100ml" },
  { name: "Jus Jeruk", calories: 45, unit: "200ml" },
  { name: "Air Kelapa", calories: 19, unit: "100ml" },
  { name: "Kopi Hitam (tanpa gula)", calories: 2, unit: "200ml" },
  { name: "Teh Manis", calories: 60, unit: "200ml" },

  // Camilan
  { name: "Kerupuk", calories: 103, unit: "5 lembar (30g)" },
  { name: "Biskuit", calories: 130, unit: "4 keping (30g)" },
  { name: "Kacang Goreng", calories: 180, unit: "30g" },
  { name: "Gorengan (tempe mendoan)", calories: 150, unit: "1 buah" },
  { name: "Martabak Manis", calories: 280, unit: "1 potong" },

  // Makanan populer
  { name: "Soto Ayam", calories: 251, unit: "1 mangkuk" },
  { name: "Gado-Gado", calories: 260, unit: "1 porsi" },
  { name: "Rendang", calories: 468, unit: "1 porsi (100g)" },
  { name: "Opor Ayam", calories: 305, unit: "1 porsi" },
  { name: "Pecel Lele", calories: 430, unit: "1 porsi" },
  { name: "Mie Ayam", calories: 360, unit: "1 mangkuk" },
];

/**
 * MET (Metabolic Equivalent of Task) table for common exercises.
 * Stored as reference data in seed — used for calorie burn calculation:
 * calories = MET × weight(kg) × duration(hours)
 */
const metActivities = [
  // Cardio ringan
  { name: "Jalan Santai", met: 2.5, unit: "menit" },
  { name: "Jalan Cepat", met: 3.5, unit: "menit" },
  { name: "Jogging Ringan", met: 6.0, unit: "menit" },
  { name: "Lari (8 km/jam)", met: 8.0, unit: "menit" },
  { name: "Lari (10 km/jam)", met: 10.0, unit: "menit" },
  { name: "Lari (12 km/jam)", met: 11.5, unit: "menit" },
  { name: "Bersepeda Santai", met: 4.0, unit: "menit" },
  { name: "Bersepeda Sedang", met: 6.8, unit: "menit" },
  { name: "Bersepeda Cepat", met: 10.0, unit: "menit" },
  { name: "Berenang Santai", met: 5.8, unit: "menit" },
  { name: "Berenang Kencang", met: 9.8, unit: "menit" },

  // Strength & HIIT
  { name: "Angkat Beban (ringan)", met: 3.0, unit: "menit" },
  { name: "Angkat Beban (sedang)", met: 5.0, unit: "menit" },
  { name: "Angkat Beban (berat)", met: 6.0, unit: "menit" },
  { name: "Push Up", met: 3.8, unit: "menit" },
  { name: "Sit Up / Core", met: 3.8, unit: "menit" },
  { name: "HIIT", met: 8.0, unit: "menit" },
  { name: "Zumba / Aerobik", met: 6.5, unit: "menit" },
  { name: "Yoga", met: 2.5, unit: "menit" },
  { name: "Pilates", met: 3.0, unit: "menit" },

  // Olahraga
  { name: "Basket", met: 6.5, unit: "menit" },
  { name: "Futsal", met: 7.0, unit: "menit" },
  { name: "Badminton", met: 5.5, unit: "menit" },
  { name: "Tenis", met: 7.0, unit: "menit" },
  { name: "Sepak Bola", met: 7.0, unit: "menit" },
  { name: "Voli", met: 4.0, unit: "menit" },
  { name: "Senam", met: 4.5, unit: "menit" },

  // Aktivitas sehari-hari
  { name: "Naik Tangga", met: 4.0, unit: "menit" },
  { name: "Berkebun", met: 3.5, unit: "menit" },
  { name: "Membersihkan Rumah", met: 3.0, unit: "menit" },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Upsert FoodItems
  console.log("📦 Seeding FoodItems...");
  for (const item of foodItems) {
    await prisma.foodItem.upsert({
      where: { name: item.name },
      update: { calories: item.calories, unit: item.unit },
      create: item,
    });
  }
  console.log(`✅ ${foodItems.length} FoodItems seeded`);

  // Upsert MET Activities (stored in a separate table)
  console.log("🏃 Seeding MetActivity...");
  for (const activity of metActivities) {
    await prisma.metActivity.upsert({
      where: { name: activity.name },
      update: { met: activity.met, unit: activity.unit },
      create: activity,
    });
  }
  console.log(`✅ ${metActivities.length} MetActivities seeded`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
