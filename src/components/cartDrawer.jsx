import { useCart } from "../context/cartContext";
import useAuth from "../context/useAuth";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaShoppingBag,
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaClock,
  FaArrowRight,
  FaUtensils,
} from "react-icons/fa";

const CartDrawer = ({ onClose }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.harga * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatHarga = (harga) => "Rp " + Number(harga).toLocaleString("id-ID");

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("🛒 Keranjang kamu kosong! Tambahkan menu dulu ya.");
      return;
    }
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk checkout");
      openAuthModal("login");
      onClose();
      return;
    }
    onClose();
    navigate("/checkout");
  };

  return createPortal (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FaShoppingBag className="text-white text-base" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Keranjang Belanja</h2>
              <p className="text-xs text-orange-100">
                {totalItems} item hidangan dipilih
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-orange-100/80 text-orange-500 flex items-center justify-center text-3xl mb-4 shadow-inner">
                <FaUtensils />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Keranjang Masih Kosong
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6">
                Yuk jelajahi aneka menu rendang, ayam pop, gulai dan sambal khas Minang favoritmu!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full shadow hover:shadow-md transition cursor-pointer"
              >
                Pilih Menu Sekarang
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="pt-3.5 first:pt-0 flex gap-3.5 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-orange-100">
                    <img
                      src={
                        item.gambar
                          ? `http://localhost:8000/image/${item.gambar}`
                          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={item.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 truncate">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">
                      {formatHarga(item.harga)}
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button
                          onClick={() => addToCart(item, -1)}
                          className="w-6 h-6 rounded-md bg-white text-gray-700 flex items-center justify-center hover:bg-orange-50 shadow-2xs cursor-pointer"
                        >
                          <FaMinus className="text-[9px]" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 shadow-2xs cursor-pointer"
                        >
                          <FaPlus className="text-[9px]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Line total & Delete */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition cursor-pointer"
                      title="Hapus menu"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                    <p className="text-xs font-extrabold text-gray-800">
                      {formatHarga(item.harga * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 shrink-0 space-y-3">
            {/* Quick Estimation */}
            <div className="flex items-center justify-between text-xs text-gray-600 bg-orange-100/60 px-3 py-2 rounded-xl border border-orange-200/50">
              <span className="flex items-center gap-1.5 font-medium text-orange-900">
                <FaClock className="text-orange-600 text-xs" />
                Estimasi Pesanan Selesai:
              </span>
              <span className="font-bold text-orange-800">15 - 20 Menit</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-1">
              <div>
                <span className="text-xs text-gray-500 block">Total Pembayaran</span>
                <span className="text-xl font-extrabold text-gray-900">
                  {formatHarga(total)}
                </span>
              </div>

              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition underline cursor-pointer"
              >
                Kosongkan Keranjang
              </button>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer text-sm"
            >
              <span>Lanjut ke Checkout</span>
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
    
  );
};

export default CartDrawer;
