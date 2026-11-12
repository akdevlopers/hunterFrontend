"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Each slide has desktop (sm and up) and mobile artwork. A <picture> element
// lets the browser download only the variant it will show, and a slide's
// images are only mounted once it is showing or queued next, so the first
// paint is not competing with banners the visitor cannot see yet.
const slides = [
  {
    id: 1,
    image: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/bannermobile1.jpeg",
    imageMobile: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/banner1.png",
  },
  {
    id: 2,
    image: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/bannermobile2.png",
    imageMobile: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/banner_2.png",
  },
  {
    id: 3,
    image: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/bannermobile3.png",
    imageMobile: "https://d198l0yp2i7sp9.cloudfront.net/uploads/6/banner_3.png",
  },
];

const SLIDE_INTERVAL_MS = 4000;
// Matches Tailwind's `sm` breakpoint, where the layout switches to the desktop banner.
const DESKTOP_MEDIA = "(min-width: 640px)";

export default function Hero() {
  // Counts carousel advances. The carousel only moves forward, so every slide
  // up to `tick + 1` has either been shown or is the one coming next.
  const [tick, setTick] = useState(0);
  const currentSlide = tick % slides.length;
  const mountedUpTo = Math.min(tick + 1, slides.length - 1);
  const marqueeItems = Array(12).fill("YOUR NEXT FIT IS SOMEWHERE HERE • BE READY TO HUNT ");

  // Auto-play carousel smoothly every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, SLIDE_INTERVAL_MS);
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
              {index <= mountedUpTo && (
                <picture>
                  <source media={DESKTOP_MEDIA} srcSet={slide.image} />
                  <img
                    src={slide.imageMobile || slide.image}
                    alt={`Hero slide ${slide.id}`}
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center animate-hero-zoom"
                  />
                </picture>
              )}
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
