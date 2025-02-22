import "../styles/globals.css"; // Global styles


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
        
      </body>
    </html>
  );
}
