"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, TrendingUp, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Beranda",
    icon: LayoutDashboard,
  },
  {
    href: "/log",
    label: "Log",
    icon: BookOpen,
  },
  {
    href: "/chart",
    label: "Grafik",
    icon: TrendingUp,
  },
  {
    href: "/predict",
    label: "Prediksi",
    icon: Sparkles,
  },
] as const;

/**
 * Bottom navigation bar for the main app.
 * Highlights the active route using a green pill (icon + label inside).
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border
        safe-area-pb shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      aria-label="Navigasi utama"
    >
      <div className="max-w-md mx-auto flex items-center h-[64px] px-3 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.href.replace("/", "")}`}
                aria-current="page"
                className="flex items-center justify-center gap-2 px-4 py-2.5
                  bg-primary text-white rounded-full font-semibold text-sm
                  flex-shrink-0 transition-all duration-200"
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="text-[13px]">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.href.replace("/", "")}`}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2
                text-text-muted hover:text-text-secondary transition-colors duration-150"
            >
              <Icon size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
