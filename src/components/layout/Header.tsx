'use client';

import Link from 'next/link';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export function Header({ title = '코테원격공부', showLogo = true }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b-2 border-white sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            {showLogo && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-lg opacity-60" />
                <div className="relative bg-gradient-to-br from-primary to-secondary p-2.5 rounded-2xl shadow-lg">
                  <Code2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-muted font-medium">언제 어디서나, 쉽게</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
