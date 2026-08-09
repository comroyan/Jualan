import React from 'react';
import { Sparkles, MapPin, Clock, Settings, Utensils, Lock, CalendarCheck, AlertOctagon, Package } from 'lucide-react';
import { StoreConfig } from '../types';

interface HeaderProps {
  config: StoreConfig;
  isPoOpenEffective: boolean;
  remainingTimeStr?: string | null;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, isPoOpenEffective, remainingTimeStr, onOpenSettings }) => {
  return (
    <header className="relative bg-white rounded-[28px] sm:rounded-[32px] shadow-xs border border-[#E5E1DA] p-5 sm:p-6 mb-5 overflow-hidden">
      {/* Decorative Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
        isPoOpenEffective ? 'from-[#F59E0B] via-[#10B981] to-[#D97706]' : 'from-red-500 via-red-600 to-rose-700'
      }`} />
      
      {/* Background Subtle Accent */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
        <Utensils className="w-32 h-32 text-[#3E2723]" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* PO Status Badge & Pekalongan Area Tag */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {isPoOpenEffective ? (
              <span className="inline-flex items-center gap-1.5 bg-[#10B981] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-2xs tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {config.poBadgeText || "Open PO Buka"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-2xs tracking-wide uppercase animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5" />
                PO TUTUP / REALTIME CLOSED
              </span>
            )}

            <span className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-[#F59E0B]" />
              Pekalongan & Sekitarnya
            </span>
          </div>

          {/* Store Name Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723] tracking-tight leading-tight uppercase font-heading">
            {config.storeName}
          </h1>

          {/* Slogan */}
          <p className="text-xs sm:text-sm text-[#6D4C41] mt-1 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            PO Dimsum & Ayam Keju Pekalongan • Fresh & Halal
          </p>
        </div>

        {/* Store Admin / Owner Settings Button with Lock Icon */}
        <button
          onClick={onOpenSettings}
          title="Pengaturan Toko (Khusus Owner)"
          className="p-2.5 rounded-2xl bg-[#F9F7F4] hover:bg-[#F3EFEA] text-[#5D4037] transition-all border border-[#E5E1DA] shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* PO Schedule Details Box with Realtime Countdown */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider block">Close Order (Batas Realtime):</span>
            <span className="font-extrabold text-[#3E2723]">{config.poClosedAt || "Jumat 18:00 WIB"}</span>
            {remainingTimeStr && isPoOpenEffective && (
              <span className="block text-[10px] text-amber-700 font-mono font-bold mt-0.5 bg-amber-100 px-1.5 py-0.5 rounded-md inline-block">
                ⏳ Sisa Waktu: {remainingTimeStr}
              </span>
            )}
            {!isPoOpenEffective && (
              <span className="block text-[10px] text-red-600 font-bold mt-0.5">
                ⛔ Pendaftaran telah ditutup
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider block">Ready & Pengiriman:</span>
            <span className="font-extrabold text-[#1B5E20]">{config.poReadyAt || "Sabtu 10:00 WIB"}</span>
          </div>
        </div>
      </div>

      {/* Realtime PO Quota Limit Bar */}
      {config.enableQuotaLimit && config.maxQuota && config.maxQuota > 0 && (
        <div className="mt-2.5 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
          <div className="flex items-center justify-between text-xs font-bold text-[#78350F] mb-1.5">
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              Batasan Kuota PO:
            </span>
            <span>
              {config.soldQuota || 0} / {config.maxQuota} Porsi ({Math.min(100, Math.round(((config.soldQuota || 0) / config.maxQuota) * 100))}%)
            </span>
          </div>
          <div className="w-full bg-amber-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (config.soldQuota || 0) >= config.maxQuota
                  ? 'bg-red-600'
                  : ((config.soldQuota || 0) / config.maxQuota) > 0.8
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, Math.round(((config.soldQuota || 0) / config.maxQuota) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] font-bold">
            <span className={(config.soldQuota || 0) >= config.maxQuota ? 'text-red-600 font-black' : 'text-[#92400E]'}>
              {(config.soldQuota || 0) >= config.maxQuota
                ? '⛔ KUOTA HASIL PO PENUH (FULL BOOKED)'
                : `🔥 Sisa Kuota: ${Math.max(0, config.maxQuota - (config.soldQuota || 0))} Porsi Lagi!`}
            </span>
            <span className="text-[#8D6E63] font-mono">Batas: {config.maxQuota} Porsi</span>
          </div>
        </div>
      )}

      {/* Pekalongan Special Banner */}
      <div className="mt-3 pt-3 border-t border-[#F3EFEA] flex items-center justify-between text-xs font-medium text-[#6D4C41]">
        <div className="flex items-center gap-2">
          <span className="bg-[#FEF3C7] text-[#92400E] font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-[#FDE68A]">
            FREE Saos Bangkok
          </span>
          <span>• Fresh Made</span>
        </div>
        <span className="text-[#F59E0B] font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-1" onClick={onOpenSettings}>
          <Lock className="w-3 h-3" /> Area Owner Toko
        </span>
      </div>
    </header>
  );
};

