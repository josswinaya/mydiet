/**
 * TypeScript types & interfaces for MyDiet.
 * Defines data contracts for API responses, form inputs, and business logic.
 */

import type { Gender, ActivityLevel } from "@prisma/client";

// ─── Re-export Prisma enums ───────────────────────────────────────────────────
export type { Gender, ActivityLevel };

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;
  targetWeightKg: number | null;
}

/** Payload saat update profil */
export interface UpdateProfilePayload {
  name?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  gender?: Gender;
  activityLevel?: ActivityLevel;
  targetWeightKg?: number;
}

// ─── Food Entry ──────────────────────────────────────────────────────────────

export type MealType = "sarapan" | "makan_siang" | "makan_malam" | "camilan";

export interface FoodEntryInput {
  foodName: string;
  calories: number;
  mealType: MealType;
  loggedAt?: string; // ISO date string, default = today
}

export interface FoodEntryItem {
  id: string;
  foodName: string;
  calories: number;
  mealType: MealType;
  loggedAt: string;
}

// ─── Exercise Entry ──────────────────────────────────────────────────────────

export interface ExerciseEntryInput {
  activityName: string;
  durationMinutes: number;
  caloriesBurned: number;
  loggedAt?: string;
}

export interface ExerciseEntryItem {
  id: string;
  activityName: string;
  durationMinutes: number;
  caloriesBurned: number;
  loggedAt: string;
}

// ─── Weight Log ──────────────────────────────────────────────────────────────

export interface WeightLogInput {
  weightKg: number;
  loggedAt?: string;
}

export interface WeightLogItem {
  id: string;
  weightKg: number;
  loggedAt: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardSummary {
  date: string;
  tdee: number;
  totalCaloriesIn: number;
  totalCaloriesOut: number;
  netBalance: number;       // kalori masuk - (TDEE + kalori olahraga)
  remaining: number;        // TDEE - kalori masuk + kalori olahraga
  foodEntries: FoodEntryItem[];
  exerciseEntries: ExerciseEntryItem[];
}

// ─── Prediction ──────────────────────────────────────────────────────────────

export interface PredictionResult {
  id: string;
  avgDailyBalance: number;
  projectedWeeks: number;
  projectedDeltaKg: number;
  aiInsight: string;
  createdAt: string;
}

// ─── Food Item (seed data) ───────────────────────────────────────────────────

export interface FoodItemSeed {
  id: string;
  name: string;
  calories: number;
  unit: string;
}

// ─── MET Activity (seed data) ────────────────────────────────────────────────

export interface MetActivityItem {
  id: string;
  name: string;
  met: number;
  unit: string;
}

// ─── API Response wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── BMR / TDEE Calculation ──────────────────────────────────────────────────

export interface CalorieCalcInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}

export interface CalorieCalcResult {
  bmr: number;
  tdee: number;
}
