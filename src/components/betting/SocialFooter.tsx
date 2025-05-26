
import React from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function SocialFooter() {
  const isMobile = useIsMobile();

  return (
    <footer className="mt-10 text-center text-sm opacity-60 flex flex-col items-center relative z-10">
      <p className="mb-2">Nos siga no Instagram e Telegram</p>
      <div className="flex space-x-4">
        <a href="https://t.me/betsemmedofree" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
          <MessageCircle size={isMobile ? 20 : 24} />
        </a>
        <a href="https://www.instagram.com/betsemmedo?igsh=MW1rcjM0Z3I2aTVsNw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
          <Instagram size={isMobile ? 20 : 24} />
        </a>
      </div>
    </footer>
  );
}
