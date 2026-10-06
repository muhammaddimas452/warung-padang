import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#34D399", "#F59E0B", "#EF4444"];

const AdminDashboard = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [menus, setMenus] = useState([]);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dataPesanan, setDataPesanan] = useState([]);
  const [activeSection, setActiveSection] = useState("analytics");
  const [summaryHarian, setSummaryHarian] = useState([]);
  const [menuTerlaris, setMenuTerlaris] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [summary, setSummary] = useState({
    total_income: 0,
    total_order: 0,
    total_sukses: 0,
    total_gagal: 0,
    metode: [],
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("❌ Gagal fetch ringkasan:", err);
    }
  };

  const fetchSummaryHarian = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/summary-harian",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSummaryHarian(res.data.reverse()); // reverse supaya dari hari lama ke baru
    } catch (err) {
      console.error("Gagal fetch summary harian:", err);
    }
  };

  const fetchMenuTerlaris = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/statistik/menu-terlaris",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMenuTerlaris(res.data);
    } catch (err) {
      console.error("Gagal fetch menu terlaris:", err);
    }
  };

  const filteredMenus = menus.filter((menu) => {
    const matchNama = menu.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchKategori =
      selectedCategory === "" || menu.category?.name === selectedCategory;
    return matchNama && matchKategori;
  });

  const [form, setForm] = useState({
    nama: "",
    harga: "",
    deskripsi: "",
    category_id: "",
    gambar: null,
  });

  const [editForm, setEditForm] = useState({
    id: "",
    nama: "",
    harga: "",
    deskripsi: "",
    category_id: "",
    gambar: null,
  });

  const handleTambahMenu = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        "http://localhost:8000/api/admin/menus",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Menu berhasil ditambahkan!");

      setForm({
        nama: "",
        harga: "",
        deskripsi: "",
        category_id: "",
        gambar: null,
      });
      setShowModal(false);
      fetchMenus(); // refresh data
    } catch (err) {
      toast.error("Gagal tambah menu");
      console.error(err);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("_method", "PUT");
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === "gambar" && value === null) return; // abaikan jika gambar tidak diubah
      if (value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    try {
      await axios.post(
        `http://localhost:8000/api/admin/menus/${editForm.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Menu berhasil diupdate!");
      setEditModalOpen(false);
      fetchMenus(); // reload data
    } catch (err) {
      toast.error("Gagal update menu");
      console.error(err);
    }
  };

  const handleEditClick = (menu) => {
    setEditForm({
      id: menu.id,
      nama: menu.nama,
      harga: menu.harga,
      deskripsi: menu.deskripsi || "",
      category_id: menu.category?.id || "",
      gambar: null,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/menus/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Menu berhasil dihapus!");
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchMenus(); // refresh tampilan
    } catch (err) {
      toast.error("Gagal hapus menu");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
    console.log(setShowLogoutConfirm);
  };

  const fetchMenus = async () => {
    if (!token) {
      console.warn("🚫 Tidak ada token admin, data tidak bisa dimuat");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/admin/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(res.data.data);
      console.log(token);
    } catch (err) {
      console.error("Gagal fetch menu:", err);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories");
      setKategoriList(res.data.data);
      console.log("Kategori:", res.data.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    }
  };

  const fetchPesanan = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataPesanan(res.data.data);
    } catch (error) {
      console.error("❌ Gagal mengambil data pesanan:", error);
    }
  };

  const updateStatusPesanan = async (id, status) => {
    fetchPesanan();
    await axios.put(
      `http://localhost:8000/api/orders/${id}/update-status`,
      {
        status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const updateBestSeller = async (menuId, isChecked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Kamu belum login");
        return;
      }

      const data = {
        best_seller: isChecked ? 1 : 0,
      };

      const res = await axios.put(
        `http://localhost:8000/api/menus/${menuId}/best-seller`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Status best seller berhasil diubah!");
        fetchMenus();
      } else {
        toast.error("Gagal mengubah status best seller");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat update best seller");
      console.error("❌ Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMenus(); // ambil menu
    fetchKategori(); // ambil kategori
    const interval = setInterval(() => {
      fetchPesanan(); // fungsi untuk ambil data dari backend
    }, 7000); // setiap 7 detik
    fetchSummary();
    fetchSummaryHarian();
    fetchMenuTerlaris();

    return () => clearInterval(interval); // bersihkan saat komponen unmount
  }, [fetchMenuTerlaris, fetchMenus, fetchPesanan, fetchSummary, fetchSummaryHarian]);

  return (
    <div className="flex min-h-screen bg-gray-50/80 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky z-40 top-0 left-0 w-64 bg-white p-6 shadow-sm border-r border-orange-100/80 flex flex-col justify-between transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 h-screen overflow-y-auto`}
      >
        <div>
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-orange-600 tracking-tight flex items-center gap-2">
                <span>🍽️</span>
                <span>Resto Admin</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Rumah Makan Padang Minang</p>
            </div>
            <button
              className="text-gray-400 hover:text-orange-600 text-lg md:hidden p-1.5 rounded-lg hover:bg-orange-50 transition"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ✕
            </button>
          </div>
          <nav className="space-y-1.5">
            {[
              { label: "Statistik & Ringkasan", value: "analytics", icon: "📊" },
              { label: "Manajemen Menu", value: "menu", icon: "📋" },
              { label: "Daftar Pesanan", value: "orders", icon: "🧾" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setActiveSection(item.value);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-2.5 text-left w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeSection === item.value
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
          >
            ← Kembali ke Web
          </a>
          <button
            onClick={() => handleLogout()}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition cursor-pointer"
          >
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 transition-all duration-300 overflow-x-hidden">
        <header className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-orange-600 text-2xl p-2 rounded-xl bg-white border border-gray-200"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Dashboard Manajemen Restoran
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Pantau pesanan, omset harian, dan menu terlaris secara real-time
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-orange-100/70 text-orange-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Online</span>
          </div>
        </header>

        {/* Statistik Ringkas */}
        {activeSection === "analytics" && (
          <>
            <section
              id="analytics"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
            >
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Total Pendapatan
                  </h3>
                  <p className="text-2xl font-extrabold text-emerald-600">
                    Rp {summary.total_income.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                  💰
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Total Menu
                  </h3>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {menus.length} Hidangan
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                  🍛
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Total Pesanan
                  </h3>
                  <p className="text-2xl font-extrabold text-purple-600">
                    {summary.total_order} Order
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                  🧾
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Status Pesanan
                  </h3>
                  <p className="text-base font-extrabold text-gray-800">
                    <span className="text-emerald-600">✅ {summary.total_sukses}</span> / <span className="text-amber-600">⌛ {summary.total_pending}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
              </div>
            </section>

            {/* Grafik Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Grafik Total Transaksi Harian */}
              <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span>
                  <span>Grafik Total Transaksi Harian</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summaryHarian}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="tanggal" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #fed7aa" }} />
                    <Legend />
                    <Bar
                      dataKey="total"
                      fill="#f97316"
                      radius={[6, 6, 0, 0]}
                      name="Total Transaksi"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Grafik Menu Terlaris */}
              <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🍛</span>
                  <span>Menu Paling Banyak Dipesan</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={menuTerlaris}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                    <YAxis dataKey="nama" type="category" width={110} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #fed7aa" }} />
                    <Legend />
                    <Bar
                      dataKey="total_terjual"
                      fill="#ea580c"
                      radius={[0, 6, 6, 0]}
                      name="Porsi Terjual"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Daftar Menu */}
        {activeSection === "menu" && (
          <section id="menu" className="mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="🔍 Cari nama menu..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl w-full sm:w-1/2 shadow-2xs text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <select
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl w-full sm:w-1/2 shadow-2xs text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">📂 Semua Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.name}>
                      {kategori.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>➕</span>
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <table className="min-w-full text-sm text-gray-800">
                  <thead className="bg-orange-50/80 text-gray-700 text-xs font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-orange-100">
                    <tr>
                      <th className="px-4 py-3.5 text-center">No.</th>
                      <th className="px-4 py-3.5">Nama Menu</th>
                      <th className="px-4 py-3.5">Harga</th>
                      <th className="px-4 py-3.5">Deskripsi</th>
                      <th className="px-4 py-3.5 text-center">Gambar</th>
                      <th className="px-4 py-3.5 text-center">Best Seller</th>
                      <th className="px-4 py-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menus.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-8 text-gray-500"
                        >
                          Tidak ada data menu ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredMenus.map((menu, index) => (
                        <tr
                          key={menu.id}
                          className="hover:bg-orange-50/40 transition"
                        >
                          <td className="px-4 py-3 text-center text-xs text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{menu.nama}</td>
                          <td className="px-4 py-3 font-bold text-orange-600">
                            Rp {parseInt(menu.harga).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{menu.deskripsi || "-"}</td>
                          <td className="px-4 py-3 text-center">
                            <img
                              src={`http://localhost:8000/image/${menu.gambar}`}
                              alt={menu.nama}
                              className="w-12 h-12 object-cover rounded-xl mx-auto border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80";
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-orange-500 cursor-pointer"
                              checked={!!menu.is_best_seller}
                              onChange={(e) =>
                                updateBestSeller(menu.id, e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(menu)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(menu.id)}
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Daftar Pesanan */}
        {activeSection === "orders" && (
          <section id="orders" className="mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🧾</span>
              <span>Daftar Pesanan Masuk</span>
            </h2>
            <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-orange-50/80 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-orange-100">
                    <tr>
                      <th className="px-4 py-3.5 text-center">No.</th>
                      <th className="px-4 py-3.5">Nama Pelanggan</th>
                      <th className="px-4 py-3.5">Kode Pesanan</th>
                      <th className="px-4 py-3.5">Total Bayar</th>
                      <th className="px-4 py-3.5">Status Pesanan</th>
                      <th className="px-4 py-3.5">Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataPesanan.map((order, index) => (
                      <tr key={order.id} className="hover:bg-orange-50/40 transition">
                        <td className="px-4 py-3.5 text-center text-xs text-gray-400">{index + 1}</td>
                        <td className="px-4 py-3.5 font-bold text-gray-800">{order.nama_pelanggan || "Pelanggan"}</td>
                        <td className="px-4 py-3.5 text-xs font-mono text-gray-600">#{order.id}</td>
                        <td className="px-4 py-3.5 font-extrabold text-orange-600">
                          Rp {order.total.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatusPesanan(order.id, e.target.value)
                            }
                            className="text-xs font-semibold border border-gray-200 bg-gray-50 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                          >
                            <option value="pending">Sedang Diproses</option>
                            <option value="siap_diambil">Siap Diambil</option>
                            <option value="selesai">Selesai</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              order.status_pembayaran === "sudah_transfer"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status_pembayaran === "sudah_transfer"
                              ? "Lunas (Transfer)"
                              : "Menunggu Transfer"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal Tambah Menu */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-orange-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">
              ➕ Tambah Menu Baru
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Isi informasi hidangan Minang untuk ditampilkan ke pelanggan
            </p>

            <form onSubmit={handleTambahMenu} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  placeholder="Contoh: Rendang Daging Sapi"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 28000"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Menu</label>
                <textarea
                  rows="2"
                  placeholder="Deskripsi singkat rasa dan bahan hidangan..."
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Foto Menu</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, gambar: e.target.files[0] })
                  }
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow transition cursor-pointer"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Menu */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">
              ✏️ Edit Data Menu
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Perbarui harga, deskripsi, atau foto menu
            </p>

            <form onSubmit={handleSubmitEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={editForm.harga}
                  onChange={(e) =>
                    setEditForm({ ...editForm, harga: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Menu</label>
                <textarea
                  rows="2"
                  value={editForm.deskripsi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, deskripsi: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category_id: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Foto Baru (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm({ ...editForm, gambar: e.target.files[0] })
                  }
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Confirm */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-red-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Hapus Menu Hidangan?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Menu yang dihapus tidak dapat dipulihkan kembali dari sistem.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition cursor-pointer"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Logout Confirm */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🚪
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Keluar dari Panel Admin?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Anda perlu masuk kembali untuk mengelola pesanan dan menu.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Tetap di Sini
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  toast.success("Logout berhasil!");
                  window.location.href = "/";
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition cursor-pointer"
              >
                Keluar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;

