/*
  Warnings:

  - You are about to drop the column `activityName` on the `ExerciseEntry` table. All the data in the column will be lost.
  - You are about to drop the column `foodName` on the `FoodEntry` table. All the data in the column will be lost.
  - The `mealType` column on the `FoodEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `calories` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the column `met` on the `MetActivity` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `MetActivity` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `ExerciseEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountGrams` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodItemId` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caloriesPer100g` to the `FoodItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metValue` to the `MetActivity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "ExerciseEntry" DROP COLUMN "activityName",
ADD COLUMN     "activityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FoodEntry" DROP COLUMN "foodName",
ADD COLUMN     "amountGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "foodItemId" TEXT NOT NULL,
DROP COLUMN "mealType",
ADD COLUMN     "mealType" "MealType" NOT NULL DEFAULT 'SNACK';

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "calories",
DROP COLUMN "unit",
ADD COLUMN     "caloriesPer100g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carbsPer100g" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "fatPer100g" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "proteinPer100g" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "servingSize" DOUBLE PRECISION,
ADD COLUMN     "servingUnit" TEXT;

-- AlterTable
ALTER TABLE "MetActivity" DROP COLUMN "met",
DROP COLUMN "unit",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "metValue" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseEntry" ADD CONSTRAINT "ExerciseEntry_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "MetActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
