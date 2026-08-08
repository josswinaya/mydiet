import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed data for FoodItem — common Indonesian foods with nutrition per 100g.
 */
const foodItems = [
  // Karbohidrat
  { name: "Nasi Putih", caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28.2, fatPer100g: 0.3, servingSize: 150, servingUnit: "1 centong" },
  { name: "Nasi Merah", caloriesPer100g: 110, proteinPer100g: 2.6, carbsPer100g: 23.0, fatPer100g: 0.9, servingSize: 150, servingUnit: "1 centong" },
  { name: "Nasi Goreng", caloriesPer100g: 145, proteinPer100g: 4.0, carbsPer100g: 20.0, fatPer100g: 5.5, servingSize: 200, servingUnit: "1 porsi" },
  { name: "Roti Tawar Putih", caloriesPer100g: 265, proteinPer100g: 9.0, carbsPer100g: 49.0, fatPer100g: 3.2, servingSize: 30, servingUnit: "1 lembar" },
  { name: "Mie Goreng", caloriesPer100g: 175, proteinPer100g: 4.5, carbsPer100g: 25.0, fatPer100g: 6.0, servingSize: 200, servingUnit: "1 porsi" },
  { name: "Mie Rebus", caloriesPer100g: 105, proteinPer100g: 3.0, carbsPer100g: 18.0, fatPer100g: 2.5, servingSize: 200, servingUnit: "1 porsi" },
  { name: "Kentang Rebus", caloriesPer100g: 77, proteinPer100g: 2.0, carbsPer100g: 17.0, fatPer100g: 0.1, servingSize: 100, servingUnit: "1 buah sedang" },
  { name: "Oatmeal", caloriesPer100g: 371, proteinPer100g: 13.0, carbsPer100g: 67.0, fatPer100g: 7.0, servingSize: 40, servingUnit: "1 porsi kering" },
  { name: "Roti Gandum", caloriesPer100g: 247, proteinPer100g: 9.7, carbsPer100g: 44.0, fatPer100g: 3.5, servingSize: 30, servingUnit: "1 lembar" },
  { name: "Singkong Rebus", caloriesPer100g: 154, proteinPer100g: 1.4, carbsPer100g: 38.0, fatPer100g: 0.2, servingSize: 100, servingUnit: "100g" },

  // Protein Hewani
  { name: "Ayam Goreng", caloriesPer100g: 246, proteinPer100g: 27.0, carbsPer100g: 0.0, fatPer100g: 14.0, servingSize: 100, servingUnit: "1 potong" },
  { name: "Ayam Bakar", caloriesPer100g: 187, proteinPer100g: 28.0, carbsPer100g: 0.0, fatPer100g: 8.0, servingSize: 100, servingUnit: "1 potong" },
  { name: "Dada Ayam Rebus", caloriesPer100g: 165, proteinPer100g: 31.0, carbsPer100g: 0.0, fatPer100g: 3.6, servingSize: 100, servingUnit: "100g" },
  { name: "Telur Goreng", caloriesPer100g: 196, proteinPer100g: 13.6, carbsPer100g: 0.4, fatPer100g: 15.3, servingSize: 50, servingUnit: "1 butir" },
  { name: "Telur Rebus", caloriesPer100g: 155, proteinPer100g: 12.6, carbsPer100g: 1.1, fatPer100g: 10.6, servingSize: 50, servingUnit: "1 butir" },
  { name: "Ikan Goreng", caloriesPer100g: 196, proteinPer100g: 22.0, carbsPer100g: 0.0, fatPer100g: 12.0, servingSize: 100, servingUnit: "1 porsi" },
  { name: "Ikan Bakar", caloriesPer100g: 136, proteinPer100g: 24.0, carbsPer100g: 0.0, fatPer100g: 4.5, servingSize: 100, servingUnit: "1 porsi" },
  { name: "Ikan Tuna (kaleng)", caloriesPer100g: 132, proteinPer100g: 29.0, carbsPer100g: 0.0, fatPer100g: 1.0, servingSize: 100, servingUnit: "100g" },
  { name: "Daging Sapi", caloriesPer100g: 250, proteinPer100g: 26.0, carbsPer100g: 0.0, fatPer100g: 15.0, servingSize: 100, servingUnit: "100g" },
  { name: "Bakso", caloriesPer100g: 148, proteinPer100g: 9.5, carbsPer100g: 7.0, fatPer100g: 9.5, servingSize: 100, servingUnit: "5 biji" },

  // Protein Nabati
  { name: "Tempe Goreng", caloriesPer100g: 200, proteinPer100g: 18.0, carbsPer100g: 6.0, fatPer100g: 11.0, servingSize: 75, servingUnit: "2 potong" },
  { name: "Tahu Goreng", caloriesPer100g: 152, proteinPer100g: 12.0, carbsPer100g: 2.0, fatPer100g: 11.0, servingSize: 50, servingUnit: "1 potong" },
  { name: "Tempe Bacem", caloriesPer100g: 195, proteinPer100g: 17.0, carbsPer100g: 9.0, fatPer100g: 10.0, servingSize: 75, servingUnit: "2 potong" },

  // Sayuran
  { name: "Bayam Rebus", caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, servingSize: 100, servingUnit: "1 porsi" },
  { name: "Tumis Kangkung", caloriesPer100g: 55, proteinPer100g: 2.0, carbsPer100g: 5.0, fatPer100g: 3.0, servingSize: 100, servingUnit: "1 porsi" },
  { name: "Brokoli Rebus", caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4, servingSize: 100, servingUnit: "100g" },
  { name: "Wortel", caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10.0, fatPer100g: 0.2, servingSize: 100, servingUnit: "100g" },
  { name: "Kol Goreng", caloriesPer100g: 70, proteinPer100g: 1.5, carbsPer100g: 5.0, fatPer100g: 5.0, servingSize: 100, servingUnit: "1 porsi" },

  // Buah
  { name: "Pisang", caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23.0, fatPer100g: 0.3, servingSize: 120, servingUnit: "1 buah" },
  { name: "Apel", caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14.0, fatPer100g: 0.2, servingSize: 150, servingUnit: "1 buah" },
  { name: "Jeruk", caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12.0, fatPer100g: 0.1, servingSize: 130, servingUnit: "1 buah" },
  { name: "Mangga", caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15.0, fatPer100g: 0.4, servingSize: 200, servingUnit: "1 buah sedang" },
  { name: "Pepaya", caloriesPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 11.0, fatPer100g: 0.3, servingSize: 200, servingUnit: "1 porsi" },
  { name: "Semangka", caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 7.6, fatPer100g: 0.2, servingSize: 300, servingUnit: "1 potong besar" },

  // Minuman
  { name: "Susu Sapi Full Fat", caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, servingSize: 200, servingUnit: "1 gelas" },
  { name: "Susu Kedelai", caloriesPer100g: 54, proteinPer100g: 3.3, carbsPer100g: 6.3, fatPer100g: 1.8, servingSize: 200, servingUnit: "1 gelas" },
  { name: "Jus Jeruk", caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10.4, fatPer100g: 0.2, servingSize: 250, servingUnit: "1 gelas" },
  { name: "Teh Manis", caloriesPer100g: 30, proteinPer100g: 0.0, carbsPer100g: 8.0, fatPer100g: 0.0, servingSize: 250, servingUnit: "1 gelas" },
  { name: "Kopi Hitam (tanpa gula)", caloriesPer100g: 2, proteinPer100g: 0.3, carbsPer100g: 0.0, fatPer100g: 0.0, servingSize: 250, servingUnit: "1 cangkir" },

  // Jajanan
  { name: "Gorengan (pisang goreng)", caloriesPer100g: 219, proteinPer100g: 2.0, carbsPer100g: 30.0, fatPer100g: 10.0, servingSize: 80, servingUnit: "2 buah" },
  { name: "Martabak Manis", caloriesPer100g: 310, proteinPer100g: 6.0, carbsPer100g: 45.0, fatPer100g: 12.0, servingSize: 150, servingUnit: "1 porsi" },
  { name: "Indomie Goreng", caloriesPer100g: 456, proteinPer100g: 10.0, carbsPer100g: 65.0, fatPer100g: 17.0, servingSize: 85, servingUnit: "1 bungkus" },
  { name: "Kerupuk", caloriesPer100g: 500, proteinPer100g: 5.0, carbsPer100g: 65.0, fatPer100g: 25.0, servingSize: 20, servingUnit: "5 lembar" },
  { name: "Gado-gado", caloriesPer100g: 110, proteinPer100g: 5.0, carbsPer100g: 10.0, fatPer100g: 6.0, servingSize: 300, servingUnit: "1 porsi" },
  { name: "Soto Ayam", caloriesPer100g: 55, proteinPer100g: 6.0, carbsPer100g: 5.0, fatPer100g: 2.0, servingSize: 350, servingUnit: "1 mangkuk" },
];

