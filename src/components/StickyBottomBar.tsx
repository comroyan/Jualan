import React from 'react';
import { motion } from 'motion/react';
import { Send, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/whatsapp';

interface StickyBottomBarProps {
  totalItems: number;
  totalAmount: number;
  isValid: boolean;
  validationError: string | null;
  onSubmitOrder: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  totalItems,
  totalAmount,
  isValid,
  validationError,
  onSubmitOrder,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E1DA] p-3 sm:p-4 shadow-lg">
      <div className="max-w-md mx-auto">
        {/* Validation Error Banner if invalid */}
        {!isValid && validationError && (
          <div className="mb-2 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] sm:text-xs px-3 py-1.5 rounded-xl flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{validationError}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {/* Total Price Summary */}
          <div className="shrink-0">
            <div className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#F59E0B]" />
              {totalItems > 0 ? `${totalItems} Menu Dipilih` : 'Belum memilih'}
            </div>
            <div className="text-lg sm:text-xl font-black text-[#3E2723] font-heading">
              {formatRupiah(totalAmount)}
            </div>
          </div>

          {/* PESAN SEKARANG Button */}
          <motion.button
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.96 } : {}}
            type="button"
            onClick={onSubmitOrder}
            disabled={!isValid}
            className={`flex-1 max-w-[240px] py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
              isValid
                ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:opacity-95 shadow-green-200 cursor-pointer'
                : 'bg-[#E5E1DA] text-[#8D6E63] cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-4 h-4 fill-current" />
            <span>PESAN SEKARANG</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
