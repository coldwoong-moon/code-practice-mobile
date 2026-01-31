'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, BarChart3 } from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: '홈',
    icon: Home,
  },
  {
    href: '/problems',
    label: '문제',
    icon: BookOpen,
  },
  {
    href: '/progress',
    label: '진행현황',
    icon: BarChart3,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-2 border-white shadow-2xl">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl
                  transition-all duration-300 min-w-[72px]
                  ${active
                    ? 'text-primary'
                    : 'text-muted hover:text-foreground'
                  }
                `}
              >
                {/* Active indicator background */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl" />
                )}

                {/* Icon with animated background */}
                <div className="relative">
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-md opacity-60 scale-110" />
                  )}
                  <div
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                      ${active
                        ? 'bg-gradient-to-br from-primary to-secondary scale-110'
                        : 'bg-transparent'
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all ${active ? 'text-white' : ''}`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`
                    relative text-xs font-bold transition-all
                    ${active ? 'scale-105' : ''}
                  `}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -top-1 w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe area for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
