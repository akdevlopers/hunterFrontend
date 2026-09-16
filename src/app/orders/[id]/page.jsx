"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiRefreshCw,
  FiShoppingBag,
  FiAlertCircle,
  FiCheck,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import TopBar from "../../../../components/TopBar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import MobileBottomNav from "../../../../components/MobileBottomNav";
import { useShop } from "../../../context/ShopContext";
import { fetchOrderDetails } from "../../../utils/api";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `https://meetay.com/${cleanPath}`;
};

export default function OrderDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const router = useRouter();
  const { addToCart, apiOrders } = useShop();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await fetchOrderDetails(orderId);
        if (res?.status === 1 && res?.data?.order) {
          setOrder(res.data.order);
        } else if (res?.data?.orders && res.data.orders.length > 0) {
          setOrder(res.data.orders[0]);
        } else {
          const foundInList = apiOrders?.find(
            (o) => String(o.id) === String(orderId) || String(o.product_order_id) === String(orderId)
          );
          if (foundInList) {
            setOrder(foundInList);
          } else {
            setError(res?.message || "Unable to fetch order details from server.");
          }
        }
      } catch (err) {
        console.error("Order detail error:", err);
        setError("An error occurred while fetching order details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId, apiOrders]);

  const handleReorder = (item) => {
    const productToAdd = {
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: getImageUrl(item.image),
    };
    addToCart(productToAdd, item.variant_name || "M", Number(item.quantity || 1));
  };

  const getStatusBadge = (statusStr) => {
    const status = (statusStr || "placed").toLowerCase();
    if (status.includes("deliver") || status.includes("complet")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (status.includes("ship") || status.includes("pick") || status.includes("transit")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (status.includes("cancel") || status.includes("fail") || status.includes("reject")) {
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const orderStatus = order?.product_order_status || (order?.delivered_status === 1 ? "Delivered" : "Placed");
  const orderStatusLower = orderStatus.toLowerCase();

  let currentStepIndex = 0;
  if (orderStatusLower.includes("deliver") || orderStatusLower.includes("complet") || order?.delivery_date || order?.delivered_status === 1) {
    currentStepIndex = 3;
  } else if (orderStatusLower.includes("ship") || orderStatusLower.includes("transit") || orderStatusLower.includes("pick") || order?.shipped_date) {
    currentStepIndex = 2;
  } else if (orderStatusLower.includes("confirm") || orderStatusLower.includes("process") || order?.confirmed_date) {
    currentStepIndex = 1;
  } else {
    currentStepIndex = 0;
  }

  const trackingSteps = [
    {
      title: "Placed",
      date: formatDate(order?.order_date || order?.created_at),
      icon: FiPackage,
    },
    {
      title: "Confirmed",
      date: formatDate(order?.confirmed_date) || (currentStepIndex >= 1 ? "Confirmed" : "Pending"),
      icon: FiCheck,
    },
    {
      title: "Shipped",
      date: formatDate(order?.shipped_date || order?.picked_date) || (currentStepIndex >= 2 ? "In Transit" : "Pending"),
      icon: FiTruck,
    },
    {
      title: "Delivered",
      date: formatDate(order?.delivery_date) || (currentStepIndex >= 3 ? "Delivered" : "Pending"),
      icon: FiCheckCircle,
    },
  ];

  const rawDate = order?.order_date || order?.created_at;
  const displayPlacedDate = rawDate ? formatDate(rawDate) : null;
  const billing = order?.billing_details;
  const customerFullName = billing ? `${billing.first_name || ""} ${billing.last_name || ""}`.trim() : null;
  const deliveryAddress = billing?.delivery_address || billing?.address;

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Header Bar */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-3 sm:pt-8 pb-3 sm:pb-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div>
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-black text-[11px] sm:text-xs font-extrabold uppercase tracking-wider hover:bg-gray-200 transition active:scale-95 mb-2"
              aria-label="Go Back"
            >
              <FiArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Back to Orders</span>
            </button>

            {/* Breadcrumb Navigation (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5">
              <Link href="/" className="hover:text-black transition">Home</Link>
              <span>/</span>
              <Link href="/orders" className="hover:text-black transition">Orders</Link>
              <span>/</span>
              <span className="text-black font-semibold">#{order?.product_order_id || orderId}</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-3xl font-black text-black uppercase tracking-tight">
                Order #{order?.product_order_id || orderId}
              </h1>
              {order && (
                <span className={`inline-block text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full border ${getStatusBadge(orderStatus)}`}>
                  {orderStatus}
                </span>
              )}
            </div>
            {displayPlacedDate && (
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                Placed on <strong className="text-black font-bold">{displayPlacedDate}</strong>
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 self-start sm:self-center">
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-black underline hover:opacity-75 transition"
            >
              + Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8">
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
              Loading Order #{orderId}...
            </p>
          </div>
        ) : error && !order ? (
          <div className="py-16 text-center max-w-xl mx-auto p-6 bg-red-50 rounded-2xl sm:rounded-3xl border border-red-200 text-red-700 space-y-4">
            <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base sm:text-lg font-black uppercase">Order Not Found</h3>
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition"
            >
              <FiArrowLeft />
              <span>Return to Orders List</span>
            </Link>
          </div>
        ) : (
          order && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
              
              {/* LEFT COLUMN: Simplified Order Progress Stepper & Items List */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                
                {/* 1. Simplified Connected E-Commerce Order Stepper */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm">
                  <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100 mb-4 sm:mb-5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
                      {orderStatus}
                    </span>
                  </div>

                  {/* Connected Stepper Line */}
                  <div className="relative pt-1 pb-1">
                    {/* Inactive Background Track */}
                    <div className="absolute top-4 sm:top-5 left-[12.5%] right-[12.5%] h-1 bg-gray-100 rounded-full z-0" />
                    
                    {/* Active Progress Filled Track */}
                    <div 
                      className="absolute top-4 sm:top-5 left-[12.5%] h-1 bg-black rounded-full z-0 transition-all duration-700 ease-out"
                      style={{
                        width: `${(currentStepIndex / 3) * 75}%`
                      }}
                    />

                    {/* Stepper Nodes */}
                    <div className="grid grid-cols-4 relative z-10">
                      {trackingSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step.title} className="flex flex-col items-center text-center px-0.5">
                            {/* Circle Node */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-black text-white shadow-sm"
                                : "bg-white border-2 border-gray-200 text-gray-300"
                            } ${isCurrent ? "ring-4 ring-black/10 scale-105" : ""}`}>
                              {isCompleted ? (
                                <FiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              )}
                            </div>

                            {/* Step Label */}
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider mt-2 line-clamp-1 ${
                              isCompleted ? "text-black" : "text-gray-400"
                            }`}>
                              {step.title}
                            </span>

                            {/* Date / Subtitle */}
                            {step.date && (
                              <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold mt-0.5 truncate max-w-full">
                                {step.date}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Purchased Items List */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                      <FiShoppingBag className="w-4 h-4 text-black" />
                      <span>Order Items</span>
                    </h3>
                    <span className="text-[11px] sm:text-xs text-gray-500 font-bold">
                      {order.items?.length || 0} Item(s)
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item, idx) => {
                      const itemPrice = Number(item.price || 0);
                      const itemQty = Number(item.quantity || 1);
                      const itemTotal = itemPrice * itemQty;
                      const imgSrc = getImageUrl(item.image);

                      return (
                        <div key={item.variant_id || item.product_id || idx} className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Item Thumbnail & Info */}
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                              <Image
                                src={imgSrc}
                                alt={item.name || "Product Image"}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-extrabold text-black leading-snug line-clamp-2 mt-0.5">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                {item.variant_name && (
                                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                                    Size: <strong className="text-black font-extrabold">{item.variant_name}</strong>
                                  </span>
                                )}
                                <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                                  Qty: <strong className="text-black font-extrabold">{itemQty}</strong>
                                </span>
                              </div>
                              <span className="text-xs sm:text-sm font-black text-black mt-1.5 block">
                                ₹{itemTotal.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          {/* Reorder Action */}
                          <div className="flex justify-end sm:justify-center pt-1 sm:pt-0">
                            <Link
                              href="/cart"
                              onClick={() => handleReorder(item)}
                              className="w-full sm:w-auto px-4 py-2 rounded-full bg-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow active:scale-95 flex items-center justify-center gap-1.5 text-center"
                            >
                              <FiRefreshCw className="w-3.5 h-3.5" />
                              <span>Buy Again</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Payment Summary & Delivery Meta Cards */}
              <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                
                {/* Luxury Dark Payment Summary Card */}
                <div className="bg-[#111111] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl space-y-4 border border-gray-800">
                  <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 border-b border-gray-800 pb-3 flex items-center justify-between">
                    <span>Payment Breakdown</span>
                    <FiCreditCard className="w-4 h-4 text-white" />
                  </h3>

                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between text-gray-400">
                      <span>Product Price:</span>
                      <span className="text-white font-bold">
                        ₹{Number(order.product_price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {Number(order.coupon_price) > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Coupon Discount:</span>
                        <span>- ₹{Number(order.coupon_price).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400">
                      <span>Delivery Shipping:</span>
                      <span className="text-white font-bold">
                        {Number(order.delivery_price || 0) === 0 ? "FREE" : `₹${Number(order.delivery_price).toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {Number(order.tax_price) > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>GST Tax ({order.tax_in_percentage || 0}%):</span>
                        <span className="text-white font-bold">₹{Number(order.tax_price).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {Number(order.reward_points) > 0 && (
                      <div className="flex justify-between text-amber-400 font-bold">
                        <span>Reward Points:</span>
                        <span>+{order.reward_points} PTS</span>
                      </div>
                    )}

                    <hr className="border-gray-800 pt-1" />

                    <div className="flex justify-between items-center text-sm sm:text-base font-black text-white pt-0.5">
                      <span>Total Paid:</span>
                      <span className="text-base sm:text-xl text-emerald-400 font-black">
                        ₹{Number(order.final_price || order.product_price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {order.payment_type && (
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[11px] text-gray-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase text-[9px] text-gray-400">Payment Mode</span>
                        <span className="font-black text-emerald-400 uppercase text-[10px]">
                          {order.payment_status || "Paid"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px]">
                        Method: <strong className="text-white font-bold">{order.payment_type}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery & Billing Address Card */}
                {billing && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 space-y-3 shadow-sm">
                    <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 pb-2 border-b border-gray-200">
                      <FiMapPin className="w-3.5 h-3.5 text-black" />
                      <span>Delivery Information</span>
                    </h4>

                    <div className="space-y-2 text-[11px] sm:text-xs text-gray-600 font-medium">
                      {customerFullName && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500 font-semibold">Customer:</span>
                          <span className="font-bold text-black">{customerFullName}</span>
                        </div>
                      )}

                      {billing.telephone && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500 font-semibold">Phone:</span>
                          <span className="font-bold text-black">{billing.telephone}</span>
                        </div>
                      )}

                      {billing.email && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500 font-semibold">Email:</span>
                          <span className="font-bold text-black">{billing.email}</span>
                        </div>
                      )}

                      {deliveryAddress && (
                        <div className="pt-1">
                          <span className="text-gray-500 font-semibold block mb-1">Address:</span>
                          <div className="font-bold text-black bg-white p-2.5 rounded-xl border border-gray-200 text-[11px] leading-relaxed whitespace-pre-line">
                            {deliveryAddress}
                            {billing.delivery_state || billing.state ? `, ${billing.delivery_state || billing.state}` : ""}
                            {billing.delivery_postcode || billing.postcode ? ` - ${billing.delivery_postcode || billing.postcode}` : ""}
                            {billing.delivery_country || billing.country ? `, ${billing.delivery_country || billing.country}` : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Back to Orders Action Button */}
                <Link
                  href="/orders"
                  className="w-full py-3 rounded-full bg-gray-100 hover:bg-black hover:text-white text-black text-xs font-extrabold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 border border-gray-200 text-center"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>View All Orders</span>
                </Link>

              </div>

            </div>
          )
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}


