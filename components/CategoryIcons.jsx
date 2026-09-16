"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import { useShop } from "../src/context/ShopContext";

export default function CategoryIcons() {
  const { categories, isHomeLoading } = useShop();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const isLoading = isHomeLoading || (!categories || categories.length === 0);

  const getIconUrl = (cat) => {
    if (cat.icon_path) {
      return cat.icon_path.startsWith("http")
        ? cat.icon_path
        : `https://meetay.com/${cat.icon_path}`;
    }
    if (cat.image_url) return cat.image_url;
    return "";
  };

  const displayCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: getIconUrl(cat),
    link: `/products?category=${cat.id}`,
  }));

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 overflow-hidden">
      <ScrollReveal direction="up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-2">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-400 font-bold mb-0.5 sm:mb-1">
              FIND THE RARE
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black">
              Product Categories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Arrow Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll Categories Left"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-black text-black hover:text-white flex items-center justify-center transition active:scale-95 shadow-sm cursor-pointer"
              >
                <FiChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll Categories Right"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-black text-black hover:text-white flex items-center justify-center transition active:scale-95 shadow-sm cursor-pointer"
              >
                <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <Link
              href="/products"
              className="group flex items-center gap-1 text-[11px] sm:text-sm font-black text-gray-700 hover:text-black uppercase tracking-[1px] sm:tracking-[2px] transition whitespace-nowrap"
            >
              <span>VIEW ALL</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Circular Line-Art Icon Category Badges */}
        {isLoading ? (
          <div className="flex items-center gap-3 sm:gap-8 overflow-hidden pt-2 pb-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse flex flex-col items-center flex-shrink-0 w-24 sm:w-36 lg:w-40 space-y-3">
                <div className="w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex items-center justify-start gap-3.5 sm:gap-7 lg:gap-8 overflow-x-auto pt-2 pb-6 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing"
          >
            {displayCategories.map((cat, idx) => (
              <Link
                key={cat.id || idx}
                href={cat.link || "/products"}
                draggable={false}
                className="group flex flex-col items-center flex-shrink-0 snap-start cursor-pointer w-24 sm:w-36 lg:w-40"
              >
                {/* Circular light-grey background container */}
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-[#f3f4f6] group-hover:bg-[#e5e7eb] border border-gray-100 flex items-center justify-center p-4 sm:p-7 transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:shadow-md pointer-events-none">
                  {cat.icon && (
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      draggable={false}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    />
                  )}
                </div>

                {/* Category Label */}
                <span className="mt-3.5 text-xs sm:text-sm font-black tracking-wider text-black group-hover:text-gray-800 transition uppercase text-center line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
