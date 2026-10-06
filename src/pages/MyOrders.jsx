import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaBoxOpen,
  FaCreditCard,
  FaClock,
  FaSyncAlt,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import Nav from "../components/nav";
import Footer from "../components/footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const tokenUser = localStorage.getItem("token");

  const fetchOrders = useCallback(async (showIndicator = false) => {
    if (!tokenUser) {
      setIsLoading(false);
      return;
    }
    if (showIndicator) setIsRefreshing(true);

    try {
      const res = await axios.get("http://localhost:8000/api/my-orders", {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      setOrders(res.data?.data || []);
    } catch (error) {
      console.error("❌ Gagal ambil riwayat pesanan:", error);
    } finally {
      setIsLoading(false);
      if (showIndicator) setIsRefreshing(false);
    }
  }, [tokenUser]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "selesai":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          text: "Selesai",
          icon: <FaCheckCircle className="text-emerald-500" />,
        };
      case "siap_diambil":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          text: "Siap Diambil",
          icon: <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />,
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          text: "Sedang Diproses",
          icon: <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />,
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "proses")
      return order.status !== "selesai" && order.status !== "siap_diambil";
    if (statusFilter === "siap") return order.status === "siap_diambil";
    if (statusFilter === "selesai") return order.status === "selesai";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/70">
      <Nav />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-14">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-orange-600 mb-2 transition"
              >
                <FaArrowLeft />
                <span>Kembali ke Beranda</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2.5">
                <FaClipboardList className="text-orange-500 text-2xl" />
                <span>Riwayat Pesanan Anda</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => fetchOrders(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 rounded-full text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <FaSyncAlt className={`text-xs ${isRefreshing ? "animate-spin text-orange-500" : ""}`} />
                <span>Perbarui Data</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {[
              { id: "all", label: "Semua Pesanan" },
              { id: "proses", label: "Sedang Diproses" },
              { id: "siap", label: "Siap Diambil" },
              { id: "selesai", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-3"
                >
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaBoxOpen />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Belum Ada Riwayat Pesanan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                Pesanan lezat yang kamu buat akan otomatis tercatat dan dapat dipantau statusnya di sini.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl shadow hover:shadow-md transition inline-block text-sm"
              >
                Mulai Pesan Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const isPaid = order.status_pembayaran === "sudah_transfer";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition border border-orange-100/70"
                  >
                    {/* Top Row: Order ID, Date, and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-gray-900 text-base">
                          🧾 Pesanan #{order.id}
                        </span>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.text}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FaClock className="text-gray-400" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Dish items */}
                    <div className="py-4">
                      <ul className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center text-xs sm:text-sm text-gray-700 bg-gray-50/80 px-3.5 py-2 rounded-xl"
                          >
                            <span className="font-medium truncate max-w-xs sm:max-w-md">
                              🍽️ {item.menu?.nama || "Menu Minang"}
                            </span>
                            <span className="font-semibold text-gray-900 shrink-0">
                              {item.quantity}x • Rp {(item.harga * item.quantity).toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Total & Payment Status */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Status Pembayaran:</span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <FaCreditCard className="text-[10px]" />
                          {isPaid ? "Lunas" : "Menunggu Transfer"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-xs text-gray-500">Total Pembayaran:</span>
                        <span className="text-base font-extrabold text-orange-600">
                          Rp {Number(order.total).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
