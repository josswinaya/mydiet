import type { CalorieCalcInput, CalorieCalcResult } from "@/types";
import type { ActivityLevel } from "@prisma/client";

/**
 * Activity level multipliers for TDEE calculation.
 * Based on Harris-Benedict / Mifflin-St Jeor standard factors.
 */
const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

/**
 * Calculates BMR using the Mifflin-St Jeor equation.
 *
 * Male:   BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 * Female: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 *
 * @param input - User biometric data
 * @returns Calculated BMR in kcal/day
 */
export function calculateBMR(input: CalorieCalcInput): number {
  const { weightKg, heightCm, age, gender } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "MALE" ? base + 5 : base - 161;
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure).
 * TDEE = BMR × activity multiplier
 *
 * @param input - User biometric data including activity level
 * @returns Object containing both BMR and TDEE in kcal/day
 */
export function calculateTDEE(input: CalorieCalcInput): CalorieCalcResult {
  const bmr = Math.round(calculateBMR(input));
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIER[input.activityLevel]);
  return { bmr, tdee };
}

/**
 * Calculates calories burned from exercise using MET formula.
 * Formula: calories = MET × weight(kg) × duration(hours)
 *
 * @param met - MET value of the activity
 * @param weightKg - User weight in kilograms
 * @param durationMinutes - Exercise duration in minutes
 * @returns Estimated calories burned (rounded)
 */
export function calculateCaloriesBurned(
  met: number,
  weightKg: number,
  durationMinutes: number
): number {
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours);
}

/**
 * Projects weight change based on average daily calorie balance.
 *
 * Formula: Δkg = (avgDailyBalance × days) / 7700
 * Where 7700 kcal ≈ 1 kg of body fat (commonly used approximation).
 *
 * Negative balance (deficit) → weight loss (negative Δkg)
 * Positive balance (surplus) → weight gain (positive Δkg)
 *
 * @param avgDailyBalance - Average daily surplus (+) or deficit (-) in kcal
 * @param weeks - Number of weeks to project
 * @returns Projected weight change in kg (negative = loss)
 */
export function projectWeightChange(
  avgDailyBalance: number,
  weeks: number
): number {
  const days = weeks * 7;
  return parseFloat(((avgDailyBalance * days) / 7700).toFixed(2));
}
