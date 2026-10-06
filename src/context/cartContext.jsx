/* eslint-disable react-refresh/only-export-components */
import { AuthContext } from "./authContext"; // sesuaikan path sesuai project
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  // Ambil isi keranjang dari backend saat mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !user) return;

      try {
        console.log(token);
        const res = await axios.get("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const serverCart = res.data.data?.items || [];
        const formatted = serverCart.map((item) => ({
          id: item.menu_id,
          nama: item.menu?.nama || "Menu",
          harga: item.harga,
          quantity: item.quantity,
          gambar: item.menu?.gambar || "", // ✅ tambahkan gambar
        }));

        setCart(formatted);
      } catch (err) {
        console.error("Gagal memuat keranjang:", err);
      }
    };

    fetchCart(); // akan dipanggil ulang setiap user berubah
  }, [user, token]);

  // Sinkronisasi ke server
  const syncCartToServer = async (updatedCart) => {
    if (!token) return;

    try {
      const payload = {
        items: updatedCart.map((item) => ({
          menu_id: item.id,
          quantity: item.quantity,
          harga: parseInt(item.harga),
        })),
      };
      await axios.post("http://localhost:8000/api/cart", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(
        "❌ Gagal simpan keranjang:",
        err.response?.data || err.message
      );
    }
  };

  const addToCart = (menu, quantity = 1) => {
    const exist = cart.find((item) => item.id === menu.id);
    let updatedCart;

    if (exist) {
      const newQty = exist.quantity + quantity;
      if (newQty <= 0) {
        removeFromCart(menu.id);
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === menu.id ? { ...item, quantity: newQty } : item
      );
    } else {
      if (quantity <= 0) return;
      updatedCart = [...cart, { ...menu, quantity }];
    }

    setCart(updatedCart);
    syncCartToServer(updatedCart);
    if (quantity > 0) {
      toast.success(`${menu.nama} berhasil ditambahkan ke keranjang`);
    }
  };


  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    syncCartToServer(updatedCart);
  };

  const deleteCartFromServer = async () => {
    if (!token) return;

    try {
      await axios.delete("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Cart berhasil dihapus dari server");
    } catch (err) {
      console.error("❌ Gagal menghapus cart:", err);
    }
  };

  const clearCart = async () => {
    setCart([]);
    // syncCartToServer([]);
    localStorage.removeItem("cart");
    await deleteCartFromServer(); // ✅ pastikan dijalankan setelah local clear
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
