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
  ChevronDown 
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, quickLoginAsUser, quickLoginAsAdmin } = useAuthStore();
  const cartItemCount = useCartStore((s) => s.getTotalCount());
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-950/90 backdrop-blur-md border-b border-obsidian-800 shadow-xl'
          : 'bg-obsidian-950 border-b border-obsidian-900'
      }`}
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-obsidian-900 via-brand-950 to-obsidian-900 border-b border-obsidian-800 text-xs py-1.5 px-4 text-center text-brand-300">
        <span>Complimentary domestic express shipping on orders over ₹1,999 • Worldwide Delivery</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-obsidian-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-widest text-white uppercase group-hover:text-brand-300 transition-colors">
              VANGUARD
            </span>
            <span className="text-[10px] tracking-widest uppercase text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded border border-brand-800/60 font-semibold hidden sm:inline-block">
              Atelier
            </span>
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-obsidian-300 hover:text-brand-300 transition-colors tracking-wide"
            >
              All Products
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm font-medium text-obsidian-400 hover:text-white transition-colors tracking-wide"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex relative items-center flex-1 max-w-xs md:max-w-sm"
          >
            <input
              type="text"
              placeholder="Search heavyweight tee, jacket, denim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-obsidian-900/90 text-sm text-obsidian-100 placeholder-obsidian-500 rounded-full pl-10 pr-4 py-2 border border-obsidian-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            <Search className="w-4 h-4 text-obsidian-400 absolute left-3.5" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-obsidian-300 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-obsidian-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-obsidian-300 hover:text-white transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-400 text-obsidian-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 text-sm text-obsidian-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-obsidian-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-obsidian-900 border border-obsidian-800 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-obsidian-800">
                        <p className="text-xs text-obsidian-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-300 hover:bg-obsidian-800 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-300 hover:bg-obsidian-800 transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-300 hover:bg-obsidian-800 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" /> Order History
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-300 hover:bg-obsidian-800 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>

                      <div className="border-t border-obsidian-800 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-obsidian-800 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm font-medium text-obsidian-300 hover:text-white px-3 py-1.5 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs sm:text-sm font-medium bg-brand-400 hover:bg-brand-500 text-obsidian-950 font-semibold px-3 sm:px-4 py-1.5 rounded-full transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search men's clothing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-obsidian-900 text-sm text-obsidian-100 placeholder-obsidian-500 rounded-lg pl-9 pr-4 py-2 border border-obsidian-800 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-obsidian-400 absolute left-3" />
          </form>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950 border-b border-obsidian-800 px-4 pt-2 pb-6 space-y-3">
          <div className="font-semibold text-xs tracking-wider uppercase text-obsidian-400 pt-2">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-300 py-1.5"
            >
              All Products
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-obsidian-300 hover:text-white py-1.5"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-obsidian-800 pt-3">
            <div className="font-semibold text-xs tracking-wider uppercase text-obsidian-400 mb-2">
              Quick Switch (Demo)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  quickLoginAsUser();
                  setMobileMenuOpen(false);
                }}
                className="text-xs bg-obsidian-800 text-obsidian-200 px-3 py-1.5 rounded border border-obsidian-700"
              >
                Login as User
              </button>
              <button
                onClick={() => {
                  quickLoginAsAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs bg-brand-900 text-brand-200 px-3 py-1.5 rounded border border-brand-800"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
