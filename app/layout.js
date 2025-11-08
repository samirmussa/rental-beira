// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./../components/SessionProvider"
import Navbar from "./../components/Navbar" // ← ADICIONE .jsx

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rental Beira",
  description: "Sistema de gestão de arrendamentos na Beira",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}