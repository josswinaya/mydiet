import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import type { UserProfile } from "@/types";

export const metadata: Metadata = {
  title: "MyDiet — Profil Saya",
  description: "Pengaturan profil dan target kalori.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  const userProfile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    gender: user.gender,
    activityLevel: user.activityLevel,
    targetWeightKg: user.targetWeightKg,
  };

  return <ProfilePageClient user={userProfile} />;
}
