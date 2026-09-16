"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";
import { fetchCountries, fetchStates, fetchCities, fetchPaymentMethods, processOrder, fetchProductDetails } from "../../utils/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowId = Number(searchParams.get("id"));
  const buyNowSize = searchParams.get("size") || "L";
  const buyNowQty = Number(searchParams.get("qty")) || 1;
  const buyNowName = searchParams.get("name") || "";
  const buyNowPrice = Number(searchParams.get("price")) || 0;
  const buyNowImg = searchParams.get("img") || "";
  const buyNowVariantId = searchParams.get("variant_id");
  const urlOrderId = searchParams.get("order_id");
  const urlRazorpayOrderId = searchParams.get("razorpay_order_id");
  const urlAmount = searchParams.get("amount");

  const { user, cart, clearCart, addOrder } = useShop();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [orderApiError, setOrderApiError] = useState("");

  // Handle post-payment Razorpay redirect back to checkout
  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
      setOrderData({
        product_order_id: urlOrderId,
        razorpay_order_id: urlRazorpayOrderId,
        final_price: Number(urlAmount) || 0,
      });
      setOrderPlaced(true);
    }
  }, [urlOrderId, urlRazorpayOrderId, urlAmount]);

  // 1. Customer Information State (Pre-filled if user logged in)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user?.isLoggedIn || user?.email) {
      const fn = user?.customer?.first_name || (user?.name ? user.name.split(" ")[0] : "") || "";
      const ln = user?.customer?.last_name || (user?.name ? user.name.split(" ").slice(1).join(" ") : "") || "";
      setCustomerInfo({
        firstName: fn,
        lastName: ln,
        phone: user?.customer?.mobile || "",
        email: user?.customer?.email || user?.email || "",
      });
    }
  }, [user]);

  // API States
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [billingCitiesList, setBillingCitiesList] = useState([]);
  const [shippingCitiesList, setShippingCitiesList] = useState([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState(null);

  // Load Countries and States for default country
  useEffect(() => {
    async function initCheckoutData() {
      // 1. Fetch Countries
      const countryRes = await fetchCountries();
      if (countryRes?.status === "success" && Array.isArray(countryRes.countries) && countryRes.countries.length > 0) {
        setCountriesList(countryRes.countries);
        const firstCountry = countryRes.countries[0];
        setBillingAddress((prev) => ({ ...prev, country: prev.country || firstCountry.name }));
        setShippingAddress((prev) => ({ ...prev, country: prev.country || firstCountry.name }));

        // 2. Fetch States for the first country dynamically
        const stateRes = await fetchStates(firstCountry.id);
        if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
          setStatesList(stateRes.states);
        }
      }
    }
    initCheckoutData();
  }, []);

  // Country Change Handlers
  const handleBillingCountryChange = async (countryName) => {
    setBillingAddress((prev) => ({ ...prev, country: countryName, state: "", district: "" }));
    setStatesList([]);
    setBillingCitiesList([]);
    const selectedCountry = countriesList.find((c) => c.name === countryName);
    if (selectedCountry?.id) {
      const stateRes = await fetchStates(selectedCountry.id);
      if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
        setStatesList(stateRes.states);
      }
    }
  };

  const handleShippingCountryChange = async (countryName) => {
    setShippingAddress((prev) => ({ ...prev, country: countryName, state: "", district: "" }));
    setShippingCitiesList([]);
    const selectedCountry = countriesList.find((c) => c.name === countryName);
    if (selectedCountry?.id) {
      const stateRes = await fetchStates(selectedCountry.id);
      if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
        setStatesList(stateRes.states);
      }
    }
  };

  // State Change Handlers
  const handleBillingStateChange = async (stateName) => {
    setBillingAddress((prev) => ({ ...prev, state: stateName, district: "" }));
    const selectedSt = statesList.find((s) => s.name === stateName);
    if (selectedSt?.id) {
      const res = await fetchCities(selectedSt.id);
      if (res?.status === "success" && Array.isArray(res.cities)) {
        setBillingCitiesList(res.cities);
      }
    } else {
      setBillingCitiesList([]);
    }
  };

  const handleShippingStateChange = async (stateName) => {
    setShippingAddress((prev) => ({ ...prev, state: stateName, district: "" }));
    const selectedSt = statesList.find((s) => s.name === stateName);
    if (selectedSt?.id) {
      const res = await fetchCities(selectedSt.id);
      if (res?.status === "success" && Array.isArray(res.cities)) {
        setShippingCitiesList(res.cities);
      }
    } else {
      setShippingCitiesList([]);
    }
  };

  // 2. Billing Information State (Fresh every buy)
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    country: "",
    state: "",
    district: "",
    postalCode: "",
  });

  // 3. Shipping Address State
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    country: "",
    state: "",
    district: "",
    postalCode: "",
  });

  // 4. Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  // Active payment method details
  const activePaymentObj = paymentMethodsList.find((pm) => pm.name === paymentMethod);
  const advanceAmount = Number(activePaymentObj?.advance_amount) || 0;
  const deliveryPrice = Number(activePaymentObj?.delivery_price) || 0;

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMsg("");
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "HUNTER10" || couponCode.trim().toUpperCase() === "WELCOME") {
      setCouponDiscount(150);
      setCouponApplied(true);
      setCouponMsg("Coupon code applied successfully! (-₹150)");
    } else {
      setCouponMsg("Invalid coupon code.");
    }
  };

  // Buy now product item
  const buyNowProduct = (allProducts.find((p) => p.id === buyNowId)) || {
    id: buyNowId,
    name: buyNowName || "Streetwear Product",
    price: buyNowPrice || 950,
    sale_price: buyNowPrice || 950,
    image: buyNowImg,
    cover_image_url: buyNowImg,
  };

  // Active checkout items
  const checkoutItems =
    isBuyNow && (buyNowProduct || buyNowName)
      ? [
          {
            cartItemId: `buynow-${buyNowId}-${buyNowSize}`,
            product: buyNowProduct,
            selectedSize: buyNowSize,
            quantity: buyNowQty,
            price: buyNowPrice || buyNowProduct?.price || 950,
            variant_id: buyNowVariantId,
          },
        ]
      : cart;

  // Fetch payment methods with product_list payload
  useEffect(() => {
    async function loadPaymentMethods() {
      if (!checkoutItems || checkoutItems.length === 0) {
        const fallback = [
          {
            name: "Razorpay",
            label: "Prepaid",
            advance_amount: 0,
            delivery_price: 130,
          },
          {
            name: "Advance_Pay",
            label: "Advance Pay [Now You will pay Shipping Amount.Balance will pay on Delivery]",
            advance_amount: 200,
            delivery_price: 200,
          },
        ];
        setPaymentMethodsList(fallback);
        setPaymentMethod((prev) => prev || "Razorpay");
        return;
      }

      const productListPayload = checkoutItems.map((item) => ({
        product_id: Number(item.product?.id || item.id || item.product_id || buyNowId || 1),
        qty: Number(item.quantity || item.qty || 1),
      }));

      const pmRes = await fetchPaymentMethods(productListPayload);
      let pms = [];
      if (pmRes?.status === "success" && Array.isArray(pmRes.payment_methods) && pmRes.payment_methods.length > 0) {
        setPaymentMethodsData(pmRes);
        pms = pmRes.payment_methods.filter(
          (p) => p.name !== "COD" && p.name !== "Cash on Delivery" && !p.name?.toLowerCase().includes("cash on delivery")
        );
      }

      if (pms.length === 0) {
        pms = [
          {
            name: "Razorpay",
            label: "Prepaid",
            advance_amount: 0,
            delivery_price: 130,
          },
          {
            name: "Advance_Pay",
            label: "Advance Pay [Now You will pay Shipping Amount.Balance will pay on Delivery]",
            advance_amount: 200,
            delivery_price: 200,
          },
        ];
      }

      setPaymentMethodsList(pms);
      setPaymentMethod((prev) => {
        const found = pms.some((m) => m.name === prev);
        return found ? prev : (pms[0]?.name || "Razorpay");
      });
    }

    loadPaymentMethods();
  }, [
    isBuyNow,
    buyNowId,
    buyNowQty,
    cart.length,
    JSON.stringify(cart.map((c) => ({ id: c.product?.id || c.id, qty: c.quantity }))),
  ]);

  // Price Calculation
  const subtotal = checkoutItems.reduce(
    (total, item) => total + (item.price || item.product?.price || 950) * item.quantity,
    0
  );
  const tax = 0;
  const shippingCharge = paymentMethod === "Razorpay" ? deliveryPrice : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + tax + shippingCharge);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderApiError("");

    const activeShipping = shipToDifferentAddress ? shippingAddress : billingAddress;
    const isAdvancePay = paymentMethod === "Advance_Pay" || paymentMethod.toLowerCase().includes("advance");

    // Asynchronously resolve real database variant_id for each cart item
    const resolvedProductList = await Promise.all(
      checkoutItems.map(async (item) => {
        const prod = item.product || item;
        const targetProductId = Number(prod?.id || item.id || 1);
        let vId = item.variant_id || item.variantId || prod?.variant_id || (isBuyNow ? buyNowVariantId : null);

        // If vId is invalid or equal to product_id, fetch single product details to get real variant_id
        if (!vId || Number(vId) === targetProductId) {
          let variants = prod?.variants;
          if (!Array.isArray(variants) || variants.length === 0) {
            try {
              const detailRes = await fetchProductDetails(prod?.slug || targetProductId);
              if (detailRes?.status === 1 || detailRes?.data) {
                variants = detailRes?.data?.variants || detailRes?.data?.product?.variants || [];
              }
            } catch (err) {
              console.error("Fetch variants error:", err);
            }
          }

          if (Array.isArray(variants) && variants.length > 0) {
            const sizeQuery = item.selectedSize || buyNowSize || "";
            const matched = variants.find((v) => {
              if (!v.variant) return false;
              const vStr = String(v.variant).trim().toLowerCase();
              const qStr = String(sizeQuery).trim().toLowerCase();
              return vStr.startsWith(qStr) || qStr.startsWith(vStr) || vStr.includes(qStr);
            });
            if (matched?.id) {
              vId = matched.id;
            } else if (variants[0]?.id) {
              vId = variants[0].id;
            }
          }
        }

        const finalVariantId = Number(vId || targetProductId);

        return {
          product_id: targetProductId,
          variant_id: finalVariantId,
          qty: item.quantity,
          price: item.price || prod?.price || 0,
          original_price: prod?.original_price || item.price || prod?.price || 0,
        };
      })
    );

    // Construct API Payload matching backend specification
    const orderPayload = {
      payment_type: paymentMethod,
      payment_comment: "",
      delivery_id: 1,
      delivery_comment: "",
      additional_note: "",
      advance_amount: advanceAmount,
      advance_price: advanceAmount,
      delivery_price: deliveryPrice,
      total_weight: paymentMethodsData?.total_weight || 0,
      cartlist: {
        total_final_price: isAdvancePay ? (subtotal - couponDiscount + tax + deliveryPrice) : grandTotal,
        total_sub_price: subtotal,
        tax_price: tax,
        shipping_price: isAdvancePay ? advanceAmount : shippingCharge,
        advance_amount: advanceAmount,
        advance_price: advanceAmount,
        delivery_price: deliveryPrice,
        coupon_price: couponDiscount,
        coupon_code: couponCode || "",
        coupon_info: null,
        product_list: resolvedProductList,
      },
      billing_info: {
        firstname: customerInfo.firstName,
        lastname: customerInfo.lastName,
        email: customerInfo.email,
        billing_user_telephone: customerInfo.phone,
        billing_address: billingAddress.street,
        billing_postecode: billingAddress.postalCode,
        billing_country: billingAddress.country,
        billing_state: billingAddress.state,
        billing_city: billingAddress.district,
        delivery_address: activeShipping.street,
        delivery_city: activeShipping.district,
        delivery_postcode: activeShipping.postalCode,
        delivery_country: activeShipping.country,
        delivery_state: activeShipping.state,
      },
    };

    try {
      const res = await processOrder(orderPayload);
      if (res?.status === "success" || res?.data?.product_order_id || res?.data?.order_id) {
        const responseData = res.data || {};
        const finalOrderId = responseData.product_order_id || responseData.order_id || `HNR-${Math.floor(100000 + Math.random() * 900000)}`;

        // Extract Razorpay key & Razorpay order_id from response
        let rzpKey = responseData.key || responseData.razorpay_key;
        if (!rzpKey && responseData.payment_link) {
          try {
            const urlObj = new URL(responseData.payment_link);
            rzpKey = urlObj.searchParams.get("key");
          } catch (e) {}
        }
        rzpKey = rzpKey || "rzp_live_RqDb8X8JWRzxdI";

        const rzpOrderId = responseData.razorpay_order_id;

        // Option 2: Redirect directly to backend payment link for automatic backend capture & database update
        if (responseData.payment_link) {
          setOrderId(finalOrderId);
          setOrderData(responseData);
          addOrder({
            orderId: finalOrderId,
            items: checkoutItems,
            grandTotal: responseData.final_price || grandTotal,
            shippingAddress: activeShipping,
            paymentMethod,
            responseData: responseData,
          });
          if (!isBuyNow) clearCart();
          window.location.href = responseData.payment_link;
          return;
        }

        // Fallback: Open Razorpay JS popup modal directly if payment_link is not provided
        const scriptLoaded = await loadRazorpayScript();
        if (scriptLoaded && typeof window !== "undefined" && window.Razorpay) {
          const targetPayAmount = isAdvancePay
            ? (advanceAmount || Number(responseData.advance_amount) || Number(responseData.final_price) || 250)
            : (Number(responseData.final_price) || grandTotal);

          const amountInPaise = Math.round(targetPayAmount * 100);

          const options = {
            key: rzpKey,
            amount: amountInPaise,
            currency: "INR",
            name: "Hunter Mens Wear",
            description: `Order #${finalOrderId}`,
            order_id: rzpOrderId,
            prefill: {
              name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
              email: customerInfo.email,
              contact: customerInfo.phone,
            },
            theme: {
              color: "#000000",
            },
            handler: function (response) {
              setOrderId(finalOrderId);
              setOrderData({
                ...responseData,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              addOrder({
                orderId: finalOrderId,
                items: checkoutItems,
                grandTotal: responseData.final_price || grandTotal,
                shippingAddress: activeShipping,
                paymentMethod,
                responseData: responseData,
              });
              setOrderPlaced(true);
              if (!isBuyNow) clearCart();
              setIsSubmitting(false);
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }

        // Fallback order placement
        setOrderId(finalOrderId);
        setOrderData(responseData);
        addOrder({
          orderId: finalOrderId,
          items: checkoutItems,
          grandTotal: responseData.final_price || grandTotal,
          shippingAddress: activeShipping,
          paymentMethod,
          responseData: responseData,
        });
        setOrderPlaced(true);
        if (!isBuyNow) clearCart();
      } else {
        setOrderApiError(res?.message || "Failed to process order. Please try again.");
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setOrderApiError(err.message || "An unexpected error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <TopBar />
      <Navbar />

      {/* Clean Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-gray-100 flex items-center justify-between">
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
            <Link href="/cart" className="hover:text-black transition">
              Cart
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Checkout</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-black text-black tracking-tight uppercase">
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8">
        {orderPlaced ? (
          /* Order Confirmation View */
          <div className="py-10 text-center bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 max-w-xl mx-auto p-5 sm:p-8 shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <FiCheck className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">
              Order Confirmed
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase mt-1">
              Thank You For Your Order!
            </h2>
            <p className="text-xs font-mono font-bold text-purple-600 mt-1">
              Product Order ID: {orderData?.product_order_id || orderId}
            </p>

            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 text-left max-w-md mx-auto space-y-2 text-xs text-gray-700">
              {orderData?.order_id && (
                <p className="flex justify-between border-b border-gray-100 pb-1.5">
                  <strong className="text-black">Backend Order ID:</strong>
                  <span className="font-mono font-bold text-black">{orderData.order_id}</span>
                </p>
              )}
              {orderData?.razorpay_order_id && (
                <p className="flex justify-between border-b border-gray-100 pb-1.5">
                  <strong className="text-black">Razorpay Order ID:</strong>
                  <span className="font-mono font-bold text-gray-800">{orderData.razorpay_order_id}</span>
                </p>
              )}
              <p>
                <strong className="text-black">Customer:</strong> {customerInfo.firstName}{" "}
                {customerInfo.lastName} ({customerInfo.email})
              </p>
              <p>
                <strong className="text-black">Phone:</strong> {customerInfo.phone}
              </p>
              <p>
                <strong className="text-black">Billing Address:</strong> {billingAddress.street},{" "}
                {billingAddress.district}, {billingAddress.state} {billingAddress.postalCode},{" "}
                {billingAddress.country}
              </p>
              {shipToDifferentAddress && (
                <p>
                  <strong className="text-black">Shipping Address:</strong> {shippingAddress.street},{" "}
                  {shippingAddress.district}, {shippingAddress.state} {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </p>
              )}
              <p>
                <strong className="text-black">Payment Method:</strong>{" "}
                {activePaymentObj?.label || paymentMethod}
              </p>
              <p className="pt-2 text-sm font-black text-black border-t border-gray-100 flex justify-between items-center">
                <span>Final Price:</span>
                <span className="text-green-600 font-mono text-base">₹{(orderData?.final_price || grandTotal).toLocaleString("en-IN")}</span>
              </p>
            </div>

            {(paymentLink || orderData?.payment_link) && (
              <div className="mt-5 max-w-md mx-auto">
                <a
                  href={paymentLink || orderData?.payment_link}
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 rounded-full text-xs uppercase tracking-wider transition shadow-xl gap-2 active:scale-95"
                >
                  <span>Pay Now via Razorpay</span>
                  <FiArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Continue Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Structured Checkout Form & Summary Grid */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left Column: 4 Clean Checkout Sections */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* API Order Error Alert Banner */}
              {orderApiError && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-start gap-3 shadow-md">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-black uppercase tracking-wider text-red-900 mb-0.5">Order Error</p>
                    <p className="font-medium text-red-700 leading-relaxed">{orderApiError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderApiError("")}
                    className="text-red-400 hover:text-red-800 text-xs font-black uppercase tracking-wider p-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* SECTION 1: CUSTOMER INFORMATION */}
              <div className="space-y-3.5">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  1. Customer Information
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                        }
                        placeholder="First Name"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                        }
                        placeholder="Last Name"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        placeholder="Phone Number"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        placeholder="Email Address"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BILLING INFORMATION */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  2. Billing Information
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={billingAddress.street}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, street: e.target.value })
                      }
                      placeholder="Enter here..."
                      className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.country}
                        onChange={(e) => handleBillingCountryChange(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                      >
                        {countriesList.length === 0 && <option value="">Select Country</option>}
                        {countriesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.state}
                        onChange={(e) => handleBillingStateChange(e.target.value)}
                        className="w-full bg-white border border-purple-600 ring-1 ring-purple-600 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none transition cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {statesList.map((st) => (
                          <option key={st.id || st.name} value={st.name}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.district}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, district: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                      >
                        <option value="">Select District</option>
                        {billingCitiesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={billingAddress.postalCode}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, postalCode: e.target.value })
                        }
                        placeholder="Enter here..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SHIPPING ADDRESS */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  3. Shipping Address
                </h2>

                <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200/80">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shipToDifferentAddress}
                      onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      Ship To A Different Address?
                    </span>
                  </label>

                  {/* Separate Shipping Address Form if checked */}
                  {shipToDifferentAddress && (
                    <div className="space-y-4 pt-4 mt-3 border-t border-gray-200/80">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Shipping Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={shippingAddress.street}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, street: e.target.value })
                          }
                          placeholder="Enter shipping address here..."
                          className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.country}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            {countriesList.length === 0 && <option value="">Select Country</option>}
                            {countriesList.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.state}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            <option value="">Select State</option>
                            {statesList.map((st) => (
                              <option key={st.id || st.name} value={st.name}>
                                {st.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            District <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.district}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, district: e.target.value })
                            }
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            <option value="">Select District</option>
                            {shippingCitiesList.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                            }
                            placeholder="Enter here..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: PAYMENT METHOD */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  4. Payment Method
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-3">
                  {paymentMethodsList.map((pm) => (
                    <label
                      key={pm.name}
                      onClick={() => setPaymentMethod(pm.name)}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        paymentMethod === pm.name
                          ? "bg-white border-black shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === pm.name}
                        onChange={() => setPaymentMethod(pm.name)}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                        {pm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Order Summary Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <div className="p-4 sm:p-6 bg-gray-50/90 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
                
                {/* Order Summary Header */}
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
                    Order Summary: [{checkoutItems.reduce((acc, item) => acc + item.quantity, 0)}]
                  </h3>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => {
                    const imgSrc =
                      Array.isArray(item?.product?.images) && item.product.images.length > 0
                        ? item.product.images[0]
                        : typeof item?.product?.image === "string"
                        ? item.product.image
                        : Array.isArray(item?.product?.image) && item.product.image.length > 0
                        ? item.product.image[0]
                        : "";

                    const prodName = item?.product?.name || item?.product?.title || "HUNTER Apparel";
                    const itemPrice = item.price || item.product?.price || 950;

                    return (
                      <div
                        key={item.cartItemId || Math.random()}
                        className="flex items-start gap-3 p-2 bg-white rounded-xl border border-gray-200"
                      >
                        <div className="relative w-14 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={imgSrc}
                            alt={prodName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-extrabold text-black truncate leading-tight">
                              {prodName}
                            </h4>
                            <span className="text-xs font-black text-black whitespace-nowrap">
                              ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-700 font-semibold mt-1">
                            <strong className="text-black">Size:</strong> {item.selectedSize}
                          </p>

                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {item.quantity} x ₹{itemPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Enter Coupon Code Row */}
                <div className="pt-2 border-t border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-black outline-none focus:border-black transition"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition active:scale-95"
                    >
                      Apply
                    </button>
                  </div>

                  {couponMsg && (
                    <p className={`text-[11px] font-semibold mt-1.5 ${couponApplied ? "text-green-600" : "text-red-500"}`}>
                      {couponMsg}
                    </p>
                  )}
                </div>

                {/* Subtotal, Coupon, Tax, Shipping, Total Rows */}
                <div className="space-y-2.5 pt-3 border-t border-gray-200 text-xs text-gray-700 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-black">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Coupon</span>
                    <span className="font-extrabold text-black">
                      {couponDiscount > 0 ? `- ₹${couponDiscount.toLocaleString("en-IN")}` : "- ₹0,00"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-extrabold text-black">₹0,00</span>
                  </div>

                  {/* If Razorpay / Prepaid: show Shipping Amount */}
                  {paymentMethod === "Razorpay" && deliveryPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping Amount</span>
                      <span className="font-extrabold text-black">₹{deliveryPrice.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2.5 border-t border-gray-200 text-sm sm:text-base font-black text-black">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {/* If Advance Pay: show To Pay Advance Amount */}
                  {paymentMethod === "Advance_Pay" && advanceAmount > 0 && (
                    <div className="pt-2">
                      <p className="text-xs sm:text-sm font-black text-black">
                        To Pay Advance Amount ₹{advanceAmount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Error Notification Box */}
                {orderApiError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5">
                    <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{orderApiError}</span>
                  </div>
                )}

                {/* Complete Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Complete Order</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
