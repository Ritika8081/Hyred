'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getZone } from '@/lib/zone';
import Logo from '@/components/ui/logo';
import { usePortfolioData } from '@/hooks/usePortfolioData';

// Hyred SaaS navigation (marketing / product)
const HYRED_NAV = [
  { name: 'AI Tools', href: '/tools' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Compare', href: '/compare' },
  { name: 'Reviews', href: '/reviews' },
];

// Portfolio (user's site) navigation
const PORTFOLIO_NAV = [
  { name: 'Home', href: '/preview' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Resume', href: '/resume' },
  { name: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const zone = getZone(pathname);
  const { data } = usePortfolioData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide Nav completely on /build and /admin to give the builder maximum space
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/build')) {
    return <BuilderTopBar />;
  }

  const nav = zone === "portfolio" ? PORTFOLIO_NAV : HYRED_NAV;
  const isPortfolio = zone === "portfolio";

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-gray-200/60 shadow-sm'
          : 'bg-white/40 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — Hyred brand on Hyred zone, user's name on portfolio zone */}
          <Link
            href={isPortfolio ? "/preview" : "/"}
            className="flex items-center"
            aria-label="Home"
          >
            {isPortfolio ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${data.personalInfo.brand?.gradientFrom || "#7c3aed"}, ${data.personalInfo.brand?.gradientTo || "#ec4899"})`,
                  }}
                >
                  {data.personalInfo.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <span className="font-display text-lg font-semibold text-gray-900 tracking-tight">
                  {data.personalInfo.name?.split(" ")[0] || "Portfolio"}
                </span>
              </div>
            ) : (
              <Logo size={28} />
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="w-px h-5 bg-gray-200 mx-2" />

            {isPortfolio ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 transition"
              >
                <ExternalLink size={11} />
                Built with Hyred
              </Link>
            ) : (
              <>
                <Link
                  href="/preview"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 transition"
                >
                  Live example
                </Link>
                <Link
                  href="/build"
                  className="ml-2 inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-md text-sm font-semibold text-white bg-gradient-to-b from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(124,58,237,0.25)] transition"
                >
                  <Sparkles size={13} />
                  Start free
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <div className="px-3 pt-2 pb-4 space-y-1">
              {nav.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-md text-base font-medium transition',
                      isActive
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {isPortfolio ? (
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base text-gray-500 hover:bg-gray-100"
                >
                  ← Built with Hyred
                </Link>
              ) : (
                <>
                  <Link
                    href="/preview"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-100"
                  >
                    Live example
                  </Link>
                  <Link
                    href="/build"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 block w-full text-center px-3 py-2.5 rounded-md text-base font-semibold text-white bg-gradient-to-b from-brand-600 to-brand-700 shadow"
                  >
                    Start free →
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Minimal top bar shown on /build and /admin — gives the builder maximum space.
function BuilderTopBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Home">
          <Logo size={26} />
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/preview"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <ExternalLink size={13} />
            Preview portfolio
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            AI Tools
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
}
