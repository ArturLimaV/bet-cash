
import React from "react";

export function Logo() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center relative mb-8">
        <div className="bg-betting-green rounded-md p-4 w-60 h-60 flex items-center justify-center">
          <div className="relative">
            <div className="text-4xl font-extrabold tracking-wider text-cream-100 text-center">
              <div className="relative inline-block">
                <span className="text-[#FFFBEB] font-extrabold tracking-tight text-6xl" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                  BET
                </span>
              </div>
              <div className="absolute top-10 right-1 z-10">
                <div className="bg-[#1A1F20] w-10 h-10 rounded-tl-lg rounded-tr-lg rounded-br-lg flex items-center justify-center transform rotate-12">
                  <svg className="w-6 h-6 text-[#FFFBEB]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className="relative block mt-2">
                <span className="text-[#FFFBEB] font-extrabold tracking-tight text-6xl" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                  SEM
                </span>
              </div>
              <div className="relative block mt-2">
                <span className="text-[#FFFBEB] font-extrabold tracking-tight text-6xl" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                  MEDO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
