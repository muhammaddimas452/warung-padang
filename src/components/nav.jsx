import logo from "../assets/image/Merah Coklat Tradisional Rumah Makan Padang Logo.png";
import profile from "../assets/image/inboc.png";
import cartImg from "../assets/image/Cart.png";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useCart } from "../context/cartContext";
import CartDrawer from "./cartDrawer";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaHistory,
  FaUserShield,
} from "react-icons/fa";

const Nav = ({ onSearch }) => {
  const handleSearch = (e) => onSearch && onSearch(e.target.value);
  const [showCart, setShowCart] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100 px-4 md:px-14 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo Rumah Makan Padang" className="h-[60px] w-auto object-contain" />
        </Link>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Quick Cart on Mobile */}
          <div className="relative">
            <img
              src={cartImg}
              className="h-10 w-10 cursor-pointer rounded-full border border-orange-300 hover:border-orange-400"
              alt="Keranjang"
              onClick={() => setShowCart(true)}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-gray-700 hover:bg-orange-50 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Cari rendang, ayam pop, gulai tunjang..."
              className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-full bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Profile & Cart - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Quick Login / Register button if not logged in */}
          {!user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-full transition flex items-center gap-1.5 cursor-pointer"
              >
                <FaSignInAlt className="text-xs" />
                Masuk
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <FaUserPlus className="text-xs" />
                Daftar
              </button>
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-orange-50 transition"
              onClick={() => setOpen(!open)}
            >
              <img
                src={profile}
                alt="Profile"
                className="h-[46px] w-[46px] rounded-full border-2 border-orange-300 hover:border-orange-500 object-cover transition"
              />
              {user && (
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.name}
                </span>
              )}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-orange-100 rounded-2xl shadow-xl z-50 text-sm overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                {!user ? (
                  <>
                    <div className="px-4 py-3 bg-orange-50/60 border-b border-orange-100">
                      <p className="text-xs font-semibold text-gray-700">Akun Pelanggan</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Masuk untuk memesan lebih cepat</p>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(false);
                        openAuthModal("login");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-2.5 transition cursor-pointer font-medium"
                    >
                      <FaSignInAlt className="text-orange-500 text-sm" />
                      Masuk (Login)
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        openAuthModal("register");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-2.5 transition cursor-pointer font-medium"
                    >
                      <FaUserPlus className="text-orange-500 text-sm" />
                      Daftar Akun Baru
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                      <p className="text-xs text-gray-500">Masuk sebagai</p>
                      <p className="font-bold text-gray-800 truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-orange-100 text-orange-700">
                        {user.role === "admin" ? "Admin Resto" : "Pelanggan"}
                      </span>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition"
                      >
                        <FaUserShield className="text-orange-500" />
                        Dashboard Admin
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition"
                    >
                      <FaHistory className="text-orange-500" />
                      Riwayat Pesanan
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition cursor-pointer font-medium"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      Keluar (Logout)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <button
              onClick={() => setShowCart(true)}
              aria-label="Buka keranjang"
              className="relative p-1 rounded-full hover:bg-orange-50 transition cursor-pointer"
            >
              <img
                src={cartImg}
                className="h-[46px] w-[46px] rounded-full border-2 border-orange-300 hover:border-orange-500 transition object-cover"
                alt="Keranjang"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-orange-100 space-y-3 pb-2 animate-in fade-in duration-150">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Cari menu Padang..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {!user ? (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-orange-600 border border-orange-300 rounded-xl hover:bg-orange-50 transition flex items-center justify-center gap-1.5"
              >
                <FaSignInAlt className="text-xs" />
                Masuk
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("register");
                }}
                className="flex-1 py-2.5 text-center text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-1.5"
              >
                <FaUserPlus className="text-xs" />
                Daftar
              </button>
            </div>
          ) : (
            <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={profile}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-orange-300 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-orange-600 font-medium">
                    {user.role === "admin" ? "Admin Restoran" : "Pelanggan"}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-orange-200/60 space-y-1">
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-white transition"
                  >
                    <FaUserShield className="text-orange-500" />
                    Dashboard Admin
                  </Link>
                )}

                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-white transition"
                >
                  <FaHistory className="text-orange-500" />
                  Riwayat Pesanan
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-white transition text-left"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
