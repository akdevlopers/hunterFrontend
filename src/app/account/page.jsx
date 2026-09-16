"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiPackage,
  FiShield,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiLogIn,
  FiChevronRight,
  FiHeart,
  FiShoppingBag,
  FiAward,
  FiArrowLeft,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    logout,
    orders,
    apiOrders,
    apiOrdersPagination,
    getWishlistCount,
    getCartCount,
    loadApiOrders,
  } = useShop();

  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadApiOrders({ page: 1, limit: 20 });
  }, []);

  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();
  const totalOrdersCount = apiOrdersPagination?.total_orders || (apiOrders?.length > 0 ? apiOrders.length : orders.length);

  // Read localStorage fallbacks safely only after client mount to prevent SSR hydration mismatch
  const mUserName = mounted && typeof window !== "undefined" ? localStorage.getItem("m_user_name") || "" : "";
  const mUserEmail = mounted && typeof window !== "undefined" ? localStorage.getItem("m_user_email") || "" : "";

  const displayName =
    user?.name ||
    (user?.customer?.first_name
      ? `${user.customer.first_name} ${user.customer.last_name || ""}`.trim()
      : "") ||
    mUserName ||
    (user?.email || mUserEmail ? (user?.email || mUserEmail).split("@")[0] : "") ||
    "Customer";

  const displayEmail = user?.email || mUserEmail || "";

  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "HU";

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <TopBar />
      <Navbar />

      {/* Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          {/* Mobile View: Back Button */}
          <button
            onClick={() => router.back()}
            className="sm:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition active:scale-95 mb-1.5"
            aria-label="Go Back"
          >
            <FiArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>

          {/* Desktop View: Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Account</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Account Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        
        {/* Clean 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* 1. LEFT COLUMN: Luxury Profile Card (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="bg-[#111111] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              {user && user.isLoggedIn ? (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-black font-black text-lg sm:text-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      {userInitials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-xl font-black uppercase tracking-tight truncate">
                          {displayName}
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-white/10 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 flex-shrink-0">
                          <FiAward className="w-2.5 h-2.5 text-amber-400" />
                          VIP
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium truncate">{displayEmail}</p>
                    </div>
                  </div>

                  <hr className="border-gray-800" />

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      <span>HUNTER Club Member</span>
                    </div>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-gray-400 font-black text-lg flex items-center justify-center border border-white/10">
                      <FiUser className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                        Guest User
                      </h2>
                      <p className="text-xs text-gray-400">Sign in to manage orders & details</p>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="w-full py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
                  >
                    <FiLogIn className="w-4 h-4" />
                    <span>Login / Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 2. RIGHT COLUMN: Quick Stats & Navigation Lists (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Stat Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Link
                href="/orders"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{totalOrdersCount}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  My Orders
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{wishlistCount}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  Wishlist
                </p>
              </Link>

              <Link
                href="/cart"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{cartCount}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  Cart Bag
                </p>
              </Link>
            </div>

            {/* Shopping & Account Links */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 px-1">
                Shopping & Account
              </h3>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                <Link
                  href="/orders"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiPackage className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        My Orders & Live Tracking
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        View status, order timeline & 1-click reorder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">({totalOrdersCount})</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiHeart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Saved Favorites
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Your saved streetwear drops & wishlist items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">({wishlistCount})</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Information & Policies Links */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 px-1">
                Help & Store Policies
              </h3>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                <Link
                  href="/privacy"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiShield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Privacy Policy
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Data security & customer privacy practices
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/terms"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiFileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Terms & Conditions
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Store rules, exchange policies & warranty
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/support"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiHelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Help & Support
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        24/7 Assistance, FAQs & contact form
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowLogoutModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
              <FiLogOut className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                Confirm Logout
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                Are you sure you want to log out of your HUNTER account?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-black text-xs font-black uppercase tracking-wider transition active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="py-3 rounded-full bg-black hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider transition shadow-lg active:scale-95"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
