import Link from "next/link";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export default function NavigationBar() {
  return (
    <nav className="bg-opacity-80 p-4 backdrop-blur-sm">
      <div className="container mx-auto grid grid-cols-3 items-center gap-4">
        {/* Left Section: Hamburger Menu & Logo */}
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
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section: Watchlist, Sign Up, Login */}
        <div className="flex items-center justify-end space-x-6">
          <button className="flex items-center text-white hover:text-purple-400 space-x-1">
            <BookmarkIcon className="h-6 w-6" />
            <span>Watchlist</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Sign Up
          </button>
          <button className="bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
