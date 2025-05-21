
import React from "react";
import { Check } from "lucide-react";

interface FixStakeButtonProps {
  isFixed: boolean;
  onFix: () => void;
  disabled: boolean;
}

export function FixStakeButton({ isFixed, onFix, disabled }: FixStakeButtonProps) {
  return (
    <button
      className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded disabled:opacity-50 transition-colors ${
        isFixed 
          ? "bg-betting-green text-white" 
          : "bg-gray-600 text-white"
      }`}
      onClick={onFix}
      disabled={disabled}
    >
      {isFixed && <Check size={16} />}
      {isFixed ? "Stake Fixada" : "Fixar Stake"}
    </button>
  );
}
