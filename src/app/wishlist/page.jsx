"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart, getWishlistCount, allApiProducts } = useShop();

  const savedProducts = useMemo(() => {
    if (!Array.isArray(wishlist)) return [];
    const catalog = [...(allApiProducts || []), ...(allProducts || [])];
    const seen = new Set();
    const results = [];

    wishlist.forEach((item) => {
      let resolved = null;
      let itemSelectedSize = null;

      if (typeof item === "object" && item !== null) {
        itemSelectedSize = item.selectedSize || item.size;
        resolved = item;
      } else {
        resolved = catalog.find((p) => String(p.id) === String(item) || String(p.slug) === String(item));
      }

      if (resolved) {
        const key = resolved.id || resolved.slug || JSON.stringify(resolved);
        if (!seen.has(key)) {
          seen.add(key);
          const rawPrice = resolved.sale_price || resolved.price || 0;
          const imgUrl = resolved.cover_image_url || (resolved.cover_image_path ? `https://meetay.com/${resolved.cover_image_path}` : resolved.image || "/images/banner.jpg");
          const cat = (resolved.category || resolved.category_name || resolved.name || "").toLowerCase();

          let categorySizes = [];
          let defaultCategorySize = "M";

          if (cat.includes("pant") || cat.includes("jean") || cat.includes("bottom") || cat.includes("short") || cat.includes("trouser")) {
            categorySizes = ["28", "30", "32", "34", "36", "38"];
            defaultCategorySize = "32";
          } else if (cat.includes("cap") || cat.includes("hat") || cat.includes("watch") || cat.includes("accessory")) {
            categorySizes = ["Adjustable"];
            defaultCategorySize = "Adjustable";
          } else {
            categorySizes = ["S", "M", "L", "XL", "XXL"];
            defaultCategorySize = "M";
          }

          // Extract exact sizes from live API variants if available
          let productSizes = [];
          if (Array.isArray(resolved.variants) && resolved.variants.length > 0) {
            productSizes = resolved.variants.map((v) => (typeof v === "object" ? v.variant : v)).filter(Boolean);
          } else if (Array.isArray(resolved.sizes) && resolved.sizes.length > 0) {
            productSizes = resolved.sizes;
          } else {
            productSizes = categorySizes;
          }

          const savedSize = itemSelectedSize || resolved.selectedSize || resolved.size || (productSizes.length > 0 ? productSizes[0] : defaultCategorySize);

          results.push({
            id: resolved.id || key,
            name: resolved.name || resolved.title || "Streetwear Product",
            price: typeof rawPrice === "number" ? `₹${rawPrice.toLocaleString("en-IN")}` : `₹${rawPrice}`,
            rawPrice: rawPrice,
            image: imgUrl,
            category: resolved.category || resolved.category_name || "Streetwear",
            slug: resolved.slug || resolved.id,
            sizes: productSizes,
            defaultSize: savedSize,
            raw: resolved,
          });
        }
      }
    });

    return results;
  }, [wishlist, allApiProducts]);

  const handleMoveToCart = (product) => {
    const chosenSize = product.selectedSize || product.defaultSize || "M";
    const productForCart = {
      ...(product.raw || product),
      id: product.id,
      name: product.name,
      price: product.rawPrice || product.price,
      image: product.image,
      category: product.category,
    };
    addToCart(productForCart, chosenSize, 1);
    toggleWishlist(product.raw || product.id);
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

      {/* Clean Minimalist Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-gray-100 flex items-baseline justify-between">
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

          {/* Desktop Tag */}
          <p className="hidden sm:block text-[10px] sm:text-xs uppercase tracking-[3px] text-gray-500 font-bold mb-1">
            Saved Favorites
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Wishlist <span className="text-gray-400 font-medium">({getWishlistCount()})</span>
          </h1>
        </div>

        {savedProducts.length > 0 && (
          <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
            {savedProducts.length} Saved Item{savedProducts.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {savedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
              <FiHeart className="w-8 h-8 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">No Saved Items</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Tap the heart icon on any streetwear product to save it to your wishlist.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Discover Streetwear</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((product) => {
              const productUrl = `/products/${product.slug || product.id}`;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl bg-white cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6]">
                    <Link href={productUrl} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Remove Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.raw || product.id);
                      }}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-red-500 text-white shadow-md active:scale-95 transition z-10"
                      aria-label="Remove from Wishlist"
                    >
                      <FiHeart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Move to Cart Quick Action */}
                    <div
                      className="absolute bottom-3 left-3 right-3 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToCart(product);
                        }}
                        className="w-full bg-white/95 backdrop-blur-md text-black py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        <FiShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <Link href={productUrl} className="flex justify-between items-start pt-3 px-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-black line-clamp-1 group-hover:underline">
                        {product.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-bold">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-black ml-2">
                      {product.price}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
