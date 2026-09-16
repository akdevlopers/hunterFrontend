"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import { useShop } from "../src/context/ShopContext";

// Custom Static Images for Top Categories (change image paths here as needed)
const STATIC_CATEGORY_IMAGES = {
  "T-Shirt": "/images/boxy.jpeg",
  "Jean": "/images/cargo.jpeg",
  "Shirt": "/images/shirt.jpeg",
};

export default function Categories() {
  const { topCategories, isHomeLoading } = useShop();

  const isLoading = isHomeLoading || (!topCategories || topCategories.length === 0);

  const displayCategories = topCategories.map((cat) => {
    // Check static image map first or fallback to API image
    const customStaticImg = STATIC_CATEGORY_IMAGES[cat.name] || STATIC_CATEGORY_IMAGES[Object.keys(STATIC_CATEGORY_IMAGES).find(k => k.toLowerCase() === (cat.name || "").toLowerCase())];
    const apiImg = cat.image_url || cat.icon_path;
    const finalImage = customStaticImg || (apiImg ? (apiImg.startsWith("http") ? apiImg : `https://meetay.com/${apiImg}`) : "/images/banner.jpg");

    return {
      id: cat.id,
      title: cat.name,
      image: finalImage,
    };
  });

  const featuredCategory = displayCategories[0];
  const sideCategories = displayCategories.slice(1);

  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12">
      {/* Heading */}
      <ScrollReveal direction="up">
        <div className="mb-8 sm:mb-12">
          <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-2 font-semibold">
            Explore Collection
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
            Top Categories
          </h2>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="animate-pulse h-[280px] sm:h-[420px] lg:h-[620px] bg-gray-200 rounded-3xl" />
          <div className="flex flex-col gap-4 sm:gap-8">
            <div className="animate-pulse h-[190px] sm:h-[250px] lg:h-[295px] bg-gray-200 rounded-3xl" />
            <div className="animate-pulse h-[190px] sm:h-[250px] lg:h-[295px] bg-gray-200 rounded-3xl" />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* LEFT FEATURED CATEGORY */}
        {featuredCategory && (
          <ScrollReveal direction="right" delay={150}>
            <Link
              href={`/products?category=${featuredCategory.id}`}
              className="group block cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gray-100"
            >
              <div className="relative h-[280px] sm:h-[420px] lg:h-[620px] overflow-hidden flex items-center justify-center">
                {featuredCategory.image && (
                  <img
                    src={featuredCategory.image}
                    alt={featuredCategory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:bg-black/25 transition duration-500" />

                <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 text-white">
                  <p className="uppercase tracking-[3px] text-[10px] sm:text-xs opacity-80 font-medium">
                    {featuredCategory.tag}
                  </p>

                  <h3 className="text-xl sm:text-4xl font-black mt-1.5 sm:mt-2">
                    {featuredCategory.title}
                  </h3>

                  <span className="mt-3 sm:mt-6 inline-flex items-center gap-2 bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-md uppercase tracking-wider">
                    Explore
                    <FiArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* RIGHT SIDE CATEGORIES */}
        <div className="flex flex-col gap-4 sm:gap-8">
          {sideCategories.map((item, index) => (
            <ScrollReveal
              key={item.id || index}
              direction="left"
              delay={250 + index * 150}
            >
              <Link
                href={`/products?category=${item.id}`}
                className="group block cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gray-100"
              >
                <div className="relative h-[190px] sm:h-[250px] lg:h-[295px] overflow-hidden flex items-center justify-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:bg-black/25 transition duration-500" />

                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                    <p className="uppercase tracking-[3px] text-[10px] sm:text-xs opacity-80 font-medium">
                      {item.tag}
                    </p>

                    <h3 className="text-lg sm:text-2xl font-black mt-1 sm:mt-1.5">
                      {item.title}
                    </h3>

                    <span className="mt-2 sm:mt-4 inline-flex items-center gap-2 bg-white text-black px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs font-bold group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-md uppercase tracking-wider">
                      Explore
                      <FiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
      )}
    </section>
  );
}