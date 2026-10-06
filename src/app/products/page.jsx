"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import { fetchProductList } from "../../utils/api";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";

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

// Smart Pagination Range Helper (Shows 1, 2, 3, 4, 5 ... total on start)
function getPaginationRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // When on initial pages (1 to 4): show 1, 2, 3, 4, 5, ..., total
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  // When on the last few pages: show 1, ..., total-4, total-3, total-2, total-1, total
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  // When in the middle: show 1, ..., current-1, current, current+1, ..., total
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") || searchParams.get("product_tag") || "";
  const initialPageParam = Number(searchParams.get("page")) || 1;

  const { categories, allApiProducts, bestsellerProducts } = useShop();

  const [apiProducts, setApiProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: initialPageParam, total_products: 0, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPriceRange, setMaxPriceRange] = useState(3000);
  const [currentPage, setCurrentPage] = useState(initialPageParam);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category and page params from URL (e.g. when clicking browser back/forward buttons)
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
    const catFromUrl = searchParams.get("category") || searchParams.get("product_tag") || "";
    if (catFromUrl !== selectedCategory) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  // Load products & full categories list dynamically from GET /hunter-mens-wear/product-list
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const res = await fetchProductList({
        page: currentPage,
        product_tag: selectedCategory,
        min_price: 0,
        max_price: maxPriceRange === 3000 ? 0 : maxPriceRange,
        filter_product: "all",
        search: searchQuery.trim(),
      });

      if (res?.status === 1 && res?.data) {
        setApiProducts(res.data.products || []);
        if (res.data.categories && res.data.categories.length > 0) {
          setApiCategories(res.data.categories);
        }
        if (res.data.pagination) setPagination(res.data.pagination);
      } else {
        setApiProducts([]);
      }
      setIsLoading(false);
    }

    loadProducts();
  }, [currentPage, selectedCategory, maxPriceRange, searchQuery]);

  // Handle Page Change with URL synchronization
  const handlePageChange = (newPage) => {
    const targetPage = Math.max(1, newPage);
    setCurrentPage(targetPage);
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const newQuery = params.toString();
    const newPath = newQuery ? `/products?${newQuery}` : `/products`;
    router.replace(newPath, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use full categories array returned dynamically from API
  const displayCategoriesList = apiCategories.length > 0 ? apiCategories : categories;

  // Handle Category Click
  const handleCategorySelect = (catId) => {
    const nextCat = String(selectedCategory) === String(catId) ? "" : String(catId);
    setSelectedCategory(nextCat);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (nextCat) {
      params.set("category", nextCat);
    } else {
      params.delete("category");
      params.delete("product_tag");
    }
    const newQuery = params.toString();
    router.replace(newQuery ? `/products?${newQuery}` : `/products`, { scroll: false });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSortBy("featured");
    setMaxPriceRange(3000);
    setCurrentPage(1);
    router.replace("/products", { scroll: false });
  };

  // Sort & Display Dynamic API Products with global search across all catalog products
  const displayedProducts = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    if (!term) {
      return [...apiProducts]
        .filter((product) => {
          const itemPrice = product.sale_price || product.price || 0;
          return maxPriceRange === 3000 || itemPrice <= maxPriceRange;
        })
        .sort((a, b) => {
          const priceA = a.sale_price || a.price || 0;
          const priceB = b.sale_price || b.price || 0;
          if (sortBy === "price-low") return priceA - priceB;
          if (sortBy === "price-high") return priceB - priceA;
          return 0;
        });
    }

    // When searching, pool all catalog products so search spans the entire store across all pages
    const combined = [...apiProducts, ...(allApiProducts || []), ...(bestsellerProducts || [])];
    const seen = new Set();
    const pool = combined.filter((p) => {
      const key = p.id || p.slug;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Check if search query matches a category name (e.g. "Jean" / "T-Shirt" / "Cap")
    const categoryMatch = displayCategoriesList.find((c) =>
      c.name && (c.name.toLowerCase() === term || term.startsWith(c.name.toLowerCase()) || c.name.toLowerCase().startsWith(term))
    );

    // Primary search terms
    const primaryTerms = [term];
    if (term === "jean" || term === "jeans") {
      primaryTerms.push("jean", "jeans");
    } else if (term === "tshirt" || term === "t-shirt" || term === "tee") {
      primaryTerms.push("t-shirt", "tshirt", "tee");
    }

    // Split multi-word searches into individual words
    const words = term.split(/\s+/).filter(Boolean);

    return pool
      .filter((product) => {
        const itemPrice = product.sale_price || product.price || 0;
        const matchesPrice = maxPriceRange === 3000 || itemPrice <= maxPriceRange;
        if (!matchesPrice) return false;

        const nameStr = (product.name || "").toLowerCase();
        const slugStr = (product.slug || "").toLowerCase();
        const catStr = (product.category || product.category_name || product.product_tag_name || "").toLowerCase();
        const catId = String(product.category_id || product.product_tag_id || product.category || "");

        // Category match
        const matchesCategory = categoryMatch && (
          catStr.includes(categoryMatch.name.toLowerCase()) ||
          catId === String(categoryMatch.id)
        );

        // Primary term match
        const matchesPrimary = primaryTerms.some((t) =>
          nameStr.includes(t) || slugStr.includes(t) || catStr.includes(t)
        );

        // Multi-word match (all words present in product name/slug)
        const matchesAllWords = words.length > 1 && words.every((w) => nameStr.includes(w) || slugStr.includes(w) || catStr.includes(w));

        return matchesCategory || matchesPrimary || matchesAllWords;
      })
      .sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();

        // Exact or starts-with name matches prioritize to top
        const exactA = nameA === term || nameA.startsWith(term);
        const exactB = nameB === term || nameB.startsWith(term);
        if (exactA && !exactB) return -1;
        if (!exactA && exactB) return 1;

        const priceA = a.sale_price || a.price || 0;
        const priceB = b.sale_price || b.price || 0;

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        return 0;
      });
  }, [apiProducts, allApiProducts, displayCategoriesList, sortBy, maxPriceRange, searchQuery]);

  // Active Category Name & Product Count
  const activeCategoryObj = displayCategoriesList.find(
    (c) => String(c.id) === String(selectedCategory)
  );
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : "All Products";

  // Calculate dynamic totals based on search state
  const isSearchActive = Boolean(searchQuery.trim());
  const totalProductCount = isSearchActive
    ? displayedProducts.length
    : (pagination.total_products || displayedProducts?.length || 0);

  const totalPagesCount = isSearchActive
    ? (Math.ceil(displayedProducts.length / 20) || 1)
    : (pagination.total_pages || 1);

  // Pagination Pages Array
  const paginationRange = getPaginationRange(currentPage, totalPagesCount);

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      {/* Page Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">
              {activeCategoryName}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight uppercase flex items-baseline gap-2">
            <span>{activeCategoryName}</span>
            <span className="text-gray-400 font-medium text-sm sm:text-xl">({totalProductCount})</span>
          </h1>
        </div>

        {/* Header Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="w-full bg-gray-50 text-black placeholder-gray-400 border border-gray-200 text-xs px-4 py-2.5 rounded-full outline-none focus:border-black transition"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          ) : (
            <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 pb-28 lg:pb-0">

        {/* Mobile Filter & Category Pills Bar */}
        <div className="lg:hidden mb-4 space-y-2.5">
          <div className="flex items-center gap-2">
            {/* Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all flex-shrink-0 shadow-sm active:scale-95 ${
                selectedCategory || maxPriceRange < 3000
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200 hover:border-black"
              }`}
            >
              <FiFilter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {(selectedCategory || maxPriceRange < 3000) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Scrollable Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 flex-1">
              <button
                type="button"
                onClick={() => handleCategorySelect("")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all flex-shrink-0 border active:scale-95 ${
                  !selectedCategory
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              {displayCategoriesList.map((cat) => {
                const isSelected = String(selectedCategory) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all flex-shrink-0 border active:scale-95 ${
                      isSelected
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Chips & Clear */}
          {(selectedCategory || maxPriceRange < 3000 || searchQuery) && (
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap font-bold text-gray-600">
                <span className="text-[10px] uppercase text-gray-400">Filters:</span>
                {selectedCategory && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-black text-[11px]">
                    {activeCategoryName}
                  </span>
                )}
                {maxPriceRange < 3000 && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-black text-[11px]">
                    ≤ ₹{maxPriceRange}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[10px] font-black uppercase text-red-600 hover:underline tracking-wider"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:block lg:col-span-1 bg-gray-50/70 p-6 rounded-3xl border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <h2 className="text-lg font-black tracking-wide uppercase">
                Categories
              </h2>
              {(selectedCategory || maxPriceRange < 3000 || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-500 hover:text-black font-semibold underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories List from API payload */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
              {displayCategoriesList.map((cat) => {
                const isSelected = String(selectedCategory) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition ${
                      isSelected
                        ? "bg-black text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-200/60"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <FiCheck className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {/* PRICE RANGE FILTER SLIDER UNDER CATEGORIES */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
                  Price Range
                </h3>
                <span className="text-xs font-bold text-black bg-gray-200 px-2.5 py-0.5 rounded-md">
                  Up to ₹{maxPriceRange}
                </span>
              </div>

              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPriceRange}
                onChange={(e) => {
                  setMaxPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-1">
                <span>₹200</span>
                <span>₹3000+</span>
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="py-24 text-center">
                <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-4">Loading Products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-2xl font-bold text-gray-800">No Products Found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try clearing your search term, category selection, or price range filter.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {displayedProducts.map((product) => {
                    const imgUrl = product.cover_image_url || (product.cover_image_path ? `https://meetay.com/${product.cover_image_path}` : null);
                    const priceFormatted = `₹${(product.sale_price || product.price || 0).toLocaleString("en-IN")}`;
                    const targetSlug = product.slug || product.id;
                    const sizesList = parseProductSizes(product);

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${targetSlug}`}
                        className="group cursor-pointer flex flex-col rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-gray-100 p-2 sm:p-2.5"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f6f6f6] flex items-center justify-center">
                          {imgUrl && (
                            <img
                              src={imgUrl}
                              alt={product.name}
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
                        </div>

                        <div className="flex flex-col justify-between pt-2.5 px-0.5 flex-1">
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-1 leading-snug">
                              {product.name}
                            </h3>
                            <span className="text-xs sm:text-sm font-black text-black mt-1 block">
                              {priceFormatted}
                            </span>
                          </div>

                          {/* Available Sizes Badges */}
                          {sizesList.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 flex-wrap">
                              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 mr-0.5">Size:</span>
                              {sizesList.slice(0, 4).map((sz) => (
                                <span
                                  key={sz}
                                  className="text-[9px] sm:text-[10px] font-bold text-gray-800 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                                >
                                  {sz}
                                </span>
                              ))}
                              {sizesList.length > 4 && (
                                <span className="text-[9px] font-bold text-gray-400">+{sizesList.length - 4}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Clean Truncated Pagination Controls */}
                {totalPagesCount > 1 && (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 pt-8 border-t border-gray-100 flex-nowrap overflow-x-auto py-2">
                    {/* Previous Page Button */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-full text-xs font-bold bg-gray-100 text-black hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-black transition flex-shrink-0"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Numbered Page Buttons with Ellipsis */}
                    {paginationRange.map((item, idx) => {
                      if (item === "...") {
                        return (
                          <span key={`dots-${idx}`} className="px-1 sm:px-2 text-xs font-bold text-gray-400 select-none flex-shrink-0">
                            ...
                          </span>
                        );
                      }

                      const isCurrent = currentPage === item;
                      return (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-black transition flex-shrink-0 ${
                            isCurrent
                              ? "bg-black text-white shadow-md scale-105"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}

                    {/* Next Page Button */}
                    <button
                      disabled={currentPage === totalPagesCount}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-full text-xs font-bold bg-gray-100 text-black hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-black transition flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <FiFilter className="w-4 h-4 text-black" />
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  Filter Products
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition"
                aria-label="Close Filter"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                    Categories
                  </h4>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="text-[10px] font-bold text-red-600 uppercase tracking-wider hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`w-full flex items-center justify-between text-left py-2.5 px-3.5 rounded-xl text-xs font-extrabold uppercase transition ${
                      !selectedCategory
                        ? "bg-black text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>All Products</span>
                    {!selectedCategory && <FiCheck className="w-4 h-4 text-white stroke-[3]" />}
                  </button>

                  {displayCategoriesList.map((cat) => {
                    const isCatSelected = String(selectedCategory) === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex items-center justify-between text-left py-2.5 px-3.5 rounded-xl text-xs font-extrabold uppercase transition ${
                          isCatSelected
                            ? "bg-black text-white shadow-sm"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isCatSelected && <FiCheck className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter Slider in Mobile Drawer */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                    Price Range
                  </h4>
                  <span className="text-xs font-black text-black bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                    Up to ₹{maxPriceRange.toLocaleString("en-IN")}
                  </span>
                </div>

                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={maxPriceRange}
                  onChange={(e) => {
                    setMaxPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-black cursor-pointer h-2 bg-gray-100 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">
                  <span>₹200</span>
                  <span>₹3,000+</span>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Buttons */}
            <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-md flex items-center gap-2.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <button
                type="button"
                onClick={() => {
                  handleClearFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-1/3 py-3 rounded-full border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-100 transition active:scale-95 text-center"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 py-3 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider shadow-lg hover:bg-gray-800 transition active:scale-95 text-center"
              >
                Apply Filters
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}
