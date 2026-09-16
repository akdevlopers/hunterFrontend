"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/banner.jpg",
    imageMobile: "/images/banner11.png",
  },
  {
    id: 2,
    image: "/images/banner2.png",
    imageMobile: "/images/banner22.png",
  },
  {
    id: 3,
    image: "/images/banner3.png",
    imageMobile: "/images/banner33.png",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const marqueeItems = Array(12).fill("YOUR NEXT FIT IS SOMEWHERE HERE • BE READY TO HUNT ");

  // Auto-play carousel smoothly every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full pt-0 pb-0 overflow-hidden">
      {/* Full-Width Edge-to-Edge Hero Banner */}
      <div className="w-full">
        <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[calc(100vh-132px)] sm:min-h-[480px] sm:max-h-[780px] overflow-hidden bg-gray-900 group">
          {/* Background Image Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Desktop View Image */}
              <Image
                src={slide.image}
                alt={`Hero Slide Desktop ${slide.id}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="hidden sm:block object-cover object-center animate-hero-zoom"
              />

              {/* Mobile View Image (Natural 4:3 Widescreen Aspect Ratio) */}
              <Image
                src={slide.imageMobile || slide.image}
                alt={`Hero Slide Mobile ${slide.id}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="sm:hidden object-cover object-center animate-hero-zoom"
              />
            </div>
          ))}

          {/* Overlay Glass Pill Button (Centered) */}
          <Link
            href="/products"
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 bg-black/90 hover:bg-white text-white hover:text-black text-[11px] sm:text-sm font-black uppercase tracking-wider px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-white/40 shadow-2xl backdrop-blur-md transition-all active:scale-95 whitespace-nowrap"
          >
            <span>HUNT NOW</span>
          </Link>
        </div>
      </div>

      {/* Edge-to-Edge Full Width Marquee Ticker Bar */}
      <div className="w-full bg-[#111111] text-white py-3 px-0 overflow-hidden shadow-sm border-t border-black">
        <div className="animate-marquee flex items-center gap-20 whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
          {marqueeItems.map((text, idx) => (
            <span key={idx} className="flex items-center gap-20">
              <span>{text}</span>
              <span className="text-base text-gray-400">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}