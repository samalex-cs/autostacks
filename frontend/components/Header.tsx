'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Menu, X, User, LogOut, ChevronDown, Car, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { onAuthChange, logout } from '@/lib/firebase/auth';
import { fetchHeader } from '@/lib/contentstack/queries';
import type { User as FirebaseUser } from 'firebase/auth';
import type { HeaderEntry, NavigationItem } from '@/lib/contentstack/client';

// Default navigation links (fallback)
const defaultNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars?type=used', label: 'Used Cars' },
  { href: '/cars?type=new', label: 'New Cars' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/news', label: 'News' },
];

// Default header config (fallback)
const defaultHeaderConfig = {
  logoText: 'AutoStack',
  logoLink: '/',
  ctaLabel: 'Sign In',
  ctaUrl: '/auth/login',
  showSearch: true,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState<HeaderEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Derive navigation links from Contentstack or use defaults
  const navLinks = headerData?.navigation?.map((nav: NavigationItem) => ({
    href: nav.url,
    label: nav.label,
    isHighlighted: nav.is_highlighted,
    openInNewTab: nav.open_in_new_tab,
  })) || defaultNavLinks.map(link => ({ ...link, isHighlighted: false, openInNewTab: false }));

  const logoImage = headerData?.logo?.url || null;
  const logoText = headerData?.logo_text || defaultHeaderConfig.logoText;
  const logoLink = headerData?.logo_link || defaultHeaderConfig.logoLink;
  const ctaLabel = headerData?.cta_label || defaultHeaderConfig.ctaLabel;
  const ctaUrl = headerData?.cta_url || defaultHeaderConfig.ctaUrl;
  const showSearch = headerData?.show_search ?? defaultHeaderConfig.showSearch;

  // Fetch header data from Contentstack
  useEffect(() => {
    async function loadHeader() {
      try {
        const data = await fetchHeader();
        setHeaderData(data);
      } catch (error) {
        console.error('Failed to load header:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadHeader();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="container-app">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={logoLink} className="flex items-center gap-2 group">
            {logoImage ? (
              <Image
                src={logoImage}
                alt={logoText}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded-lg"
              />
            ) : (
              <div
                className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  'bg-primary-400 group-hover:bg-primary-500 transition-colors'
                )}
              >
                <Car className="w-6 h-6 text-navy-900" />
              </div>
            )}
            <span
              className={clsx(
                'text-xl font-bold',
                isScrolled ? 'text-navy-900' : 'text-white'
              )}
            >
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className={clsx(
                  'font-medium transition-colors link-hover',
                  link.isHighlighted
                    ? 'text-primary-400 font-semibold'
                    : pathname === link.href
                    ? 'text-primary-400'
                    : isScrolled
                    ? 'text-surface-600 hover:text-primary-500'
                    : 'text-white/80 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search */}
            {showSearch && (
              <button
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-surface-600 hover:bg-surface-100'
                    : 'text-white/80 hover:bg-white/10'
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    'transition-colors',
                    isScrolled
                      ? 'hover:bg-surface-100'
                      : 'hover:bg-white/10'
                  )}
                >
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      'bg-primary-400 text-navy-900'
                    )}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown
                    className={clsx(
                      'w-4 h-4 transition-transform',
                      isUserMenuOpen && 'rotate-180',
                      isScrolled ? 'text-surface-600' : 'text-white'
                    )}
                  />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-xl shadow-xl border border-surface-100 animate-scale-in">
                    <div className="px-4 py-2 border-b border-surface-100">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-surface-600 hover:bg-surface-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={ctaUrl}>
                <Button variant="primary" size="sm">
                  {ctaLabel}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={clsx(
              'lg:hidden p-2 rounded-lg',
              isScrolled
                ? 'text-surface-600 hover:bg-surface-100'
                : 'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 bg-white rounded-xl shadow-xl mt-2 animate-slide-up">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={clsx(
                    'px-4 py-3 font-medium',
                    link.isHighlighted
                      ? 'text-primary-500 font-semibold bg-primary-50'
                      : pathname === link.href
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-surface-600 hover:bg-surface-50'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t border-surface-100 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" fullWidth>
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" fullWidth onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href={ctaUrl} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      {ctaLabel}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

