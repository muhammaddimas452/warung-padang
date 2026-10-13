import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelopeOpenText, FaSpinner, FaTimes } from "react-icons/fa";
// import useAuth from "../context/useAuth";

const VerifyOTPModal = ({ email, onClose, onSuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  //   const { login } = useAuth(); // Asumsi kamu punya fungsi login di context

  // 👈 State untuk Timer 60 detik
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Efek untuk menghitung mundur
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Handle input pergantian kotak (auto-focus ke kotak berikutnya)
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Pindah ke input berikutnya jika diisi
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = code.join("");

    if (otpString.length < 6) {
      toast.error("Masukkan 6 digit kode verifikasi");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await axios.post("http://localhost:8000/api/verify-email", {
        email: email,
        code: otpString,
      });

      if (res.data.success) {
        toast.success("Verifikasi berhasil! Selamat datang.");

        // Simpan token dan user ke localStorage/Context
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Jika ada fungsi setter context (sesuaikan dengan cara kerjamu)
        // login(res.data.user, res.data.token);

        onSuccess(res.data.user); // Tutup modal dan refresh/redirect
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Kode verifikasi salah");
      setCode(["", "", "", "", "", ""]); // Reset input
      document.getElementById("otp-0").focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // 👈 Fungsi Kirim Ulang OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      const res = await axios.post("http://localhost:8000/api/resend-otp", {
        email,
      });
      if (res.data.success) {
        toast.success("Kode OTP baru berhasil dikirim!");
        setTimeLeft(60); // Reset timer 1 menit
        setCanResend(false);
        setCode(["", "", "", "", "", ""]); // Bersihkan input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim ulang kode");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-orange-100 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
        >
          <FaTimes className="text-sm" />
        </button>

        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-5 text-3xl">
          <FaEnvelopeOpenText />
        </div>

        <h3 className="text-xl font-extrabold text-gray-800 mb-2">
          Cek Email Kamu
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Kami telah mengirimkan 6 digit kode verifikasi ke <br />
          <span className="font-bold text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center text-lg font-extrabold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi Akun"
            )}
          </button>
        </form>

        {/* 👈 Tampilan Resend OTP dengan Timer */}
        <div className="mt-6 text-[11px] text-gray-500">
          Belum menerima email?{" "}
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-orange-600 font-bold hover:underline cursor-pointer"
            >
              {isResending ? "Mengirim..." : "Kirim Ulang Kode"}
            </button>
          ) : (
            <span className="font-semibold text-gray-400">
              Kirim ulang dalam {timeLeft}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPModal;