/**
 * Seed data for MetActivity — standard MET values for common activities.
 * Formula: kalori = MET × berat(kg) × durasi(jam)
 */
const metActivities = [
  // Kardio
  { name: "Lari (7 km/jam)", metValue: 7.0, category: "Kardio" },
  { name: "Lari Cepat (10 km/jam)", metValue: 10.0, category: "Kardio" },
  { name: "Lari Sprint", metValue: 14.5, category: "Kardio" },
  { name: "Jalan Cepat", metValue: 4.3, category: "Kardio" },
  { name: "Jalan Santai", metValue: 3.0, category: "Kardio" },
  { name: "Bersepeda (sedang)", metValue: 8.0, category: "Kardio" },
  { name: "Bersepeda Santai", metValue: 4.0, category: "Kardio" },
  { name: "Renang (sedang)", metValue: 7.0, category: "Kardio" },
  { name: "Renang Cepat", metValue: 9.8, category: "Kardio" },
  { name: "Lompat Tali", metValue: 10.0, category: "Kardio" },
  { name: "Zumba / Senam Aerobik", metValue: 6.0, category: "Kardio" },

  // Olahraga Tim
  { name: "Futsal", metValue: 7.0, category: "Olahraga Tim" },
  { name: "Badminton", metValue: 5.5, category: "Olahraga Tim" },
  { name: "Tenis", metValue: 7.0, category: "Olahraga Tim" },
  { name: "Sepak Bola", metValue: 7.0, category: "Olahraga Tim" },
  { name: "Bola Voli", metValue: 4.0, category: "Olahraga Tim" },
  { name: "Basket", metValue: 8.0, category: "Olahraga Tim" },

  // Gym / Angkat Beban
  { name: "Angkat Beban (ringan)", metValue: 3.5, category: "Gym" },
  { name: "Angkat Beban (sedang)", metValue: 5.0, category: "Gym" },
  { name: "Angkat Beban (berat)", metValue: 6.0, category: "Gym" },
  { name: "Push-up / Sit-up", metValue: 4.0, category: "Gym" },
  { name: "Yoga", metValue: 3.0, category: "Gym" },
  { name: "Pilates", metValue: 3.5, category: "Gym" },
  { name: "HIIT", metValue: 8.0, category: "Gym" },
  { name: "CrossFit", metValue: 9.0, category: "Gym" },

  // Aktivitas Harian
  { name: "Naik Tangga", metValue: 4.0, category: "Aktivitas Harian" },
  { name: "Berkebun", metValue: 3.5, category: "Aktivitas Harian" },
  { name: "Membersihkan Rumah", metValue: 3.0, category: "Aktivitas Harian" },
  { name: "Mencuci Motor/Mobil", metValue: 3.5, category: "Aktivitas Harian" },
  { name: "Bermain dengan Anak", metValue: 4.0, category: "Aktivitas Harian" },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in correct order due to foreign keys)
  await prisma.foodEntry.deleteMany();
  await prisma.exerciseEntry.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.metActivity.deleteMany();

  // Seed FoodItems
  console.log("📦 Seeding FoodItems...");
  await prisma.foodItem.createMany({ data: foodItems });
  console.log(`✅ ${foodItems.length} FoodItems seeded`);

  // Seed MetActivities
  console.log("🏃 Seeding MetActivities...");
  await prisma.metActivity.createMany({ data: metActivities });
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
