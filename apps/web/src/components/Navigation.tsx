'use client';

import Link from 'next/link';
import { useState } from 'react';

const APP_NAME = 'ManlyDude';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#tiers', label: 'Pricing' },
  { href: '/support', label: 'Support' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          MANLY<span className="text-blue-400">DUDE</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#tiers"
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-800 bg-gray-900 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-gray-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#tiers"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-blue-600 px-6 py-3 text-center font-bold text-white transition-all hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
