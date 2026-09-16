import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "../context/ShopContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HUNTER | Premium Men's Streetwear",
  description: "HUNTER streetwear collection - Born in the streets, engineered for men's urban culture.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      
      <body className="min-h-full flex flex-col w-full overflow-x-hidden">
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
