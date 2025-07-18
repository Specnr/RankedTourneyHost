import React from "react";
import "@/public/globals.css";
import NavBar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <NavBar />
        <main className="flex flex-col items-center justify-center flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
};
