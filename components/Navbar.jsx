"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiHeart, FiUser, FiShoppingBag, FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { useShop } from "../src/context/ShopContext";

import AccountDrawer from "./AccountDrawer";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { getCartCount, getWishlistCount, user } = useShop();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/products" },
    { name: "New Arrivals", href: "/#new-arrivals" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1750px] mx-auto h-14 sm:h-16 px-4 sm:px-8 lg:px-12 grid grid-cols-3 items-center">
          
          {/* Left: Mobile Hamburger Icon (sm/md) & Desktop Links (lg+) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-1.5 text-black hover:opacity-70 transition focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <FiMenu className="w-5 h-5 stroke-[2]" />
            </button>

            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-black text-gray-700 transition relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Official Brand Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="relative h-6 sm:h-8 w-28 sm:w-40 block hover:opacity-85 transition"
            >
              <Image
                src="/images/logo.png"
                alt="HUNTER Logo"
                fill
                priority
                className="object-contain object-center"
              />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex justify-end items-center gap-2.5 sm:gap-5">
            <Link href="/products" className="p-1.5 hover:text-black text-gray-700 transition" aria-label="Search">
              <FiSearch className="w-5 h-5 stroke-[2]" />
            </Link>

            <Link href="/wishlist" className="hidden lg:flex relative p-1.5 hover:text-black text-gray-700 transition items-center" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 stroke-[2]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="hidden lg:flex relative p-1.5 hover:text-black text-gray-700 transition items-center" aria-label="Cart">
              <FiShoppingBag className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <Link
              href="/account"
              className="hidden lg:flex p-1.5 hover:text-black text-gray-700 transition items-center"
              aria-label="My Account"
            >
              <FiUser className="w-5 h-5 stroke-[2]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Account Drawer Panel */}
      <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Mobile Slide-Out Drawer Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-[360px] bg-white flex flex-col justify-between transition-transform duration-300 ease-out shadow-2xl lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative h-6 w-28 block">
              <Image
                src="/images/logo.png"
                alt="HUNTER Logo"
                fill
                className="object-contain object-left"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 text-black hover:opacity-70"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="mt-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider text-black border-b border-gray-50 hover:pl-2 transition-all"
              >
                <span>{link.name}</span>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium text-center uppercase tracking-wider">
            Premium Streetwear Catalog
          </p>
        </div>
      </div>
    </>
  );
}