"use client";

import Image from "next/image";
import { FiCompass, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

export default function BrandStory() {
  const pillars = [
    {
      title: "Born in Kanyakumari",
      desc: "Rooted at India's southern tip with boundless vision.",
      icon: FiCompass,
    },
    {
      title: "Raised by the Streets",
      desc: "Shaped by raw urban lifestyle & streetwear culture.",
      icon: FiTrendingUp,
    },
    {
      title: "Driven by Culture",
      desc: "Crafted for individuals who wear what defines them.",
      icon: FiZap,
    },
    {
      title: "Built for What's Next",
      desc: "Continuous innovation, oversize cuts & exclusive drops.",
      icon: FiShield,
    },
  ];

  return (
    <section
      id="about"
      className="w-full bg-white border-t border-gray-100 py-8 sm:py-14 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-5 sm:space-y-8">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Our Story • Est. 2018
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-black tracking-tight uppercase leading-snug sm:leading-tight">
              Rise from Southern Tip of India to Worldwide Fashion Industry with a Vision for What’s Next.
            </h2>
          </ScrollReveal>
        </div>

        {/* Responsive Grid: Web view starts image higher up */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* IMAGE & STATS (Mobile: Top under mobile header, Web: Shifted higher up on the right) */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-20 space-y-3 sm:space-y-4 lg:-mt-8">
            <ScrollReveal direction="up" delay={150}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-200 h-[260px] sm:h-[360px] lg:h-[490px] w-full bg-gray-900 group">
                <Image
                  src="/images/brand-story.jpeg"
                  alt="Hunter Clothing Brand Story"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* 3 Stats Bar below image */}
              <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3.5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200/80 text-center mt-3">
                <div>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-black">8+ YRS</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Heritage</p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="text-sm sm:text-base lg:text-lg font-black text-black">100%</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Street DNA</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-black">ALL INDIA</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Shipping</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* STORY CONTENT & PILLARS (Mobile: Below image, Web: Left Column with top heading) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 sm:space-y-5">
            
            {/* Desktop Header (Hidden on Mobile, perfectly aligned with image top) */}
            <div className="hidden lg:block space-y-2 pb-1">
              <ScrollReveal direction="up" delay={100}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Our Story • Est. 2018
                </div>

                <h2 className="text-2xl lg:text-3xl font-black text-black tracking-tight uppercase leading-tight">
                  Rise from Southern Tip of India to Worldwide Fashion Industry with a Vision for What’s Next.
                </h2>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="up" delay={200}>
              <div className="space-y-3 text-gray-600 text-[11px] sm:text-[13px] leading-relaxed sm:leading-6 font-medium">
                <p>
                  <strong className="text-black font-black">Hunter Clothing</strong> began in{" "}
                  <span className="text-black font-bold">Kanyakumari, Tamil Nadu</span> with a simple ambition — to bring a new perspective to men’s fashion and make the latest styles more accessible to our community.
                </p>

                <p>
                  When we started, we weren’t trying to become just another clothing store. We wanted to elevate the fashion scene around us — introducing fresh trends, better fits, distinctive streetwear, and collections that felt different from what was already available.
                </p>

                {/* Highlight Quote Block */}
                <div className="relative overflow-hidden bg-black text-white rounded-xl p-3.5 sm:p-4 shadow-md my-2.5">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-0.5">
                    Founder Manifesto
                  </p>
                  <p className="text-xs sm:text-sm font-black italic tracking-wide uppercase leading-snug">
                    “We started from scratch, but we never thought we are small.”
                  </p>
                </div>

                <p>
                  Over the last 8 years, Hunter has created a huge impact on fashion people, evolving alongside a new generation of customers. From everyday menswear to oversized silhouettes, street culture, and exclusive drops, we continued to explore what was next and bring it to India.
                </p>

                <p>
                  Our customers became part of that journey. Their trust allowed a small vision from the southern tip of India to grow into an identity recognized for fresh fashion, carefully curated collections, and a constant hunger for something new.
                </p>

                <p className="text-gray-800 font-semibold pt-0.5">
                  Today, Hunter Clothing continues to move forward — experimenting, evolving, and pushing our vision beyond where it began.
                </p>
              </div>
            </ScrollReveal>

            {/* HUNT YOUR WEAR Philosophy Card */}
            <ScrollReveal direction="up" delay={250}>
              <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200/80 space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                  That hunger became our philosophy:
                </p>
                <h3 className="text-xs sm:text-base font-black text-black tracking-wider uppercase">
                  HUNT YOUR WEAR.
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 font-medium leading-relaxed">
                  Because at Hunter, we believe fashion isn’t simply about wearing what is trending. It’s about hunting for the piece that represents you.
                </p>
              </div>
            </ScrollReveal>

            {/* 4 Pillars Grid */}
            <ScrollReveal direction="up" delay={300}>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Core Pillars
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {pillars.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50/70 border border-gray-200/80 group hover:border-black transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="p-1 rounded bg-black text-white">
                            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </span>
                          <h4 className="text-[10px] sm:text-[11px] font-black text-black uppercase tracking-tight leading-tight">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight line-clamp-2 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Signature */}
            <ScrollReveal direction="up" delay={350}>
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-widest leading-none">
                  HUNTER CLOTHING®
                </h4>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">
                  THE HUNT NEVER ENDS
                </p>
              </div>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
}