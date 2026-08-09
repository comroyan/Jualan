import React from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/whatsapp';

interface MenuCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (newQty: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  const isSelected = quantity > 0;
  const subtotal = product.price * quantity;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-[24px] p-4 sm:p-5 shadow-xs border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/20 shadow-md'
          : 'border-[#E5E1DA] hover:border-[#D7CCC8]'
      }`}
    >
      {/* Top Badge if any */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#3E2723] text-[#F59E0B] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 border border-[#4E342E] uppercase tracking-wider">
            <Flame className="w-3 h-3 text-[#F59E0B]" />
            {product.badge}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-36 sm:h-32 rounded-[20px] overflow-hidden shrink-0 bg-[#F9F7F4]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Portion overlay */}
          <div className="absolute bottom-2 left-2 bg-[#3E2723]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {product.portion}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-lg text-[#3E2723] leading-snug font-heading">
                {product.name}
              </h3>
            </div>

            <p className="text-xs text-[#6D4C41] mt-1 leading-relaxed">
              {product.description}
            </p>

            {/* Free Sauce Tag */}
            {product.freeSauce && (
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                <Sparkles className="w-3 h-3" />
                {product.freeSauce}
              </div>
            )}
          </div>

          {/* Price & Quantity Controls */}
          <div className="mt-4 pt-3 border-t border-[#F3EFEA] flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#8D6E63] block font-bold uppercase tracking-widest">Harga</span>
              <span className="text-lg font-extrabold text-[#F59E0B]">
                {formatRupiah(product.price)}
              </span>
            </div>

            {/* Quantity Stepper [ - ] [ Qty ] [ + ] */}
            <div className="flex items-center gap-1 bg-[#F9F7F4] border border-[#E5E1DA] p-1 rounded-xl">
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                disabled={quantity === 0}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base transition-colors ${
                  quantity === 0
                    ? 'text-[#D7CCC8] cursor-not-allowed'
                    : 'bg-white text-[#3E2723] shadow-2xs hover:bg-[#F3EFEA] cursor-pointer'
                }`}
                aria-label="Kurangi pesanan"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.button>

              <span className={`w-7 text-center font-extrabold text-sm transition-all ${
                quantity > 0 ? 'text-[#F59E0B] scale-110' : 'text-[#8D6E63]'
              }`}>
                {quantity}
              </span>

              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-[#F59E0B] text-white shadow-2xs hover:bg-[#D97706] flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                aria-label="Tambah pesanan"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.button>
            </div>
          </div>

          {/* Subtotal Indicator if selected */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-right"
            >
              <span className="text-[11px] text-[#8D6E63]">Subtotal: </span>
              <span className="text-xs font-extrabold text-[#3E2723]">
                {formatRupiah(subtotal)}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
