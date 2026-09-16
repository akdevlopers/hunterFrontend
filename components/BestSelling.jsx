"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { useShop } from "../src/context/ShopContext";

function formatShortSize(sizeStr) {
  if (!sizeStr) return "";
  const str = String(sizeStr).trim();
  const match = str.match(/^([A-Za-z0-9]+)\(/);
  if (match) return match[1];
  return str;
}

function parseProductSizes(product) {
  if (!product) return [];

  // 1. Direct variants from API response: ONLY show in-stock / enabled sizes outside!
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const inStock = product.variants
      .filter((v) => v.stock === undefined || Number(v.stock) > 0)
      .map((v) => formatShortSize(v.variant))
      .filter(Boolean);
    return [...new Set(inStock)];
  }

  // 2. Direct sizes array
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    const formatted = product.sizes.map(formatShortSize).filter(Boolean);
    return [...new Set(formatted)];
  }

  return [];
}

export default function BestSelling() {
  const { bestsellerProducts, isHomeLoading } = useShop();

  const isLoading = isHomeLoading || (!bestsellerProducts || bestsellerProducts.length === 0);

  const productsToDisplay = bestsellerProducts.map((item) => ({
    id: item.id,
    slug: item.slug || item.id,
    name: item.name,
    category: item.category_id === 19 ? "Jacket" : item.category_id === 4 ? "T-Shirt" : "Streetwear",
    price: `₹${(item.sale_price || item.price || 0).toLocaleString("en-IN")}`,
    image: item.cover_image_url || (item.cover_image_path ? `https://meetay.com/${item.cover_image_path}` : ""),
    sizes: parseProductSizes(item),
  }));

  return (
    <section
      id="products"
      className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12"
    >
      {/* Header */}
      <ScrollReveal direction="up">
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <div>
            <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-1.5 sm:mb-2 font-semibold">
              Featured Collection
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
              Best Selling
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[2px]"
          >
            View All
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </ScrollReveal>

      {/* Grid: Shimmer Skeletons when loading, database products when loaded */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse flex flex-col space-y-3">
              <div className="aspect-[3/4] w-full bg-gray-200 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {productsToDisplay.map((item, idx) => (
          <ScrollReveal key={item.id} direction="up" delay={50 * (idx + 1)}>
            <Link href={`/products/${item.slug || item.id}`} className="group cursor-pointer flex flex-col transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6] flex items-center justify-center">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />
                
                {/* Quick View Button (Shows On Hover / Tap) */}
                <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-active:translate-y-0 group-active:opacity-100 transition-all duration-300 pointer-events-none z-10">
                  <span className="inline-block bg-white/95 backdrop-blur-md text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[11px] sm:text-sm font-bold shadow-lg group-hover:bg-black group-hover:text-white transition-all uppercase tracking-wider whitespace-nowrap">
                    View Product
                  </span>
                </div>
              </div>

              <div className="flex flex-col pt-2.5 sm:pt-3">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1 pr-1.5">
                    <h3 className="text-xs sm:text-base font-bold text-black line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[1.5px] sm:tracking-[2px] text-gray-500 mt-0.5 sm:mt-1 font-semibold">
                      {item.category}
                    </p>
                  </div>

                  <span className="text-xs sm:text-base font-black text-black whitespace-nowrap">
                    {item.price}
                  </span>
                </div>

                {/* Available Sizes Badges */}
                {item.sizes && item.sizes.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 sm:mt-2 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bold text-black mr-0.5">Size:</span>
                    {item.sizes.map((sz) => (
                      <span
                        key={sz}
                        className="text-[9px] sm:text-[10px] font-bold text-gray-800 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded whitespace-nowrap"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
      )}
    </section>
  );
}