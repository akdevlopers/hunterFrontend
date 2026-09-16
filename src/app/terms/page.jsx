"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiFileText, FiTruck, FiRefreshCw, FiCheckSquare, FiArrowLeft } from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

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

          {/* Desktop View: Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Terms & Conditions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Terms & Conditions
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-gray-700 text-sm leading-relaxed">
        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiFileText className="w-5 h-5 text-purple-600" />
            <span>1. General Terms</span>
          </div>
          <p>
            By accessing and purchasing from HUNTER, you agree to comply with our store policies and terms of service. All streetwear products are subject to availability.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiTruck className="w-5 h-5 text-purple-600" />
            <span>2. Orders & Shipping</span>
          </div>
          <p>
            Orders are processed within 24-48 business hours. Shipping charges are calculated and applied at the time of payment. Expected delivery timelines are estimated based on courier dispatch.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiRefreshCw className="w-5 h-5 text-purple-600" />
            <span>3. Returns & Exchanges</span>
          </div>
          <p>
            We offer a 14-day hassle-free exchange and return window for unworn items in original packaging with tags intact.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-black font-black text-base uppercase">
            <FiCheckSquare className="w-5 h-5 text-purple-600" />
            <span>4. Intellectual Property</span>
          </div>
          <p>
            All HUNTER graphics, brand logos, product photography, and designs are proprietary intellectual property.
          </p>
        </section>
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
