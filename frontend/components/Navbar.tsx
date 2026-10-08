'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

const CATEGORIES = [
  { name: 'T-Shirts', href: '/products?category=t-shirts' },
  { name: 'Shirts', href: '/products?category=shirts' },
  { name: 'Jeans', href: '/products?category=jeans' },
  { name: 'Trousers', href: '/products?category=trousers' },
  { name: 'Jackets', href: '/products?category=jackets' },
  { name: 'Hoodies', href: '/products?category=hoodies' },
  { name: 'Shorts', href: '/products?category=shorts' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, quickLoginAsUser, quickLoginAsAdmin } = useAuthStore();
  const cartItemCount = useCartStore((s) => s.getTotalCount());
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
          <span>Complimentary express delivery on all orders over ₹1,999 • Free 14-day returns</span>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Left: Mobile & Tablet Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="p-2 -ml-2 rounded-lg text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                type="button"
                className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg sm:hidden transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1.5 group shrink-0">
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-slate-950 uppercase group-hover:text-slate-700 transition-colors">
                VANGUARD
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                MENSWEAR
              </span>
            </Link>

            {/* Desktop Navigation Links (LG screens and above - strictly single line with All) */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 whitespace-nowrap shrink-0">
              <Link
                href="/products"
                className="text-xs uppercase font-bold tracking-wider text-slate-900 hover:text-brand-600 transition-colors py-2 whitespace-nowrap"
              >
                All
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="text-xs uppercase font-semibold tracking-wider text-slate-600 hover:text-slate-950 transition-colors py-2 whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar on Desktop */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex relative items-center w-36 md:w-44 lg:w-48 xl:w-64 shrink-0 ml-auto mr-2"
            >
              <input
                type="text"
                placeholder="Search garments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-full pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-slate-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <Link
                href="/cart"
                className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-slate-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Auth */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors border border-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline max-w-[80px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-[11px] text-slate-500">Signed in as</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {user.role}
                          </span>
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-700 hover:bg-slate-50 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" /> Admin Portal
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4" /> My Profile
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" /> Order History
                        </Link>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            router.push('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                      href="/login"
                      className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-2 sm:px-3 py-1.5 transition-colors whitespace-nowrap"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-1.5 rounded-full transition-all hidden xs:inline-block whitespace-nowrap"
                    >
                      Join
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapsible Mobile Search Input */}
          {searchOpen && (
            <div className="sm:hidden pb-3 pt-1 border-t border-slate-100">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Full-Screen Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-black text-xl tracking-widest text-slate-950 uppercase">
                VANGUARD
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Search */}
            <div className="p-4 border-b border-slate-100">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </form>
            </div>

            {/* Categories Navigation */}
            <div className="p-5 flex-1 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Departments
                </p>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-bold text-slate-900 hover:text-brand-600 border-b border-slate-50"
                  >
                    <span>All</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-sm font-medium text-slate-700 hover:text-slate-950 border-b border-slate-50"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Customer Account Links */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Account & Orders
                </p>
                <div className="space-y-2 text-sm font-medium">
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-slate-700 hover:text-slate-950"
                  >
                    <span>Shopping Bag ({cartItemCount})</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-slate-700 hover:text-slate-950"
                  >
                    <span>Wishlist ({wishlistItems.length})</span>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-slate-700 hover:text-slate-950"
                  >
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-brand-700 font-bold"
                  >
                    <span>Admin Portal</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Demo Switchers & Auth */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Evaluation Instant Logins
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    quickLoginAsUser();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm hover:bg-slate-100"
                >
                  Login as User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickLoginAsAdmin();
                    setMobileMenuOpen(false);
                    router.push('/admin');
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                >
                  Login as Admin
                </button>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-900 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
