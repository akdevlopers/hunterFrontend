"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchHomeData, fetchOrderList, fetchOrderDetails, getSecureToken, setSecureToken, removeSecureToken } from "../utils/api";

function decodeJwtPayload(tokenStr) {
  try {
    if (!tokenStr || typeof tokenStr !== "string") return null;
    const parts = tokenStr.split(".");
    if (parts.length >= 2) {
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(payloadBase64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    }
  } catch (e) {}
  return null;
}

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    isLoggedIn: false,
  });

  // Store Home API States
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [allApiProducts, setAllApiProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [isHomeLoading, setIsHomeLoading] = useState(true);

  // Order List API States
  const [apiOrders, setApiOrders] = useState([]);
  const [apiOrdersPagination, setApiOrdersPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_orders: 0,
    total_pages: 1,
  });
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch Store Home API Data
  useEffect(() => {
    async function loadStoreHomeData() {
      setIsHomeLoading(true);
      try {
        const res = await fetchHomeData();
        if (res?.status === 1 && res?.data) {
          setCategories(res.data.categories || []);
          setTopCategories(res.data.top_categories || []);
          setBestsellerProducts(res.data.bestseller_products || []);
          setAllApiProducts(res.data.all_products || []);
          setStoreInfo(res.data.store || null);
        }
      } catch (err) {
        console.error("Home API Load Error:", err);
      } finally {
        setIsHomeLoading(false);
      }
    }
    loadStoreHomeData();
  }, []);

  // Load from localStorage on mount
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hunter_cart");
      const savedWishlist = localStorage.getItem("hunter_wishlist");
      const savedUser = localStorage.getItem("hunter_user");
      const savedToken = getSecureToken();

      // Ensure hunter_orders is cleaned up from localStorage
      localStorage.removeItem("hunter_orders");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

    // -----------------------------
    // RESTORE AUTHENTICATION
    // -----------------------------
    const validToken =
      typeof savedToken === "string" &&
      savedToken.trim() !== "" &&
      savedToken !== "undefined" &&
      savedToken !== "null";

    if (validToken) {
      let parsedUser = null;
      try {
        if (savedUser) parsedUser = JSON.parse(savedUser);
      } catch (e) {}

      const jwtData = decodeJwtPayload(savedToken);
      const jwtEmail = jwtData?.email || jwtData?.customer?.email || "";
      const jwtName = jwtData?.name || jwtData?.first_name || (jwtEmail ? jwtEmail.split("@")[0] : "");

      const mUserName = typeof window !== "undefined" ? localStorage.getItem("m_user_name") : "";
      const mUserEmail = typeof window !== "undefined" ? localStorage.getItem("m_user_email") : "";

      const resolvedEmail =
        parsedUser?.email ||
        parsedUser?.customer?.email ||
        jwtEmail ||
        mUserEmail ||
        "";

      const resolvedName =
        parsedUser?.name ||
        (parsedUser?.customer?.first_name
          ? `${parsedUser.customer.first_name} ${parsedUser.customer.last_name || ""}`.trim()
          : "") ||
        jwtName ||
        mUserName ||
        "Customer";

      setUser({
        ...(parsedUser || {}),
        name: resolvedName,
        email: resolvedEmail,
        isLoggedIn: true,
        token: savedToken,
      });
    } else {
      setUser({
        name: "",
        email: "",
        isLoggedIn: false,
        token: "",
        customer: null,
      });
    }
  } catch (error) {
    console.error("Failed to load shop state from localStorage:", error);

    setUser({
      name: "",
      email: "",
      isLoggedIn: false,
      token: "",
      customer: null,
    });
  } finally {
    setIsLoaded(true);
  }
}, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart, isLoaded]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist, isLoaded]);

  // Sync user to localStorage (without token property)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const { token: _, ...safeUser } = user || {};
      localStorage.setItem("hunter_user", JSON.stringify(safeUser));
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  }, [user, isLoaded]);

  // Login action
  const login = (userData) => {
    const fn = userData?.customer?.first_name || (userData?.name ? userData.name.split(" ")[0] : "") || "";
    const ln = userData?.customer?.last_name || (userData?.name ? userData.name.split(" ").slice(1).join(" ") : "") || "";
    const fullName = `${fn} ${ln}`.trim() || userData?.name || "Customer";

    const newUserState = {
      name: fullName,
      email: userData?.customer?.email || userData?.email || "",
      isLoggedIn: true,
      token: userData?.token || "",
      customer: userData?.customer || null,
    };

    // Strip raw token from saved JSON profile object before writing to localStorage
    const { token: _, ...safeUserSavedState } = newUserState;

    setUser(newUserState);
    try {
      localStorage.setItem("hunter_user", JSON.stringify(safeUserSavedState));
      if (userData?.token) {
        setSecureToken(userData.token);
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  // Logout action - Completely clear all user session data & local storage
  const logout = () => {
    setUser({
      name: "",
      email: "",
      isLoggedIn: false,
      token: "",
      customer: null,
    });
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setApiOrders([]);

    try {
      removeSecureToken();
      localStorage.removeItem("hunter_user");
      localStorage.removeItem("hunter_cart");
      localStorage.removeItem("hunter_wishlist");
      localStorage.removeItem("hunter_orders");
      localStorage.removeItem("m_user_name");
      localStorage.removeItem("m_user_email");
      localStorage.removeItem("m_token");
      localStorage.removeItem("token");
      localStorage.clear(); // Complete clear of browser local storage for this domain
    } catch (e) {
      console.error("Logout storage clear error:", e);
    }
  };

  // Helper to extract short size format for variant matching
  const matchVariantStock = (variants, selectedSize, defaultStock = 99) => {
    if (!Array.isArray(variants) || variants.length === 0) return defaultStock;
    const v = variants.find((item) => {
      const varName = String(item.variant || "").trim();
      const short = varName.match(/^([A-Za-z0-9]+)\(/)?.[1] || varName;
      return varName === selectedSize || short === selectedSize;
    });
    return v && v.stock !== undefined ? Number(v.stock) : defaultStock;
  };

  // Cart operations with stock limit protection
  const addToCart = (product, selectedSize = "M", quantity = 1) => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${selectedSize}`;
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      // Determine stock limit for the specific variant
      const maxStock = product.stock !== undefined
        ? Number(product.stock)
        : matchVariantStock(product.variants, selectedSize, 99);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const currentQty = updated[existingIndex].quantity;
        const newTotalQty = maxStock > 0 ? Math.min(maxStock, currentQty + quantity) : (currentQty + quantity);
        updated[existingIndex].quantity = newTotalQty;
        updated[existingIndex].stock = maxStock;
        return updated;
      } else {
        const initialQty = maxStock > 0 ? Math.min(maxStock, quantity) : quantity;
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            selectedSize,
            quantity: initialQty,
            price: product.price,
            stock: maxStock,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId !== cartItemId) return item;

        let maxStock = item.stock !== undefined
          ? Number(item.stock)
          : matchVariantStock(item.product?.variants, item.selectedSize, 99);

        const safeQty = maxStock > 0 ? Math.min(maxStock, newQty) : newQty;
        return { ...item, quantity: safeQty, stock: maxStock };
      })
    );
  };

  // Wishlist operations (supports both product objects and primitive IDs)
  const toggleWishlist = (productOrId) => {
    if (!productOrId) return;
    setWishlist((prev) => {
      const targetId = typeof productOrId === "object" ? (productOrId.id || productOrId.slug) : productOrId;

      const exists = prev.some((item) => {
        const itemId = typeof item === "object" ? (item.id || item.slug) : item;
        return String(itemId) === String(targetId);
      });

      if (exists) {
        return prev.filter((item) => {
          const itemId = typeof item === "object" ? (item.id || item.slug) : item;
          return String(itemId) !== String(targetId);
        });
      } else {
        return [...prev, productOrId];
      }
    });
  };

  // Add order
  const addOrder = (orderData) => {
    const formattedOrder = {
      id: orderData.orderId || `HNR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Processing",
      items: orderData.items || [],
      grandTotal: orderData.grandTotal || 0,
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || "Prepaid",
    };

    setOrders((prev) => [formattedOrder, ...prev]);
  };

  // Check if product is in wishlist
  const isInWishlist = (productIdOrSlug) => {
    if (!productIdOrSlug) return false;
    return wishlist.some((item) => {
      const itemId = typeof item === "object" ? (item.id || item.slug) : item;
      return String(itemId) === String(productIdOrSlug);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total cart price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get total item count in cart
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Load API Orders from backend
  const loadApiOrders = async ({ page = 1, limit = 10 } = {}) => {
    setIsOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetchOrderList({ page, limit });
      if (res?.status === 1 && res?.data) {
        setApiOrders(res.data.orders || []);
        if (res.data.pagination) {
          setApiOrdersPagination(res.data.pagination);
        }
        return res.data;
      } else {
        setOrdersError(res?.message || "Failed to fetch orders.");
        return null;
      }
    } catch (err) {
      console.error("Error loading API orders:", err);
      setOrdersError(err.message || "An error occurred while loading orders.");
      return null;
    } finally {
      setIsOrdersLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        apiOrders,
        apiOrdersPagination,
        isOrdersLoading,
        ordersError,
        loadApiOrders,
        fetchOrderDetails,
        user,
        isLoaded,
        categories,
        topCategories,
        bestsellerProducts,
        allApiProducts,
        storeInfo,
        isHomeLoading,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        addOrder,
        clearCart,
        getCartTotal,
        getCartCount,
        getWishlistCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
