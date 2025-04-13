"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Or PlaylistAddIcon

export default function NavigationBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="flex items-center justify-between px-6 py-3 backdrop-blur-sm text-white">
      {/* Left Section: Menu and Logo */}
      <div className="flex items-center space-x-4">
        <button className="text-white">
          <Bars3Icon className="h-8 w-8" />
        </button>
        <Link href="/" className="flex items-center space-x-2">
          {/* Placeholder Logo */}
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="text-xl font-bold text-orange-400">Lumiere</span>
        </Link>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-grow flex justify-center px-4 max-w-xl mx-auto">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="text-gray-400 h-5 w-5" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Section: Watchlist and Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/watchlist"
          className="flex items-center gap-1 text-sm hover:text-purple-400 transition-colors duration-200"
        >
          <BookmarkBorderIcon className="h-5 w-5" />
          <span>Watchlist</span>
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
