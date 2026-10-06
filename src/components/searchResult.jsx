import MenuCard from "./menuCard";
import { FaSearch, FaUtensils } from "react-icons/fa";

const SearchResults = ({ results, keyword, onOpenModal }) => {
  return (
    <div className="px-4 md:px-14 py-8">
      {/* Search Header Banner */}
      <div className="bg-orange-50/80 border border-orange-200/70 rounded-2xl p-4 sm:p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <FaSearch className="text-sm" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Hasil Pencarian: <span className="text-orange-600 font-extrabold">"{keyword}"</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ditemukan <strong className="text-orange-600">{results.length}</strong> menu yang cocok
            </p>
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onOpenModal={onOpenModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaUtensils />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Menu Tidak Ditemukan
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Maaf, kami tidak menemukan menu dengan kata kunci "{keyword}". Coba cari kata kunci lain seperti rendang, ayam gulai, dendeng, atau es teh.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
