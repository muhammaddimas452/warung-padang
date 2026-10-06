import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Header = ({ onSelectCategory, selected }) => {
  const categories = [
    { id: "Semua", label: "Semua Menu", emoji: "🍛" },
    { id: "Paket Favorite", label: "Paket Favorit", emoji: "⭐" },
    { id: "Lauk Tambahan", label: "Lauk Tambahan", emoji: "🍗" },
    { id: "Minuman", label: "Minuman Segar", emoji: "🥤" },
    { id: "Add On", label: "Pelengkap & Add On", emoji: "🍚" },
  ];

  return (
    <div className="sticky top-[73px] z-30 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row justify-between px-4 md:px-14 py-3 mt-3 gap-3">
        {/* Kategori Menu - Horizontal Scrollable on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide py-1">
          {categories.map((kat) => {
            const isSelected =
              (kat.id === "Semua" && !selected) || selected === kat.id;
            return (
              <button
                key={kat.id}
                onClick={() => onSelectCategory(kat.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]"
                    : "bg-orange-50/60 text-gray-700 hover:bg-orange-100 hover:text-orange-600 border border-orange-100/80"
                }`}
              >
                <span>{kat.emoji}</span>
                <span>{kat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Info Lokasi & Jam Operasional */}
        <div className="hidden sm:flex items-center gap-3 text-xs md:text-sm text-gray-600 shrink-0">
          <div className="flex items-center gap-1.5 bg-orange-50/80 border border-orange-100 px-3 py-1.5 rounded-full text-gray-700">
            <FaMapMarkerAlt className="text-orange-500 shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-none">
              Jl. Ahmad Yani No. 88, Jakarta Barat
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <FaClock className="text-xs" />
            <span>Buka: 09:00 - 22:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
