'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface DropdownItem {
  name: string;
  href: string;
}

interface DropdownColumn {
  title: string;
  items: DropdownItem[];
}

interface NavCategory {
  id: string;
  name: string;
  href: string;
  alignRight?: boolean;
  columns?: DropdownColumn[];
}

const NAV_ITEMS: NavCategory[] = [
  {
    id: 'mens',
    name: 'MENS',
    href: '/products?department=men',
    columns: [
      {
        title: 'Topwear',
        items: [
          { name: 'Plain T-shirts', href: '/products?category=t-shirts&style=plain' },
          { name: 'Printed T-shirts', href: '/products?category=t-shirts&style=printed' },
          { name: 'Oversized T-shirts', href: '/products?category=t-shirts&fit=oversized' },
          { name: 'Polo T-shirts', href: '/products?category=t-shirts&style=polo' },
          { name: 'Plain Shirts', href: '/products?category=shirts&style=plain' },
          { name: 'Oxford Shirts', href: '/products?category=shirts&style=oxford' },
          { name: 'View All', href: '/products?category=t-shirts' },
        ],
      },
      {
        title: 'Bottomwear',
        items: [
          { name: 'Selvedge Raw Denim', href: '/products?category=jeans&style=selvedge' },
          { name: 'Regular Straight Jeans', href: '/products?category=jeans&fit=straight' },
          { name: 'Relaxed Wide Leg', href: '/products?category=jeans&fit=relaxed' },
          { name: 'Pleated Wool Trousers', href: '/products?category=trousers&style=pleated' },
          { name: 'Smart Stretch Chinos', href: '/products?category=trousers&style=chino' },
          { name: 'Tailored Chino Shorts', href: '/products?category=shorts&style=chino' },
          { name: 'View All', href: '/products?category=jeans' },
        ],
      },
      {
        title: 'Winterwear & Knits',
        items: [
          { name: '480 GSM Loopback Hoodies', href: '/products?category=hoodies' },
          { name: 'Crewneck Sweatshirts', href: '/products?category=hoodies&style=crewneck' },
          { name: 'Structured Wool Overcoats', href: '/products?category=jackets&style=overcoat' },
          { name: 'Vintage Selvedge Denim Jackets', href: '/products?category=jackets&style=denim' },
          { name: 'Cashmere Sweaters', href: '/products?category=t-shirts' },
          { name: 'View All', href: '/products?category=jackets' },
        ],
      },
      {
        title: 'Footwear & Drops',
        items: [
          { name: 'Italian Calfskin Low-Tops', href: '/products?category=sneakers&style=low-top' },
          { name: 'Heritage High-Tops', href: '/products?category=sneakers&style=high-top' },
          { name: 'Belgian Suede Slip-Ons', href: '/products?category=sneakers&style=slip-on' },
          { name: 'Minimalist Leather Loafers', href: '/products?category=sneakers&style=loafers' },
          { name: 'View All', href: '/products?category=sneakers' },
        ],
      },
    ],
  },
  {
    id: 'womens',
    name: 'WOMENS',
    href: '/products?department=women',
    columns: [
      {
        title: 'Topwear',
        items: [
          { name: 'Everyday Cotton Tees', href: '/products?department=women&category=t-shirts' },
          { name: 'Oversized Boyfriend Tees', href: '/products?department=women&fit=oversized' },
          { name: 'Tailored Blouses', href: '/products?department=women&category=shirts' },
          { name: 'Satin & Silk Shirts', href: '/products?department=women&style=satin' },
          { name: 'Ribbed Knit Polos', href: '/products?department=women&category=t-shirts' },
          { name: 'View All', href: '/products?department=women&type=topwear' },
        ],
      },
      {
        title: 'Bottomwear',
        items: [
          { name: 'High-Rise Straight Jeans', href: '/products?department=women&category=jeans' },
          { name: 'Wide-Leg Pleated Trousers', href: '/products?department=women&category=trousers' },
          { name: 'Silk Blend Slacks', href: '/products?department=women&category=trousers' },
          { name: 'Relaxed Denim Shorts', href: '/products?department=women&category=shorts' },
          { name: 'Linen Resort Pants', href: '/products?department=women&category=trousers' },
          { name: 'View All', href: '/products?department=women&type=bottomwear' },
        ],
      },
      {
        title: 'Outerwear & Knits',
        items: [
          { name: 'Tailored Wool Overcoats', href: '/products?department=women&category=jackets' },
          { name: 'Luxury Cashmere Crewnecks', href: '/products?department=women&category=t-shirts' },
          { name: 'Cropped Denim Jackets', href: '/products?department=women&category=jackets' },
          { name: 'Ribbed Long Cardigans', href: '/products?department=women&category=jackets' },
          { name: 'View All', href: '/products?department=women&category=jackets' },
        ],
      },
      {
        title: 'Sneakers & Shoes',
        items: [
          { name: 'Clean Court Low-Tops', href: '/products?department=women&category=sneakers' },
          { name: 'Platform Sneakers', href: '/products?department=women&category=sneakers' },
          { name: 'Leather Penny Loafers', href: '/products?department=women&category=sneakers' },
          { name: 'Suede Mules & Slides', href: '/products?department=women&category=sneakers' },
          { name: 'View All', href: '/products?department=women&category=sneakers' },
        ],
      },
    ],
  },
  {
    id: 'sneakers',
    name: 'SNEAKERS',
    href: '/products?category=sneakers',
    columns: [
      {
        title: 'Low-Tops',
        items: [
          { name: 'Italian Calfskin Low-Tops', href: '/products?category=sneakers&style=low-top' },
          { name: 'Minimalist White Court', href: '/products?category=sneakers&style=court' },
          { name: 'Retro Athletic Trainers', href: '/products?category=sneakers&style=runners' },
          { name: 'Suede Gum-Sole Trainers', href: '/products?category=sneakers&style=gum-sole' },
          { name: 'Raw Canvas Lows', href: '/products?category=sneakers&style=canvas' },
          { name: 'View All', href: '/products?category=sneakers' },
        ],
      },
      {
        title: 'High-Tops & Boots',
        items: [
          { name: 'Heritage Court High-Tops', href: '/products?category=sneakers&style=high-top' },
          { name: 'Italian Suede Chelsea Boots', href: '/products?category=sneakers&style=boots' },
          { name: 'Minimalist Combat High-Tops', href: '/products?category=sneakers&style=combat' },
          { name: 'Desert Suede Boots', href: '/products?category=sneakers&style=boots' },
          { name: 'View All', href: '/products?category=sneakers' },
        ],
      },
      {
        title: 'Slip-Ons & Loafers',
        items: [
          { name: 'Belgian Suede Slip-Ons', href: '/products?category=sneakers&style=slip-on' },
          { name: 'Minimalist Leather Loafers', href: '/products?category=sneakers&style=loafers' },
          { name: 'Leather Mules', href: '/products?category=sneakers&style=mule' },
          { name: 'Driving Shoes', href: '/products?category=sneakers&style=loafers' },
          { name: 'View All', href: '/products?category=sneakers' },
        ],
      },
      {
        title: 'Shop By Department',
        items: [
          { name: "Men's Sneaker Collection", href: '/products?department=men&category=sneakers' },
          { name: "Women's Sneaker Collection", href: '/products?department=women&category=sneakers' },
          { name: 'Studio Collaboration Drops', href: '/products?category=sneakers' },
          { name: 'Archival Reissues', href: '/products?category=sneakers' },
          { name: 'View All', href: '/products?category=sneakers' },
        ],
      },
    ],
  },
  {
    id: 'new-arrivals',
    name: 'NEW ARRIVALS',
    href: '/products?sort=newest',
  },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('mens');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout } = useAuthStore();
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

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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
            <Link href="/" className="flex items-center group shrink-0">
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-slate-950 uppercase group-hover:text-slate-700 transition-colors">
                VANGUARD
              </span>
            </Link>

            {/* Desktop Navigation Links: TOPWEAR, BOTTOMWEAR, SNEAKERS, WINTERWEAR, COMBOS, NEW ARRIVALS */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap shrink-0 ml-4">
              {NAV_ITEMS.map((item) => {
                const isOpen = activeDropdown === item.id;
                const hasColumns = Boolean(item.columns && item.columns.length > 0);

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => hasColumns && handleMouseEnter(item.id)}
                    onMouseLeave={hasColumns ? handleMouseLeave : undefined}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 text-xs uppercase font-extrabold tracking-wider px-3 py-2 rounded-lg transition-all ${
                        isOpen
                          ? 'text-slate-950 font-black'
                          : 'text-slate-800 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      {hasColumns && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-slate-950' : 'text-slate-500'
                          }`}
                        />
                      )}
                    </Link>

                    {/* Floating Dropdown Card (Beyoung Style) */}
                    {hasColumns && isOpen && (
                      <div
                        className={`absolute top-full ${item.alignRight ? 'right-0' : 'left-0'} pt-2.5 z-50 animate-fadeIn`}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-slate-100 px-8 py-7 sm:px-9 sm:py-8 flex gap-12 sm:gap-14 min-w-max text-left">
                          {item.columns!.map((col, idx) => (
                            <div key={idx} className="min-w-[130px] flex flex-col">
                              <h4 className="text-[15px] font-bold text-slate-900 tracking-tight mb-3.5">
                                {col.title}
                              </h4>
                              <div className="flex flex-col space-y-1.5">
                                {col.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`text-[13.5px] py-1 transition-colors whitespace-nowrap leading-snug block ${
                                      subItem.name === 'View All'
                                        ? 'text-slate-900 font-medium hover:text-slate-950 hover:underline pt-1'
                                        : 'text-slate-600 hover:text-slate-950 font-normal'
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Search Bar on Desktop */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex relative items-center w-36 md:w-44 lg:w-48 xl:w-60 shrink-0 ml-auto mr-2"
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
        <div className="fixed inset-0 z-50 lg:hidden flex">
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
                className="p-2 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100"
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

            {/* Departments & Subcategories Accordions */}
            <div className="p-5 flex-1 space-y-4">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100 text-xs font-black uppercase tracking-wider text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Store Categories
                </p>

                {NAV_ITEMS.filter((item) => item.columns).map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.id;
                  return (
                    <div key={cat.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                      >
                        <span className="font-display font-black text-sm uppercase tracking-wide text-slate-950">
                          {cat.name}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-3 bg-white space-y-3">
                          {cat.columns!.map((col, idx) => (
                            <div key={idx} className="space-y-1.5 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                              <h5 className="text-xs font-bold text-slate-950">{col.title}</h5>
                              <div className="space-y-1 pl-2">
                                {col.items.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-1 text-xs transition-colors ${
                                      sub.name === 'View All'
                                        ? 'font-semibold text-slate-900 underline'
                                        : 'text-slate-600 hover:text-slate-950'
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Customer Account Links */}
              <div className="pt-3 border-t border-slate-100">
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
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 text-brand-700 font-bold"
                    >
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions in Mobile Drawer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-1 py-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push('/');
                    }}
                    className="w-full py-2.5 text-center text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-800 border border-slate-200 rounded-xl bg-white hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Join
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
