import { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaTimes,
  FaCamera,
  FaSpinner,
  FaUserCircle,
  FaLock,
} from "react-icons/fa";
import useAuth from "../context/useAuth";
import ChangePasswordModal from "./changePasswordModal"; // Import modal OTP

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatar
      ? `http://localhost:8000/storage/avatars/${user.avatar}`
      : null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isReqOtp, setIsReqOtp] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return toast.error("Ukuran maksimal 2MB");
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone_number", formData.phone_number);
    if (avatar) data.append("avatar", avatar);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/profile/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        toast.success("Profil berhasil diperbarui!");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPasswordChange = async () => {
    setIsReqOtp(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/profile/request-password-otp",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        toast.success("OTP telah dikirim ke email Anda!");
        setShowPasswordModal(true); // Buka modal ganti password
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Gagal meminta OTP. Coba lagi.");
    } finally {
      setIsReqOtp(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center relative pb-12">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/15 p-2 rounded-full transition"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-white">Profil Saya</h2>
          </div>

          <div className="relative px-6 pb-6 mt-[-40px]">
            <div className="flex justify-center mb-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center group relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-300 w-full h-full" />
                  )}
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full border-2 border-white shadow hover:bg-orange-700"
                >
                  <FaCamera className="text-xs" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="0812xxxxxx"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleRequestPasswordChange}
                  disabled={isReqOtp}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  {isReqOtp ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaLock />
                  )}{" "}
                  Ganti Password
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default ProfileModal;
