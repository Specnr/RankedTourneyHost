import React from "react";
import "@/public/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          {children}
        </div>
      </body>
    </html>
  );
};
