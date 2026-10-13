import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTimes, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const ChangePasswordModal = ({ onClose }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/profile/change-password",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        toast.success("Password berhasil diubah!");
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition"
        >
          <FaTimes />
        </button>

        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl mb-4">
          <FaLock />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-1">Ganti Password</h3>
        <p className="text-xs text-gray-500 mb-5">
          Masukkan kode OTP yang telah dikirim ke email Anda beserta password
          baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kode OTP (6 Digit)
            </label>
            <input
              type="text"
              name="code"
              maxLength="6"
              required
              value={formData.code}
              onChange={handleChange}
              placeholder="Masukkan kode OTP"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg tracking-widest font-bold focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password Baru
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute bottom-3 right-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password_confirmation"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition flex justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Memproses...
              </>
            ) : (
              "Simpan Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
