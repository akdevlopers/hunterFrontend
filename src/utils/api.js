// API Configuration and Utility Functions

export const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL || "https://zd537dmbubpdipul2vm6g5feti0xfjpt.lambda-url.ap-south-1.on.aws";
export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "hunter-mens-wear";

// Direct API URL
export const BASE_URL = API_HOST;

/**
 * Secure Client Token Encryption Helpers (Method 3)
 */
export function setSecureToken(rawToken) {
  if (typeof window === "undefined" || !rawToken) return;
  try {
    const cleanToken = String(rawToken).trim();
    const encoded = btoa(encodeURIComponent(cleanToken));
    const obfuscated = `hnr_sec_${encoded}`;
    localStorage.setItem("hunter_token", obfuscated);
  } catch (e) {
    console.error("Set secure token error:", e);
  }
}

export function getSecureToken() {
  if (typeof window === "undefined") return "";
  try {
    const stored =
      localStorage.getItem("hunter_token") ||
      localStorage.getItem("m_token") ||
      localStorage.getItem("token");

    if (!stored) {
      const savedUser = localStorage.getItem("hunter_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.token || parsed.customer?.token || "";
      }
      return "";
    }

    if (stored.startsWith("hnr_sec_")) {
      const encoded = stored.replace("hnr_sec_", "");
      return decodeURIComponent(atob(encoded));
    }

    return stored;
  } catch (e) {
    return localStorage.getItem("hunter_token") || "";
  }
}

export function removeSecureToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("hunter_token");
    localStorage.removeItem("m_token");
    localStorage.removeItem("token");
  } catch (e) {}
}

/**
 * Get Secure Authorization Headers dynamically
 */
export function getAuthHeaders(customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...customHeaders,
  };
  const token = getSecureToken();
  if (token && typeof token === "string" && token.trim() !== "" && token !== "undefined" && token !== "null") {
    const cleanToken = token.trim();
    headers["authorization"] = cleanToken.startsWith("Bearer ") ? cleanToken : `Bearer ${cleanToken}`;
  }
  return headers;
}

/**
 * Safely parse JSON API response to prevent SyntaxError crashes on 500 HTML responses
 */
async function safeJsonParse(response) {
  try {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn(`API response is non-JSON (${response.status}):`, text.substring(0, 150));
      return {
        status: "error",
        status_code: response.status,
        message: text.includes("Internal Server Error")
          ? "Internal Server Error (500). Please verify backend database logs or payload fields."
          : `Server returned error (${response.status}).`,
      };
    }
  } catch (err) {
    return {
      status: "error",
      message: err.message || "Failed to read response from server.",
    };
  }
}

/**
 * Register a new customer
 * @param {Object} customerData
 */
export async function registerCustomer(customerData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/register/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        first_name: customerData.firstName || "",
        last_name: customerData.lastName || "",
        email: customerData.email || "",
        mobile: customerData.mobile || "",
        password: customerData.password || "",
        subscribe: customerData.subscribe ? "on" : "off",
        ref_code: customerData.refCode || "",
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to connect to registration server.",
    };
  }
}

/**
 * Login customer
 * @param {Object} credentials
 */
export async function loginCustomer(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/customer/login/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to connect to authentication server.",
    };
  }
}

/**
 * Verify OTP Code
 * @param {Object} otpData - { email: string, otp: string }
 */
export async function verifyOTP(otpData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/verify-otp/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: otpData.email,
        otp: otpData.otp,
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to verify OTP with authentication server.",
    };
  }
}

/**
 * Request Password Reset OTP
 * @param {string} email
 */
export async function forgotPassword(email) {
  try {
    const response = await fetch(`${BASE_URL}/customer/forgot-password/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to send password reset request.",
    };
  }
}

/**
 * Reset Customer Password
 * @param {Object} resetData - { email: string, password: string, passwordConfirmation: string, otp: string|number }
 */
export async function resetPassword(resetData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/reset-password/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: resetData.email,
        password: resetData.password,
        password_confirmation: resetData.passwordConfirmation,
        otp: Number(resetData.otp),
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to reset password with authentication server.",
    };
  }
}

/**
 * Fetch Order Countries List
 */
export async function fetchCountries() {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/countries`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Countries Error:", error);
    return {
      status: "error",
      countries: [{ id: 101, name: "India" }],
    };
  }
}

/**
 * Fetch States by Country ID
 * @param {number|string} countryId
 */
export async function fetchStates(countryId = 101) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/states/${countryId}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch States Error:", error);
    return {
      status: "error",
      states: [],
    };
  }
}

