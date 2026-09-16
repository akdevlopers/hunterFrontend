"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShield, FiLock, FiEye, FiServer, FiArrowLeft } from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="sm:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition active:scale-95 mb-1.5"
            aria-label="Go Back"
          >
            <FiArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Privacy Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-gray-700 text-sm leading-relaxed">
        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiShield className="w-5 h-5 text-purple-600" />
            <span>1. Information We Collect</span>
          </div>
          <p>
            When you visit HUNTER or make a purchase, we collect customer details such as your name, shipping address, email address, phone number, and payment preferences required to fulfill your orders.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiLock className="w-5 h-5 text-purple-600" />
            <span>2. Data Security & Encryption</span>
          </div>
          <p>
            Your sensitive checkout information is processed using 256-bit SSL encryption. We do not store raw credit card credentials on our servers.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiEye className="w-5 h-5 text-purple-600" />
            <span>3. How We Use Your Data</span>
          </div>
          <p>
            We use your data solely for order dispatch, shipping tracking updates, customer support inquiries, and optional promotional drops if subscribed.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiServer className="w-5 h-5 text-purple-600" />
            <span>4. Your Rights</span>
          </div>
          <p>
            You have the right to request access to, update, or delete your saved profile data at any time by contacting our support team at support@hunterwear.com.
          </p>
        </section>
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
