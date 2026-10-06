import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/nav";
import Header from "../components/header";
import BestSeller from "../components/bestSeller";
import SearchResults from "../components/searchResult";
import MenuCard from "../components/menuCard";
import Footer from "../components/footer";
import { useCart } from "../context/cartContext";
import { FaTimes, FaPlus, FaMinus, FaShoppingBag, FaUtensils } from "react-icons/fa";

const Home = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/api/menus")
      .then((res) => {
        setMenus(res.data);
        setFilteredMenus(res.data);
      })
      .catch((err) => console.error("Gagal Ambil Data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      if (selectedCategory && selectedCategory !== "Semua") {
        const filtered = menus.filter(
          (menu) =>
            menu.category &&
            menu.category.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        setFilteredMenus(filtered);
      } else {
        setFilteredMenus(menus);
      }
    } else {
      const hasil = menus.filter(
        (menu) =>
          menu.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          menu.deskripsi?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredMenus(hasil);
    }
  }, [searchKeyword, menus, selectedCategory]);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);

  const handleCategoryClick = (kategoriName) => {
    if (kategoriName === "Semua") {
      setFilteredMenus(menus);
      setSelectedCategory(null);
    } else {
      const filtered = menus.filter(
        (menu) =>
          menu.category &&
          menu.category.name.toLowerCase() === kategoriName.toLowerCase()
      );
      setFilteredMenus(filtered);
      setSelectedCategory(kategoriName);
    }
  };

  const formatHarga = (harga) => {
    return "Rp " + Number(harga).toLocaleString("id-ID");
  };

  const handleOpenModal = (menu) => {
    setSelectedMenu(menu);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAdd = () => {
    if (selectedMenu) {
      addToCart(selectedMenu, quantity);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60 font-sans">
      <Nav onSearch={setSearchKeyword} />

      <main className="flex-1 pt-[73px]">
        {/* Sticky Sub-Header with Category Bar */}
        <Header
          onSelectCategory={handleCategoryClick}
          selected={selectedCategory}
        />

        {/* Best Seller Carousel (only show when not searching) */}
        {searchKeyword.trim() === "" && (
          <BestSeller onOpenModal={handleOpenModal} />
        )}

        {/* Content Section */}
        {searchKeyword.trim() !== "" ? (
          <SearchResults
            results={filteredMenus}
            keyword={searchKeyword}
            onOpenModal={handleOpenModal}
          />
        ) : (
          <div className="px-4 sm:px-8 md:px-14 py-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-orange-100 gap-2">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                  <span className="text-orange-500">🍱</span>
                  {selectedCategory ? `${selectedCategory}` : "Semua Hidangan Resto"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Pilih sajian lauk, sambal, gulai dan minuman khas Minang kesukaanmu
                </p>
              </div>
              <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full self-start sm:self-auto">
                {filteredMenus.length} Menu Tersedia
              </span>
            </div>

            {/* Menu Grid / Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse h-72"
                  >
                    <div className="bg-gray-200 h-40 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="flex justify-between items-center mt-auto">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-8 bg-gray-200 rounded-lg w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                  <FaUtensils />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Belum Ada Menu di Kategori Ini
                </h3>
                <p className="text-xs text-gray-500">
                  Silakan pilih kategori lainnya untuk melihat menu lezat kami.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Modern Add to Cart Modal */}
      {showModal && selectedMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-orange-100 transform transition-all animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setShowModal(false)}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Menu Image Banner */}
            <div className="relative h-56 bg-gray-100 overflow-hidden">
              <img
                src={`http://localhost:8000/image/${selectedMenu.gambar}`}
                alt={selectedMenu.nama}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {selectedMenu.category?.name && (
                <span className="absolute bottom-3 left-4 bg-orange-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedMenu.category.name}
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-800">
                    {selectedMenu.nama}
                  </h3>
                  <p className="text-lg font-bold text-orange-600 mt-0.5">
                    {formatHarga(selectedMenu.harga)}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-100/60">
                {selectedMenu.deskripsi ||
                  "Menu lezat khas Minang dimasak dengan bumbu rempah pilihan."}
              </p>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Porsi / Jumlah:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    aria-label="Kurangi porsi"
                    className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="text-base font-extrabold text-gray-800 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Tambah porsi"
                    className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition shadow-xs"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAdd}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer"
              >
                <FaShoppingBag />
                <span>
                  Tambah ke Keranjang • {formatHarga(selectedMenu.harga * quantity)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
