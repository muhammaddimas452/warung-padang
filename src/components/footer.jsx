import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../assets/image/Merah Coklat Tradisional Rumah Makan Padang Logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-orange-700 via-orange-800 to-amber-950 text-white pt-12 pb-6 border-t-4 border-amber-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo Resto"
                className="h-14 w-auto bg-white/10 p-1 rounded-xl backdrop-blur-xs"
              />
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-white">
                  Resto Padang Asli
                </h3>
                <p className="text-xs text-amber-200">Cita Rasa Tradisional Minang</p>
              </div>
            </div>
            <p className="text-xs text-orange-100 leading-relaxed max-w-sm">
              Menghadirkan hidangan Minangkabau otentik dengan racikan rempah nusantara terbaik dan kehangatan tradisi rasa yang melegenda.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs text-amber-200 border border-white/15">
              <FaCheckCircle className="text-emerald-400 text-xs" />
              <span>100% Halal & Higienis</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-orange-100">
              <li>
                <Link to="/" className="hover:text-amber-200 transition">
                  • Beranda & Menu
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-amber-200 transition">
                  • Riwayat Pesanan
                </Link>
              </li>
              <li>
                <span className="text-orange-300 cursor-default">
                  • Layanan Bungkus / Take Away & Makan di Tempat
                </span>
              </li>
            </ul>
          </div>

          {/* Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Informasi Restoran
            </h4>
            <div className="space-y-2 text-xs text-orange-100">
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-amber-400 text-sm mt-0.5 shrink-0" />
                <span>Jl. Ahmad Yani No. 88, Jakarta Barat</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaClock className="text-amber-400 text-xs shrink-0" />
                <span>Buka Setiap Hari: 09:00 - 22:00 WIB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-amber-400 text-xs shrink-0" />
                <span>Hotline & Reservasi: (021) 555-8899</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-orange-200/80 gap-2 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Rumah Makan Padang Minang. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center justify-center gap-1">
            Dirancang dengan <FaHeart className="text-red-400 text-xs animate-pulse" /> untuk pecinta kuliner Nusantara
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
