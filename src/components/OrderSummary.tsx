import React from 'react';
import { ShoppingBag, FileText, ShoppingCart, Truck } from 'lucide-react';
import { CartItem, DeliveryMethod } from '../types';
import { formatRupiah, getDeliveryMethodLabel } from '../utils/whatsapp';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotalAmount: number;
  shippingFee: number;
  deliveryMethod: DeliveryMethod;
  grandTotal: number;
  notes: string;
  onNotesChange: (val: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotalAmount,
  shippingFee,
  deliveryMethod,
  grandTotal,
  notes,
  onNotesChange,
}) => {
  const activeItems = cartItems.filter((i) => i.quantity > 0);

  return (
    <section className="bg-white rounded-[28px] shadow-xs border border-[#E5E1DA] p-5 sm:p-6 mb-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#F3EFEA]">
        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#FDE68A]">
          4
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-[#3E2723] font-heading">Ringkasan Pesanan</h2>
          <p className="text-xs text-[#6D4C41]">Rincian porsi, ongkir & total tagihan pesanan Anda</p>
        </div>
      </div>

      {/* Active Items Table / List */}
      {activeItems.length === 0 ? (
        <div className="text-center py-8 px-4 bg-[#F9F7F4] rounded-2xl border border-dashed border-[#D7CCC8] mb-4">
          <ShoppingCart className="w-10 h-10 text-[#BCAAA4] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#5D4037]">Belum ada menu yang dipilih</p>
          <p className="text-xs text-[#8D6E63] mt-1">
            Silakan tekan tombol <strong className="text-[#F59E0B]">+</strong> pada menu di atas untuk menambah pesanan
          </p>
        </div>
      ) : (
        <div className="bg-[#F9F7F4] rounded-2xl border border-[#E5E1DA] p-4 mb-4 space-y-2.5">
          {activeItems.map((item) => {
            const sub = item.product.price * item.quantity;
            return (
              <div
                key={item.product.id}
                className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-dashed border-[#E5E1DA] last:border-0"
              >
                <div>
                  <span className="font-bold text-[#3E2723] block">
                    {item.product.name}
                  </span>
                  <span className="text-[11px] text-[#6D4C41]">
                    {item.quantity} porsi x {formatRupiah(item.product.price)}
                  </span>
                </div>
                <span className="font-extrabold text-[#3E2723]">
                  {formatRupiah(sub)}
                </span>
              </div>
            );
          })}

          {/* Delivery Method Summary & Ongkir */}
          <div className="pt-2 border-t border-[#E5E1DA] space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[#6D4C41]">
              <span>Subtotal Menu:</span>
              <span className="font-bold text-[#3E2723]">{formatRupiah(subtotalAmount)}</span>
            </div>

            <div className="flex justify-between items-center text-[#6D4C41]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#F59E0B]" />
                {getDeliveryMethodLabel(deliveryMethod, shippingFee)}:
              </span>
              <span className="font-bold text-[#3E2723]">
                {deliveryMethod === 'delivery' ? formatRupiah(shippingFee) : 'Rp0'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D7CCC8] flex items-center justify-between font-extrabold text-base text-[#3E2723]">
            <span className="flex items-center gap-1.5 font-heading">
              <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
              Total Bayar:
            </span>
            <span className="text-[#F59E0B] text-xl font-heading">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Catatan Tambahan (Opsional) */}
      <div>
        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          Catatan Tambahan (Opsional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Contoh: tidak pedas, saos dipisah, taruh di meja depan rumah, dll."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-[#3E2723] text-sm placeholder-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] focus:bg-white transition-all resize-none"
        />
      </div>
    </section>
  );
};

