"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";

export default function SupportPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Shipping charges are applied at the time of payment.",
    },
    {
      q: "How can I track my order?",
      a: "You can track your order live from the My Orders page or via the tracking link sent to your registered email upon dispatch.",
    },
    {
      q: "What is your return & exchange policy?",
      a: "We offer a 14-day exchange window for all unworn streetwear items in original condition with tags attached.",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, and online wallets via Razorpay secure checkout.",
    },
  ];

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Formatted message payload for WhatsApp
    const text = `Hi Hunter Mens Wear,\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\nInquiry Message:\n${message.trim()}`;
    const whatsappUrl = `https://wa.me/917339572103?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <span className="text-black font-semibold">Help & Support</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Help & Support
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* Support Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <a
            href="mailto:support@hunterwear.com"
            className="p-5 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200/80 text-center hover:bg-gray-100 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition">
              <FiMail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-black uppercase">Email Support</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 truncate">support@hunterwear.com</p>
          </a>

          <a
            href="tel:+919487826087"
            className="p-5 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200/80 text-center hover:bg-gray-100 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition">
              <FiPhone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-black uppercase">Phone Assistance</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-semibold">+91 94878 26087</p>
          </a>

          <a
            href="https://wa.me/917339572103"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 sm:p-6 bg-green-50/60 rounded-2xl sm:rounded-3xl border border-green-200/80 text-center hover:bg-green-100/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition">
              <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-green-900 uppercase">WhatsApp Chat</h3>
            <p className="text-[11px] sm:text-xs text-green-700 mt-1 font-semibold">+91 73395 72103</p>
          </a>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-black mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-xs sm:text-sm font-bold text-black uppercase gap-2"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <FiChevronUp className="flex-shrink-0" /> : <FiChevronDown className="flex-shrink-0" />}
                </button>
                {activeFaq === idx && (
                  <div className="p-3.5 sm:p-4 pt-0 text-xs text-gray-600 border-t border-gray-200/50 bg-white leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-5 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200/80">
          <h2 className="text-lg sm:text-xl font-black uppercase text-black mb-1.5">Send Us A Message</h2>
          <p className="text-xs text-gray-500 mb-5 sm:mb-6">Have a question about your order or drop size? Drop us a line below.</p>

          {submitted ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl sm:rounded-2xl border border-green-200 flex items-center gap-3 text-xs font-bold">
              <FiCheck className="w-5 h-5 text-green-600 stroke-[3] flex-shrink-0" />
              <span>Thank you! Your message has been sent. We'll reply within 24 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-black outline-none focus:border-black transition"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-black outline-none focus:border-black transition"
                />
              </div>

              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-xs font-semibold text-black outline-none focus:border-black resize-none transition"
              />

              <button
                type="submit"
                className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <FiSend className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
