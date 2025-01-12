import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl mx-auto">
      { children }
    </div>
  )
}