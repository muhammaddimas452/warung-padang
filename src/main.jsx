import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/cartContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