/**
 * Fetch Cities/Districts by State ID
 * @param {number|string} stateId
 */
export async function fetchCities(stateId) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/cities/${stateId}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Cities Error:", error);
    return {
      status: "error",
      cities: [],
    };
  }
}

/**
 * Fetch Order Payment Methods List
 * Endpoint: POST /customer/order/payment-methods
 * Payload: { "product_list": [ { "product_id": 21, "qty": 10 } ] }
 */
export async function fetchPaymentMethods(productList = []) {
  try {
    let list = [];
    if (Array.isArray(productList)) {
      list = productList
        .filter((item) => item && (item.product_id || item.id || item.product?.id))
        .map((item) => ({
          product_id: Number(item.product_id || item.id || item.product?.id),
          qty: Number(item.qty || item.quantity || 1),
        }));
    } else if (productList && Array.isArray(productList.product_list)) {
      list = productList.product_list
        .filter((item) => item && (item.product_id || item.id || item.product?.id))
        .map((item) => ({
          product_id: Number(item.product_id || item.id || item.product?.id),
          qty: Number(item.qty || item.quantity || 1),
        }));
    }

    const payload = {
      product_list: list,
    };

    const response = await fetch(`${BASE_URL}/customer/order/payment-methods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Payment Methods Error:", error);
    return {
      status: "error",
      total_weight: 0,
      delivery_price: 130,
      advance_amount: 0,
      payment_methods: [
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
      ],
    };
  }
}

export async function fetchHomeData() {
  try {
    const response = await fetch(`${BASE_URL}/${STORE_SLUG}/home`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Home Data Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Fetch Product List by Category, Page, Search, and Price Filters
 * Endpoint: GET /hunter-mens-wear/product-list
 */
export async function fetchProductList({
  page = 1,
  product_tag = "",
  product_brand = "",
  min_price = 0,
  max_price = 0,
  filter_product = "all",
  search = "",
} = {}) {
  try {
    const paramsObj = {
      page: String(page),
      product_tag: product_tag ? String(product_tag) : "",
      product_brand: product_brand ? String(product_brand) : "",
      pagess: "",
      min_price: String(min_price || 0),
      max_price: String(max_price || 0),
      filter_product: String(filter_product || "all"),
    };

    if (search && String(search).trim() !== "") {
      paramsObj.search = String(search).trim();
    }

    const queryParams = new URLSearchParams(paramsObj);

    const response = await fetch(
      `${BASE_URL}/${STORE_SLUG}/product-list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Product List Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Fetch Single Product Details by Product Slug or ID
 * Endpoint: GET /hunter-mens-wear/product/{slug}
 */
export async function fetchProductDetails(productSlug) {
  try {
    const response = await fetch(
      `${BASE_URL}/${STORE_SLUG}/product/${productSlug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Product Details Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Process Customer Order
 * Endpoint: POST /customer/order/process/{STORE_SLUG}
 * @param {Object} orderPayload
 */
export async function processOrder(orderPayload) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/process/${STORE_SLUG}`, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json",
      }),
      body: JSON.stringify(orderPayload),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Process Order Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to process order with backend server.",
    };
  }
}

/**
 * Fetch Customer Order List with Pagination
 * Endpoint: GET /hunter-mens-wear/order-list?page={page}&limit={limit}
 * @param {Object} options - { page: 1, limit: 10 }
 */
export async function fetchOrderList({ page = 1, limit = 10 } = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await fetch(
      `${BASE_URL}/${STORE_SLUG}/order-list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Order List Error:", error);
    return {
      status: 0,
      message: error.message || "Failed to fetch order list.",
      data: {
        orders: [],
        pagination: {
          current_page: Number(page) || 1,
          per_page: Number(limit) || 10,
          total_orders: 0,
          total_pages: 1,
        },
      },
    };
  }
}

/**
 * Fetch Order Details by Order ID
 * Endpoint: GET /hunter-mens-wear/order-detail/{orderId}
 * @param {string|number} orderId
 */
export async function fetchOrderDetails(orderId) {
  try {
    const response = await fetch(
      `${BASE_URL}/${STORE_SLUG}/order-detail/${orderId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Order Details Error:", error);
    return {
      status: 0,
      message: error.message || "Failed to fetch order details.",
      data: null,
    };
  }
}



