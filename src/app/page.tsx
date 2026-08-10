import { redirect } from "next/navigation";

export default function Home() {
  // Arahkan otomatis pengguna dari halaman utama (root) ke dashboard
  // Jika belum login, proxy.ts (middleware) akan mengarahkannya ke /login
  redirect("/dashboard");
}
