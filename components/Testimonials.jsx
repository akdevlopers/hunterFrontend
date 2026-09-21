"use client";

import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Sorted with the biggest/most detailed reviews first
const reviews = [
  {
    id: 1,
    name: "Jaaser Shahul",
    avatar: "JS",
    avatarBg: "bg-teal-600",
    tag: "25 reviews",
    timeAgo: "3 years ago",
    rating: 5,
    review:
      "Hunter Mens Clothing wear is located near Vivekanandapuram,Kanyakumari.Its Started morethan 4 years ago.They have the best Zero degree perfume also.They Had 146k followers on Instagram as of now.Its the famous men clothing around Kanyakumari District.They have the Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price.The best quality deny its quality",
  },
  {
    id: 2,
    name: "Josephin Gabril Vibun",
    avatar: "JV",
    avatarBg: "bg-indigo-600",
    tag: "31 reviews · 34 photos",
    timeAgo: "Edited 6 years ago",
    rating: 5,
    review:
      "Situated near the Vivekananda puram junction. Nice shop for men clothing. Dresses are in good quality and reasonable price 👌 👌 👌 . Shipping over all over India. Nice place for shopping. Not only dress, but caps, shoes, watches, deodorants are also available. Designs are ultimate 🔥 🔥 🔥 . Enjoy shopping 👓 👔 🎩 👟 ⌚ 😸 .Now shipping over world. ...",
  },
  {
    id: 3,
    name: "Nishanth Ligori",
    avatar: "NL",
    avatarBg: "bg-blue-600",
    tag: "14 reviews",
    timeAgo: "5 years ago",
    rating: 5,
    review:
      "One of the best Hub for Men's Clothing....Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price... The best quality products... Trendy and Innovative Collections... Definitely you won't deny it's quality... Just loved it... World wide shipping service is available... Delivery at any place... Overall 5/5..",
  },
  {
    id: 4,
    name: "Vimal Raj",
    avatar: "VR",
    avatarBg: "bg-amber-600",
    tag: "8 reviews",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "I like hunter❤️ menswear .\nI purchased phants and trackpants are quality wise top level ⚡\nFast reply and best guidence 😈 🎈 product details explaining very well 👍 💯 🤝 with clearly 🔥\nThank you @Hunter men's wear 🙏 😎\n\nTrusted 💯",
  },
  {
    id: 5,
    name: "Pavithran Pavi",
    avatar: "P",
    avatarBg: "bg-[#b81d52]",
    tag: "1 review",
    timeAgo: "6 years ago",
    rating: 5,
    review:
      "Such a wonderful collection I ever seen this before.... Just love this shop.... Keep rocking hinders men's wear",
  },
  {
    id: 6,
    name: "Patrick Parker",
    avatar: "PP",
    avatarBg: "bg-zinc-900",
    tag: "1 review",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "Good shop and best offers all the best for the following years thanks for giving special offers",
  },
  {
    id: 7,
    name: "Gowtham S",
    avatar: "G",
    avatarBg: "bg-purple-700",
    tag: "3 reviews",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "Awesome shop I ever seen... 💥 Affordable price...✨ Hearted customer service...♥ ...",
  },
  {
    id: 8,
    name: "proud muslim",
    avatar: "p",
    avatarBg: "bg-[#0d4d3d]",
    tag: "7 reviews",
    timeAgo: "3 years ago",
    rating: 5,
    review:
      "High quality stuffs in very reasonable price , highly recommend store for men",
  },
  {
    id: 9,
    name: "Vicky Vezhaventhan",
    avatar: "VV",
    avatarBg: "bg-emerald-600",
    tag: "11 reviews · 31 photos",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "A very good quality nd quantity of the product.Tq so much keep hunting nanba✨ ✨ ✨",
  },
  {
    id: 10,
    name: "Muthukumar V.J",
    avatar: "MV",
    avatarBg: "bg-rose-700",
    tag: "4 reviews",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "Nice Customer Service and Fast Delivery ✨ 🔥 Keep Rocking Hunter... ...",
  },
];

export default function Testimonials() {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 360;
    if (itemWidth > 0) {
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(0, newIndex), reviews.length - 1));
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-14">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-10 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
              Google Customer Reviews
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">
            What Our Customers Say
          </h2>
        </div>

        {/* Navigation Arrows for smooth scroll on Web & Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 hover:bg-black hover:text-white text-black flex items-center justify-center transition active:scale-95 shadow-sm bg-white"
            aria-label="Previous reviews"
          >
            <FiChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 hover:bg-black hover:text-white text-black flex items-center justify-center transition active:scale-95 shadow-sm bg-white"
            aria-label="Next reviews"
          >
            <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Carousel on both Web and Mobile view */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 pb-4 sm:pb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {reviews.map((item) => (
          <div
            key={item.id}
            className="w-[85vw] max-w-[320px] sm:w-[360px] lg:w-[380px] flex-shrink-0 snap-start bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-all duration-300 relative group"
          >
            <div>
              {/* Header: User Avatar & Name & Google Icon */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full ${item.avatarBg || "bg-black"} text-white flex items-center justify-center text-xs font-black tracking-wider shadow-sm flex-shrink-0`}
                  >
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-black tracking-tight leading-tight truncate">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                        {item.tag}
                      </p>
                    )}
                  </div>
                </div>
                <FcGoogle className="w-5 h-5 flex-shrink-0 opacity-90 group-hover:opacity-100 transition" />
              </div>

              {/* 5-Star Rating & Date */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {item.timeAgo}
                </span>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                "{item.review}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}