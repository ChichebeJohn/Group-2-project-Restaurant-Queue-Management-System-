// app/layout.js
import { CartProvider } from "../context/CartContext";
import { QueueProvider } from "../context/QueueContext";
import SocketInitializer from "../components/SocketInitializer";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <QueueProvider>
            <SocketInitializer />
            {children}
          </QueueProvider>
        </CartProvider>
      </body>
    </html>
  );
}
