"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiCheck,
  FiLock,
  FiTruck,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";

function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowId = Number(searchParams.get("id"));
  const buyNowSize = searchParams.get("size") || "L";
  const buyNowQty = Number(searchParams.get("qty")) || 1;

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useShop();

  const [cartErrors, setCartErrors] = useState({});
  const [buyNowQuantity, setBuyNowQuantity] = useState(buyNowQty);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Buy now product item
  const buyNowProduct = allProducts.find((p) => p.id === buyNowId);

  // Active items: Single item if Buy Now mode, or full cart if normal Cart mode
  const displayItems =
    isBuyNow && buyNowProduct
      ? [
          {
            cartItemId: `buynow-${buyNowProduct.id}-${buyNowSize}`,
            product: buyNowProduct,
            selectedSize: buyNowSize,
            quantity: buyNowQuantity,
            price: buyNowProduct.price,
            isBuyNowItem: true,
          },
        ]
      : cart;

  // Subtotal calculation
  const subtotal = displayItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 60;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
  const finalDiscountAmount = (subtotal * discount) / 100;
  const grandTotal = Math.max(0, subtotal - finalDiscountAmount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.trim().toUpperCase() === "HUNTER20") {
      setDiscount(20);
      setPromoSuccess("20% Discount Code Applied!");
    } else if (promoCode.trim().toUpperCase() === "FREESHIP") {
      setDiscount(10);
      setPromoSuccess("10% Off Applied!");
    } else {
      setPromoError("Invalid promo code. Try HUNTER20 for 20% off.");
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const generatedId = `HNR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
    if (!isBuyNow) {
      clearCart();
    }
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
            {isBuyNow ? "Instant Direct Checkout" : "Shopping Bag"}
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            {isBuyNow ? "Buy Now Checkout" : "Your Cart"}{" "}
            <span className="text-gray-400 font-medium">
              ({isBuyNow ? 1 : getCartCount()})
            </span>
          </h1>
        </div>

        {displayItems.length > 0 && (
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-black underline hover:opacity-75 transition"
          >
            + Add More Items
          </Link>
        )}
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {displayItems.length === 0 && !orderPlaced ? (
          /* Empty Cart State */
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
              <FiShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">Your Bag is Empty</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Looks like you haven't added any streetwear items to your cart yet.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Explore Collection</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : orderPlaced ? (
          /* Order Success State */
          <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-200 max-w-2xl mx-auto p-8 shadow-xl">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiCheck className="w-10 h-10 stroke-[3]" />
            </div>
            <span className="text-xs uppercase tracking-[4px] text-gray-500 font-bold">
              Order Confirmed
            </span>
            <h2 className="text-3xl font-black text-black uppercase mt-1">
              Thank You For Your Order!
            </h2>
            <p className="text-sm font-mono font-bold text-purple-600 mt-2">
              Order ID: {orderId}
            </p>
            <p className="text-gray-600 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              We have received your order and are preparing your streetwear items for dispatch.
            </p>
            <Link
              href="/products"
              onClick={() => setOrderPlaced(false)}
              className="mt-8 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-xl"
            >
              <span>Continue Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Active Cart & Summary Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {displayItems.map((item) => {
                  const itemImg =
                    item.product?.image ||
                    item.product?.cover_image_url ||
                    (item.product?.cover_image_path
                      ? item.product.cover_image_path.startsWith("http")
                        ? item.product.cover_image_path
                        : `https://meetay.com/${item.product.cover_image_path}`
                      : "/images/banner.jpg");

                  return (
                    <div
                      key={item.cartItemId}
                      className="py-4 flex gap-4 sm:gap-6 items-center justify-between"
                    >
                      {/* Item Image */}
                      <div className="relative w-20 h-24 sm:w-24 sm:h-32 rounded-2xl overflow-hidden bg-[#f6f6f6] flex-shrink-0 border border-gray-100">
                        <img
                          src={itemImg}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        {item.product.category}
                      </p>
                      <h3 className="text-xs sm:text-sm font-extrabold text-black truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 font-semibold">
                        Size: <span className="text-black font-extrabold">{item.selectedSize}</span>
                      </p>

                      {/* Quantity Controls */}
                      {(() => {
                        let itemStock = item.stock !== undefined ? Number(item.stock) : 99;
                        if (Array.isArray(item.product?.variants)) {
                          const v = item.product.variants.find(
                            (vr) => vr.variant === item.selectedSize || vr.variant === item.selectedSize
                          );
                          if (v && v.stock !== undefined) itemStock = Number(v.stock);
                        }

                        return (
                          <div className="mt-3">
                            <div className="inline-flex items-center border border-gray-200 rounded-full bg-gray-50 p-0.5">
                              <button
                                onClick={() => {
                                  if (item.isBuyNowItem) {
                                    setBuyNowQuantity((q) => Math.max(1, q - 1));
                                  } else {
                                    updateQuantity(item.cartItemId, item.quantity - 1);
                                  }
                                  setCartErrors((prev) => ({ ...prev, [item.cartItemId]: "" }));
                                }}
                                className="w-6 h-6 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition active:scale-95"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-black text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  if (itemStock > 0 && item.quantity >= itemStock) {
                                    setCartErrors((prev) => ({
                                      ...prev,
                                      [item.cartItemId]: `Only ${itemStock} items available in stock`,
                                    }));
                                  } else if (itemStock <= 0) {
                                    setCartErrors((prev) => ({
                                      ...prev,
                                      [item.cartItemId]: "Out of stock",
                                    }));
                                  } else {
                                    if (item.isBuyNowItem) {
                                      setBuyNowQuantity((q) => q + 1);
                                    } else {
                                      updateQuantity(item.cartItemId, item.quantity + 1);
                                    }
                                    setCartErrors((prev) => ({ ...prev, [item.cartItemId]: "" }));
                                  }
                                }}
                                className="w-6 h-6 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition active:scale-95"
                              >
                                +
                              </button>
                            </div>

                            {/* Red error message under quantity */}
                            {cartErrors[item.cartItemId] && (
                              <p className="mt-1.5 text-[11px] font-bold text-red-600 flex items-center gap-1 animate-pulse">
                                <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{cartErrors[item.cartItemId]}</span>
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-xs sm:text-base font-black text-black">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      {!item.isBuyNowItem && (
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition"
                          aria-label="Remove Item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-lg font-black uppercase tracking-wider text-black mb-6">
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Promo Discount ({discount}%)</span>
                      <span>-₹{finalDiscountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between text-base sm:text-lg font-black text-black">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Separate Checkout Page Navigation */}
                <Link
                  href={
                    isBuyNow && buyNowProduct
                      ? `/checkout?buyNow=true&id=${buyNowProduct.id}&size=${buyNowSize}&qty=${buyNowQuantity}`
                      : "/checkout"
                  }
                  className="w-full mt-6 bg-black text-white py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99]"
                >
                  <FiLock className="w-4 h-4" />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CartPageContent />
    </Suspense>
  );
}
