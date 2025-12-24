'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bot, LayoutGrid, MonitorPlay, BookOpen } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/gallery', label: '갤러리', icon: <LayoutGrid className="w-5 h-5" /> },
    { href: '/youtube', label: '유튜브', icon: <MonitorPlay className="w-5 h-5" /> },
    { href: '/blog', label: '블로그', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              AI Studio Gallery
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm
                    ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-lg flex items-center">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
