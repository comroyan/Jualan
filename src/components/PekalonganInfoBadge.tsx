import React from 'react';
import { ShieldCheck, Flame, Heart, Truck } from 'lucide-react';

export const PekalonganInfoBadge: React.FC = () => {
  return (
    <div className="bg-white rounded-[28px] border border-[#E5E1DA] p-4 sm:p-5 mb-6 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="flex flex-col items-center p-2.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA]">
          <Flame className="w-5 h-5 text-[#F59E0B] mb-1" />
          <span className="text-xs font-extrabold text-[#3E2723]">Free Saos Bangkok</span>
          <span className="text-[10px] text-[#8D6E63] uppercase tracking-wider">Setiap Porsi</span>
        </div>

        <div className="flex flex-col items-center p-2.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA]">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-xs font-extrabold text-[#3E2723]">100% Halal</span>
          <span className="text-[10px] text-[#8D6E63] uppercase tracking-wider">Bahan Higienis</span>
        </div>

        <div className="flex flex-col items-center p-2.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA]">
          <Truck className="w-5 h-5 text-[#D97706] mb-1" />
          <span className="text-xs font-extrabold text-[#3E2723]">Pengiriman Pekalongan</span>
          <span className="text-[10px] text-[#8D6E63] uppercase tracking-wider">Langsung Kurir</span>
        </div>

        <div className="flex flex-col items-center p-2.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA]">
          <Heart className="w-5 h-5 text-rose-500 mb-1" />
          <span className="text-xs font-extrabold text-[#3E2723]">Fresh Cooked</span>
          <span className="text-[10px] text-[#8D6E63] uppercase tracking-wider">Dibuat saat PO</span>
        </div>
      </div>
    </div>
  );
};
