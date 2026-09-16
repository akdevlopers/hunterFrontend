"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiUser,
  FiPackage,
  FiShield,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiLogIn,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { useShop } from "../src/context/ShopContext";

export default function AccountDrawer({ isOpen, onClose }) {
  const { user, login, logout } = useShop();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Account Panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-wider text-black">
            My Account
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-black transition rounded-full bg-white border border-gray-200"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-6 border-b border-gray-100 bg-white">
          {user && user.isLoggedIn ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-black text-white font-black text-sm flex items-center justify-center shadow">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "AM"}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-black">{user.name}</h3>
                  <p className="text-xs text-gray-500 font-medium truncate max-w-[170px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition flex items-center gap-1 text-xs font-bold"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 font-black text-sm flex items-center justify-center">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-black">Guest Account</h3>
                  <p className="text-xs text-gray-500">Sign in to track orders & details</p>
                </div>
              </div>

              {/* Login / Register Trigger */}
              <Link
                href="/login"
                onClick={onClose}
                className="w-full bg-black text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Account Options Navigation List */}
        <div className="flex-1 p-4 space-y-1">
          {/* My Orders */}
          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <FiPackage className="w-4 h-4" />
              </div>
              <span>My Orders</span>
            </div>
            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Privacy Policy */}
          <Link
            href="/privacy"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <FiShield className="w-4 h-4" />
              </div>
              <span>Privacy Policy</span>
            </div>
            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Terms & Conditions */}
          <Link
            href="/terms"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <FiFileText className="w-4 h-4" />
              </div>
              <span>Terms & Conditions</span>
            </div>
            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Help & Support */}
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <FiHelpCircle className="w-4 h-4" />
              </div>
              <span>Help & Support</span>
            </div>
            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
            HUNTER Streetwear App v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
