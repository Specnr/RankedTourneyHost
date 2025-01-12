import React from "react";
import "@/public/globals.css";
import NavBar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="top-2 left-3 absolute">
          <NavBar />
        </div>
        {children}
      </body>
    </html>
  );
};
