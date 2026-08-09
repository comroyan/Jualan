import React from 'react';
import { UtensilsCrossed, PlusCircle } from 'lucide-react';
import { Product, CartItem } from '../types';
import { MenuCard } from './MenuCard';

interface MenuListProps {
  products: Product[];
  extraAddons: Product[];
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  products,
  extraAddons,
  cartItems,
  onUpdateQuantity,
}) => {
  const getQuantity = (id: string) => {
    const item = cartItems.find((i) => i.product.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#FDE68A]">
            2
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-[#3E2723] font-heading">Pilih Menu PO</h2>
            <p className="text-xs text-[#6D4C41]">Tekan tombol + atau − untuk menentukan porsi</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#FDE68A]">
          <UtensilsCrossed className="w-3 h-3" />
          Fresh Made
        </span>
      </div>

      {/* Main Menu Cards */}
      <div className="space-y-4">
        {products.map((product) => (
          <MenuCard
            key={product.id}
            product={product}
            quantity={getQuantity(product.id)}
            onQuantityChange={(newQty) => onUpdateQuantity(product.id, newQty)}
          />
        ))}
      </div>

      {/* Optional Extra Add-ons section */}
      {extraAddons && extraAddons.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#E5E1DA]">
          <div className="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest">
            <PlusCircle className="w-3.5 h-3.5" />
            Tambahan Ekstra (Opsional)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extraAddons.map((addon) => (
              <MenuCard
                key={addon.id}
                product={addon}
                quantity={getQuantity(addon.id)}
                onQuantityChange={(newQty) => onUpdateQuantity(addon.id, newQty)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
