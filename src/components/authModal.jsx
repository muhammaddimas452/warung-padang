import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSpinner,
  FaUtensils,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import useAuth from "../context/useAuth";

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    setUser,
  } = useAuth();

  const navigate = useNavigate();
  const firstInputRef = useRef(null);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll when modal is open & handle ESC key
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.classList.add("overflow-hidden");
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeAuthModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      // Autofocus first input
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);

      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isAuthModalOpen, authModalTab, closeAuthModal]);

  // Clear errors when switching tabs
  const handleTabChange = (tab) => {
    setErrorMsg("");
    setAuthModalTab(tab);
  };

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleRegisterChange = (e) => {
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setErrorMsg("Email dan password wajib diisi");
      toast.error("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (data.success) {
        const user = data.user;
        toast.success(`Selamat datang kembali, ${user.name || "Pelanggan"}!`);

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        closeAuthModal();

        // Reset form
        setLoginForm({ email: "", password: "" });

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
      } else {
        const msg = data.message || "Email atau password salah";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = "Gagal terhubung ke server. Periksa koneksi backend.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirm
    ) {
      setErrorMsg("Semua field wajib diisi");
      toast.error("Semua field wajib diisi");
      return;
    }

    if (registerForm.password.length < 6) {
      setErrorMsg("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (registerForm.password !== registerForm.confirm) {
      setErrorMsg("Konfirmasi password tidak cocok");
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          password_confirmation: registerForm.confirm,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registrasi berhasil! Silakan masuk dengan akun Anda.");

        // Pre-fill email in login form
        setLoginForm((prev) => ({
          ...prev,
          email: registerForm.email,
          password: "",
        }));

        // Reset register form
        setRegisterForm({
          name: "",
          email: "",
          password: "",
          confirm: "",
        });

        // Switch to login tab
        setAuthModalTab("login");
      } else {
        const msg = data.message || "Registrasi gagal, coba lagi.";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg = "Terjadi kesalahan saat registrasi. Periksa koneksi server.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Padang Theme Gradient */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white text-center relative overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Tutup modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/15 hover:bg-black/30 p-2 rounded-full transition-all duration-200"
          >
            <FaTimes className="text-base" />
          </button>

          {/* Logo badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner mb-3 border border-white/30 text-amber-200">
            <FaUtensils className="text-xl" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            Resto Padang Asli
          </h3>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            {authModalTab === "login"
              ? "Masuk untuk memesan masakan Minang favoritmu"
              : "Daftar akun baru dan nikmati kelezatan masakan Padang"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-5">
          <div className="flex bg-orange-50/80 p-1 rounded-2xl border border-orange-200/60">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                authModalTab === "login"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-orange-600"
              }`}
            >
              <FaSignInAlt className="text-xs" />
              Masuk
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                authModalTab === "register"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-orange-600"
              }`}
            >
              <FaUserPlus className="text-xs" />
              Daftar
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalTab === "login" ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    ref={firstInputRef}
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transform active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Sedang Masuk...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Masuk Sekarang</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("register")}
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                >
                  Daftar di sini
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaUser className="text-sm" />
                  </div>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm"
                    required
                    placeholder="Ulangi password"
                    value={registerForm.confirm}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transform active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("login")}
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
