import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import axios from "axios";
import Footer from "../components/footer";
import Nav from "../components/nav";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaPlus,
  FaMinus,
  FaStar,
  FaCheckCircle,
  FaLeaf,
  FaFire,
} from "react-icons/fa";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/menus/${id}`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Gagal ambil detail menu", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const formatHarga = (harga) => "Rp " + Number(harga).toLocaleString("id-ID");

  const handleAddToCart = () => {
    if (menu) {
      addToCart(menu, quantity);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/70">
      <Nav />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb / Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-4 py-2 rounded-full transition shadow-2xs cursor-pointer"
            >
              <FaArrowLeft className="text-xs" />
              <span>Kembali ke Menu Utama</span>
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-80 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ) : !menu ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Menu Tidak Ditemukan
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Menu yang kamu cari mungkin sudah tidak tersedia atau dipindahkan.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
                {/* Left: Image Container */}
                <div className="flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-100 h-80 md:h-96">
                    <img
                      src={`http://localhost:8000/image/${menu.gambar}`}
                      alt={menu.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />

                    {/* Floating Rating */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
                      <FaStar className="text-amber-500" />
                      <span>4.9 / 5.0 Rating Pelanggan</span>
                    </div>

                    {/* Category */}
                    {menu.category?.name && (
                      <span className="absolute top-4 right-4 bg-orange-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {menu.category.name}
                      </span>
                    )}
                  </div>

                  {/* Highlights under image */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5">
                      <FaCheckCircle className="text-emerald-500 mx-auto text-sm mb-1" />
                      <span className="text-[11px] font-semibold text-gray-700 block">100% Halal</span>
                    </div>
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5">
                      <FaLeaf className="text-emerald-500 mx-auto text-sm mb-1" />
                      <span className="text-[11px] font-semibold text-gray-700 block">Rempah Alami</span>
                    </div>
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5">
                      <FaFire className="text-orange-500 mx-auto text-sm mb-1" />
                      <span className="text-[11px] font-semibold text-gray-700 block">Dimasak Segar</span>
                    </div>
                  </div>
                </div>

                {/* Right: Info & Ordering */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                      {menu.nama}
                    </h1>

                    <div className="text-2xl font-extrabold text-orange-600 mb-6">
                      {formatHarga(menu.harga)}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Deskripsi Menu
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed bg-orange-50/40 p-4 rounded-2xl border border-orange-100/60">
                        {menu.deskripsi ||
                          "Hidangan istimewa khas Padang yang diolah dengan resep warisan bumbu rempah pilihan, menciptakan kelezatan gurih yang meresap sempurna di setiap suapan."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Porsi Pesanan
                        </span>
                        <span className="text-xs text-gray-400">
                          Total: {formatHarga(menu.harga * quantity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={quantity <= 1}
                          className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="text-lg font-bold text-gray-800 w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition shadow-xs"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.99] cursor-pointer text-base"
                    >
                      <FaShoppingBag />
                      <span>
                        Tambah ke Keranjang • {formatHarga(menu.harga * quantity)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Detail;
