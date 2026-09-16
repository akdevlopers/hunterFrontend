import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#111111] text-white mt-8 sm:mt-12 hidden lg:block">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-12 lg:py-16">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="relative h-8 sm:h-10 w-36 sm:w-48 block">
              <Image
                src="/images/logo.png"
                alt="HUNTER Logo"
                fill
                className="object-contain object-left invert brightness-200"
              />
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Hunter Mens Wear — Premium men's streetwear inspired by modern urban culture. Designed for those who live boldly.
            </p>

            <div className="space-y-2 text-xs text-gray-400 pt-2">
              <p className="flex items-center gap-2">
                <FiPhone className="text-white w-4 h-4 flex-shrink-0" />
                <a href="tel:+919487826087" className="hover:text-white transition">+91 94878 26087</a>
              </p>
              <p className="flex items-center gap-2">
                <FaWhatsapp className="text-green-500 w-4 h-4 flex-shrink-0" />
                <a href="https://wa.me/917339572103" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">+91 73395 72103</a>
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition">All Streetwear</Link></li>
              <li><Link href="/products?category=4" className="hover:text-white transition">T-Shirt</Link></li>
              <li><Link href="/products?category=19" className="hover:text-white transition">Zipper Jacket</Link></li>
              <li><Link href="/products?category=23" className="hover:text-white transition">Shorts</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              Information
            </h3>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=917339572103&text=I+want+to+track+my+order&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Tracking
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=917339572103&text=Hello+Support&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Support
                </a>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div>
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              My Account
            </h3>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-gray-400">
              <li><Link href="/account" className="hover:text-white transition">My Profile</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Order History</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 sm:mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Hunter Mens Wear. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-lg">
            <a href="https://www.instagram.com/hunterclothing.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white text-gray-400 transition">
              <FiInstagram />
            </a>
            <a href="https://wa.me/917339572103" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-green-500 text-gray-400 transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}