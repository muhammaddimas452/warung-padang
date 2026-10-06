import { useCart } from "../context/cartContext";
import useAuth from "../context/useAuth";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../components/nav";
import Footer from "../components/footer";
import {
  FaArrowLeft,
  FaReceipt,
  FaClock,
  FaCreditCard,
  FaUtensils,
  FaWalking,
  FaShieldAlt,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const tokenUser = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [statusPembayaran, setStatusPembayaran] = useState("menunggu_transfer");
  const [orderId, setOrderId] = useState(null);
  const [metodeLayanan, setMetodeLayanan] = useState("takeaway");
  const [catatan, setCatatan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const totalBelanja = cart.reduce(
    (sum, item) => sum + item.harga * item.quantity,
    0
  );

  const estimasiWaktu = () => {
    const now = new Date();
    const selesai = new Date(now.getTime() + 20 * 60000); // +20 menit
    return selesai.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmitCheckout = async () => {
    if (cart.length === 0 || isProcessing) return;

    setIsProcessing(true);

    const orderData = {
      items: cart.map((item) => ({
        menu_id: item.id,
        quantity: item.quantity,
        harga: item.harga,
      })),
      total: totalBelanja,
      metode_pembayaran: "midtrans",
      status_pembayaran: "menunggu_pembayaran",
      catatan: catatan || "",
      tipe_layanan: metodeLayanan,
    };

    try {
      // 1. Buat pesanan di backend
      const orderRes = await axios.post(
        "http://localhost:8000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${tokenUser}` },
        }
      );

      const idPesanan = orderRes.data?.data?.id || orderRes.data?.id;
      setOrderId(idPesanan);

      // 2. Minta Snap Token dari backend
      const snapRes = await axios.post(
        "http://localhost:8000/api/midtrans/token",
        {
          amount: totalBelanja,
          name: user?.name || "Pelanggan",
          email: user?.email || "pelanggan@mail.com",
          order_id: idPesanan,
        },
        {
          headers: { Authorization: `Bearer ${tokenUser}` },
        }
      );

      const snapToken = snapRes.data.snapToken;

      // 3. Panggil Snap SDK
      if (!window.snap) {
        alert("Midtrans Snap belum dimuat. Mohon muat ulang halaman.");
        setIsProcessing(false);
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("✅ Payment Success:", result);
          setStatusPembayaran("sudah_transfer");
          setShowPopup(true);
          setIsProcessing(false);
        },
        onPending: function (result) {
          console.log("⏳ Payment Pending:", result);
          setStatusPembayaran("menunggu_transfer");
          setShowPopup(true);
          setIsProcessing(false);
        },
        onError: function (result) {
          console.error("❌ Payment Failed:", result);
          alert("Pembayaran gagal atau dibatalkan.");
          setIsProcessing(false);
        },
        onClose: function () {
          console.log("User closed payment popup");
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("❌ Gagal kirim pesanan atau ambil Snap Token:", error);
      alert("Terjadi kesalahan saat memproses pesanan. Periksa koneksi.");
      setIsProcessing(false);
    }
  };

  // Poll status pembayaran pesanan jika popup terbuka atau orderId ada
  const checkStatus = useCallback(async () => {
    if (!orderId || !tokenUser) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${tokenUser}` },
        }
      );
      const latestStatus = res.data?.data?.status_pembayaran;
      if (latestStatus) {
        setStatusPembayaran(latestStatus);
      }
    } catch (error) {
      console.error("Gagal cek status pesanan:", error);
    }
  }, [orderId, tokenUser]);

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(checkStatus, 7000);
    return () => clearInterval(interval);
  }, [orderId, checkStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/70">
      <Nav />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-14">
        <div className="max-w-5xl mx-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-orange-600 mb-2 transition"
              >
                <FaArrowLeft />
                <span>Kembali Belanja</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2.5">
                <FaReceipt className="text-orange-500 text-2xl" />
                <span>Checkout Pesanan</span>
              </h1>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-orange-100/70 text-orange-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <FaShieldAlt className="text-orange-600" />
              <span>Pembayaran Aman & Terenkripsi</span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaReceipt />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Tidak Ada Item untuk Di-checkout
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Keranjang belanja kamu saat ini kosong.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl shadow hover:shadow-md transition inline-block"
              >
                Kembali Pilih Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Order Items & Preferences (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* List Menu */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/80">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
                    <span>Daftar Hidangan ({cart.length} item)</span>
                    <span className="text-xs text-orange-600 font-semibold">
                      Resto Padang Minang
                    </span>
                  </h2>

                  <ul className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <li key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                        <img
                          src={
                            item.gambar
                              ? `http://localhost:8000/image/${item.gambar}`
                              : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={item.nama}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 bg-gray-100 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80";
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} porsi × Rp {Number(item.harga).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <p className="text-sm font-extrabold text-gray-900 shrink-0">
                          Rp {(item.harga * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tipe Layanan (Takeaway vs Dine-in) */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/80">
                  <h2 className="text-base font-bold text-gray-800 mb-3">
                    Pilihan Penyajian
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMetodeLayanan("takeaway")}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                        metodeLayanan === "takeaway"
                          ? "border-orange-500 bg-orange-50/70 text-orange-950 font-semibold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <FaWalking className="text-base" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block">Bungkus / Take Away</span>
                        <span className="text-[11px] text-gray-500">Bawa pulang rapi</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodeLayanan("dinein")}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                        metodeLayanan === "dinein"
                          ? "border-orange-500 bg-orange-50/70 text-orange-950 font-semibold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <FaUtensils className="text-base" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block">Makan di Tempat</span>
                        <span className="text-[11px] text-gray-500">Sajikan di meja</span>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Catatan untuk Dapur (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sambal dipisah, kuah gulai dibanyakin..."
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Summary & Payment (5 cols) */}
              <div className="lg:col-span-5 sticky top-24 space-y-5">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-100">
                  <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100">
                    Ringkasan Pembayaran
                  </h2>

                  {/* Customer Info */}
                  <div className="py-3 border-b border-gray-100 text-xs">
                    <span className="text-gray-400 block mb-0.5">Pemesan:</span>
                    <p className="font-bold text-gray-800 text-sm">{user?.name || "Pelanggan"}</p>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>

                  {/* Estimation */}
                  <div className="my-4 p-3 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
                    <FaClock className="text-amber-600 text-sm shrink-0" />
                    <span>
                      Estimasi pesanan selesai disiapkan sekitar pukul{" "}
                      <strong>{estimasiWaktu()}</strong>
                    </span>
                  </div>

                  {/* Payment method selection */}
                  <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Metode Pembayaran
                    </label>
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                          <FaCreditCard className="text-sm" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Bayar Online (Midtrans)
                          </p>
                          <p className="text-[11px] text-gray-500">
                            QRIS, GoPay, ShopeePay, Transfer Bank
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Instan
                      </span>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal Makanan</span>
                      <span>Rp {totalBelanja.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Layanan & Pajak</span>
                      <span className="text-emerald-600 font-semibold">Gratis (Rp 0)</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Bayar</span>
                      <span className="text-orange-600">
                        Rp {totalBelanja.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitCheckout}
                    disabled={isProcessing}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="animate-spin text-base" />
                        <span>Menyiapkan Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-base" />
                        <span>Bayar Sekarang • Rp {totalBelanja.toLocaleString("id-ID")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Payment Information Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-orange-100 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              <FaCreditCard />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Status Pembayaran Pesanan
            </h3>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
              <span className="text-xs text-gray-500 block mb-1">Kode Pesanan:</span>
              <span className="text-sm font-extrabold text-orange-600">
                #{orderId}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
              {statusPembayaran === "sudah_transfer"
                ? "✅ Pembayaran berhasil diterima! Pesanan kamu sedang mulai diracik oleh koki kami."
                : "⏳ Menunggu konfirmasi pembayaran. Jika sudah membayar di Midtrans, sistem akan memperbarui otomatis."}
            </p>

            <button
              onClick={() => {
                setShowPopup(false);
                clearCart();
                navigate("/my-orders");
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow transition cursor-pointer text-sm"
            >
              Lihat Riwayat Pesanan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
