"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSmartphone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiShield,
  FiTruck,
  FiZap,
  FiArrowLeft,
  FiKey,
  FiX,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import { registerCustomer, loginCustomer, verifyOTP, forgotPassword, resetPassword, setSecureToken, getSecureToken } from "../../utils/api";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectPath =
    redirectParam && redirectParam !== "/login" && redirectParam !== "/register"
      ? redirectParam
      : "/";

  const { login, user, isLoaded } = useShop();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getSecureToken();
    const isValidToken =
      token &&
      typeof token === "string" &&
      token.trim() !== "" &&
      token !== "undefined" &&
      token !== "null";

    if (isValidToken || user?.isLoggedIn === true) {
      const target = redirectPath && redirectPath !== "/login" && redirectPath !== "/register" ? redirectPath : "/";
      if (typeof window !== "undefined") {
        window.location.replace(target);
      } else {
        router.replace(target);
      }
      return;
    }

    if (isLoaded) {
      setCheckingAuth(false);
    }
  }, [isLoaded, user?.isLoggedIn, redirectPath, router]);

  // Mode: "signin" | "register"
  const [authMode, setAuthMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  // Forgot & Reset Password States
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailAddress || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    const res = await loginCustomer({ email: emailAddress, password });
    setIsLoading(false);

    const isSuccess = res.status === "success" || res.status === 1 || res.status === "1" || res.success === true || (res.token && res.token.length > 10);

    if (isSuccess) {
      if (res.token) {
        setSecureToken(res.token);
      }
      const custName = res.customer
        ? `${res.customer.first_name || ""} ${res.customer.last_name || ""}`.trim()
        : emailAddress.split("@")[0];

      login({
        name: custName || "Valued Member",
        email: res.customer?.email || emailAddress,
        customer: res.customer || null,
        token: res.token || "",
      });
      setSuccessMessage("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    } else {
      setErrorMessage(res.message || "Invalid email or password. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName || !emailAddress || !password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setIsLoading(true);

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const res = await registerCustomer({
      firstName,
      lastName,
      email: emailAddress,
      mobile: mobileNumber,
      password,
      subscribe: agreeTerms,
      refCode: "",
    });

    setIsLoading(false);

    if (res.status === "success" || res.status === 1 || res.status === "1" || res.success === true) {
      setSuccessMessage(res.message || "Registration successful! An OTP has been sent to your email.");
      setShowOtpModal(true);
    } else {
      setErrorMessage(res.message || "Registration failed. Please check your credentials.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!enteredOtp) {
      setErrorMessage("Please enter the 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    const res = await verifyOTP({ email: emailAddress, otp: enteredOtp });
    setIsLoading(false);

    if (res.status === "success" || res.status === 1 || res.status === "1" || res.success === true) {
      if (res.token) {
        setSecureToken(res.token);
      }
      const custName = res.customer
        ? `${res.customer.first_name || ""} ${res.customer.last_name || ""}`.trim()
        : fullName;

      login({
        name: custName || "Valued Member",
        email: res.customer?.email || emailAddress,
        customer: res.customer || null,
        token: res.token || "",
      });
      setShowOtpModal(false);
      setSuccessMessage(res.message || "Email verified successfully! Welcome to HUNTER.");
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    } else {
      setErrorMessage(res.message || "Incorrect OTP. Please check the code sent to your email.");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!resetEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    const res = await forgotPassword(resetEmail);
    setIsLoading(false);

    if (res.status === "success" || res.status === 1 || res.status === "1" || res.success === true) {
      setShowForgotPasswordModal(false);
      setEmailAddress(resetEmail);
      setSuccessMessage(res.message || "A password reset OTP has been sent to your email.");
      setShowResetPasswordModal(true);
    } else {
      setErrorMessage(res.message || "Failed to send password reset request.");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!resetOtp) {
      setErrorMessage("Please enter the OTP code sent to your email.");
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      setErrorMessage("Please enter your new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    const res = await resetPassword({
      email: resetEmail || emailAddress,
      password: newPassword,
      passwordConfirmation: confirmNewPassword,
      otp: resetOtp,
    });
    setIsLoading(false);

    if (res.status === "success" || res.status === 1 || res.status === "1" || res.success === true) {
      setShowResetPasswordModal(false);
      setSuccessMessage(res.message || "Password has been reset successfully. Please sign in with your new password.");
      setAuthMode("signin");
      setPassword(newPassword);
    } else {
      setErrorMessage(res.message || "Failed to reset password. Please check your OTP code and try again.");
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between">
        <div>
          <TopBar />
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest font-black text-gray-500">Checking Account Status...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <TopBar />
        <Navbar />
      </div>

      {/* Mobile Back Button Header */}
      <div className="lg:hidden px-4 py-3 flex items-center justify-between border-b border-gray-200/60 bg-white">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-gray-200 transition active:scale-95"
        >
          <FiArrowLeft className="w-4 h-4 text-black" />
          <span>Back</span>
        </button>

        <Link href="/" className="text-sm font-black uppercase tracking-tight text-black">
          HUNTER
        </Link>
      </div>

      <div className="hidden sm:flex max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-2 items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-black font-semibold uppercase">
            {authMode === "signin" ? "Sign In" : "Register"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center max-w-[1450px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start w-full max-w-5xl mx-auto">
          
          {/* LEFT SIDE: Member Benefits Cards (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-6 space-y-6 pt-1 sm:pt-2">
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-[3px] text-black bg-gray-200/70 px-3 py-1 rounded-full border border-gray-300/60 mb-2">
                MEMBER BENEFITS
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Shop Smarter with <span className="underline underline-offset-4">HUNTER</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                Sign in to access exclusive streetwear drops, live order tracking, and 1-click checkout.
              </p>
            </div>

            {/* 3 Floating Rounded Benefit Cards */}
            <div className="space-y-3.5">
              <div className="p-4 sm:p-4.5 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiTruck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                    Fast & Secure Delivery
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Track your streetwear orders in real-time.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-4.5 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                    100% Secure Payments
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    256-bit encrypted checkout & protected data.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-4.5 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiZap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                    Exclusive Streetwear Drops
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Save more with VIP member-only pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Floating White Auth Card */}
          <div className="lg:col-span-6 w-full max-w-md lg:max-w-none mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-xl space-y-5 relative">
              
              {/* Brand Emblem */}
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-md">
                  H
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                  {authMode === "signin" ? "Welcome Back" : "Create an Account"}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {authMode === "signin"
                    ? "Enter your details to sign in"
                    : "Fill in information to register"}
                </p>
              </div>

              {/* Error / Success Alerts */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold text-center">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 font-bold text-center flex items-center justify-center gap-2">
                  <FiCheck className="w-4 h-4 text-green-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* SIGN IN FORM */}
              {authMode === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  
                  {/* Email Input */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-11 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 accent-black rounded cursor-pointer"
                      />
                      <span className="text-gray-600 font-semibold">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(emailAddress);
                        setShowForgotPasswordModal(true);
                        setErrorMessage("");
                      }}
                      className="font-extrabold text-black hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  {/* Register Switch Link */}
                  <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-600 font-medium">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="font-extrabold text-black underline hover:opacity-75"
                    >
                      Register here
                    </Link>
                  </div>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Mobile Number (e.g. 9876543210)"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create Password"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-11 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-xs font-semibold outline-none focus:border-black focus:bg-white transition"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 accent-black rounded cursor-pointer mt-0.5"
                    />
                    <span className="text-[11px] text-gray-600 font-medium leading-tight">
                      I agree to HUNTER's{" "}
                      <Link href="/terms" className="text-black font-bold underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-black font-bold underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    <span>{isLoading ? "Creating Account..." : "Register Account"}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-600 font-medium">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="font-extrabold text-black underline hover:opacity-75"
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowForgotPasswordModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-black font-black uppercase text-base tracking-tight">
                <FiRefreshCw className="w-5 h-5 text-black" />
                <span>Reset Password</span>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1.5 text-gray-400 hover:text-black transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Enter your registered email address below to receive a password reset OTP code.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="bobsmith1@example.com"
                    className="w-full bg-gray-50/90 border border-gray-200 rounded-full pl-11 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold outline-none focus:border-black transition"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition shadow-xl active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {isLoading ? "Sending OTP..." : "Send Reset OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowOtpModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-black font-black uppercase text-base tracking-tight">
                <FiKey className="w-5 h-5 text-black" />
                <span>Verify OTP Code</span>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-1.5 text-gray-400 hover:text-black transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              We have sent a verification OTP code to your email:{" "}
              <strong className="text-black">{emailAddress}</strong>. Please check your inbox and enter the code below.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-gray-50/90 border border-gray-200 rounded-full px-4 py-3.5 sm:py-4 text-center text-xl sm:text-2xl font-black tracking-[6px] outline-none focus:border-black transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition shadow-xl active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {isLoading ? "Verifying..." : "Verify & Complete"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset New Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowResetPasswordModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-black font-black uppercase text-base tracking-tight">
                <FiLock className="w-5 h-5 text-black" />
                <span>Create New Password</span>
              </div>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="p-1.5 text-gray-400 hover:text-black transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Enter the OTP sent to your email and create your new password for: <strong className="text-black">{emailAddress}</strong>.
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  6-Digit Reset OTP Code *
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 420194)"
                    className="w-full bg-gray-50/90 border border-gray-200 rounded-full pl-11 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold outline-none focus:border-black transition"
                  />
                  <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-50/90 border border-gray-200 rounded-full pl-11 pr-11 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold outline-none focus:border-black transition"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-gray-50/90 border border-gray-200 rounded-full pl-11 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold outline-none focus:border-black transition"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <FiCheckCircle className="w-4 h-4" />
                <span>{isLoading ? "Resetting Password..." : "Reset Password"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="hidden lg:block">
        <Footer />
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginPageContent />
    </Suspense>
  );
}
