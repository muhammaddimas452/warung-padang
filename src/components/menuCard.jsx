import { Link } from "react-router-dom";
import { FaPlus, FaStar } from "react-icons/fa";

const MenuCard = ({ menu, onOpenModal }) => {
  const formatHarga = (harga) => "Rp " + Number(harga).toLocaleString("id-ID");

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100/80 hover:border-orange-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative overflow-hidden h-44 bg-gray-100">
        <Link to={`/menu/${menu.id}`}>
          <img
            src={`http://localhost:8000/image/${menu.gambar}`}
            alt={menu.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </Link>

        {/* Rating badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <FaStar className="text-amber-500 text-[10px]" />
          <span>4.9</span>
        </div>

        {/* Category badge */}
        {menu.category?.name && (
          <span className="absolute top-2.5 right-2.5 bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
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
            {menu.deskripsi || "Hidangan khas Minang dengan resep rempah otentik."}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Harga</span>
            <p className="text-base font-extrabold text-orange-600">
              {formatHarga(menu.harga)}
            </p>
          </div>
          <button
            onClick={() => onOpenModal && onOpenModal(menu)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition transform active:scale-95 cursor-pointer"
          >
            <FaPlus className="text-[10px]" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
