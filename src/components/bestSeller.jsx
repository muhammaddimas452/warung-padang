import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaFire, FaStar, FaPlus } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";

const BestSeller = ({ onOpenModal }) => {
  const [menus, setMenus] = useState([]);

  const formatHarga = (angka) =>
    "Rp " +
    Number(angka).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/menus/best-sellers")
      .then((res) => {
        setMenus(res.data.data || res.data || []);
      })
      .catch((err) => console.error("Gagal ambil best seller:", err));
  }, []);

  if (menus.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 overflow-hidden mb-10 px-4 sm:px-14 py-8 rounded-b-3xl shadow-lg">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-amber-100 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-white/25">
            <FaFire className="text-amber-300 animate-pulse" />
            <span>Paling Banyak Dipesan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            🔥 Menu Favorit Pilihan Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-lg">
            Olahan bumbu rempah Minang pilihan dengan cita rasa otentik dan gurih meresap
          </p>
        </div>
      </div>

      <Swiper
        slidesPerView={"auto"}
        spaceBetween={18}
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="relative z-10 py-2"
      >
        {menus.map((menu) => (
          <SwiperSlide key={menu.id} style={{ width: "300px" }}>
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-100 flex flex-col h-full transform hover:-translate-y-1">
              {/* Image Container with Badges */}
              <div className="relative overflow-hidden h-44 bg-gray-100">
                <Link to={`/menu/${menu.id}`}>
                  <img
                    src={`http://localhost:8000/image/${menu.gambar}`}
                    alt={menu.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </Link>

                {/* Rating badge */}
                <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <FaStar className="text-amber-500 text-[10px]" />
                  <span>4.9</span>
                </div>

                {/* Category badge */}
                {menu.category?.name && (
                  <span className="absolute top-2.5 right-2.5 bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                    {menu.category.name}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <Link to={`/menu/${menu.id}`}>
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-orange-600 transition line-clamp-1 mb-1">
                      {menu.nama}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {menu.deskripsi || "Hidangan khas Minang dengan resep rempah istimewa."}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Harga</span>
                    <p className="text-base font-extrabold text-orange-600">
                      {formatHarga(menu.harga)}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenModal(menu)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition transform active:scale-95 cursor-pointer"
                  >
                    <FaPlus className="text-[10px]" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSeller;
