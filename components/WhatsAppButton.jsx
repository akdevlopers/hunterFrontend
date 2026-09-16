"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917339572103"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white"
    >
      <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
}
