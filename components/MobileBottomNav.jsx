"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useShop } from "../src/context/ShopContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getCartCount, getWishlistCount, user } = useShop();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const navItems = [
    { name: "Home", href: "/", icon: FiHome },
    { name: "Shop", href: "/products", icon: FiGrid },
    { name: "Saved", href: "/wishlist", icon: FiHeart, badge: wishlistCount },
    { name: "Bag", href: "/cart", icon: FiShoppingBag, badge: cartCount },
    { name: "Account", href: "/account", icon: FiUser },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-200/90 px-0.5 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-1 flex-1 min-w-0 min-h-[44px] transition-all active:scale-95 ${
              isActive ? "text-black font-extrabold" : "text-gray-500 hover:text-black font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-black text-white text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] sm:text-[10px] uppercase tracking-wide truncate max-w-full ${isActive ? "font-extrabold" : "font-semibold"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
