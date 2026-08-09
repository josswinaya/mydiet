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
 * Highlights the active route using usePathname.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border
        safe-area-pb"
      aria-label="Navigasi utama"
    >
      <div className="max-w-md mx-auto flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.href.replace("/", "")}`}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3
                transition-colors duration-150
                ${isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator dot */}
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-none transition-all ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
