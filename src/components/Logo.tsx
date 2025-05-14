
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Logo() {
  const isMobile = useIsMobile();
  const logoSize = isMobile ? "w-40 h-40" : "w-60 h-60";
  const fontSize = isMobile ? "text-4xl" : "text-6xl";
  const checkmarkSize = isMobile ? "w-8 h-8" : "w-10 h-10";
  const checkIconSize = isMobile ? "w-5 h-5" : "w-6 h-6";

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center relative mb-4 md:mb-8">
        <div className={`bg-betting-green rounded-md p-3 md:p-4 ${logoSize} flex items-center justify-center`}>
          <div className="relative">
            <div className="text-3xl md:text-4xl font-extrabold tracking-wider text-cream-100 text-center">
              <div className="relative inline-block">
                <span className={`text-[#FFFBEB] font-extrabold tracking-tight ${fontSize}`} style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                  BET
                </span>
              </div>
              <div className="absolute top-8 md:top-10 right-0 md:right-1 z-10">
                <div className={`bg-[#1A1F20] ${checkmarkSize} rounded-tl-lg rounded-tr-lg rounded-br-lg flex items-center justify-center transform rotate-12`}>
                  <svg className={`${checkIconSize} text-[#FFFBEB]`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className="relative block mt-1 md:mt-2">
                <span className={`text-[#FFFBEB] font-extrabold tracking-tight ${fontSize}`} style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                  SEM
                </span>
              </div>
              <div className="relative block mt-1 md:mt-2">
                <span className={`text-[#FFFBEB] font-extrabold tracking-tight ${fontSize}`} style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
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
