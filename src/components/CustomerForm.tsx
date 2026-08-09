import React, { useState } from 'react';
import { User, Phone, CheckCircle2, AlertCircle, Truck, Banknote, Store, CreditCard, Copy, Check } from 'lucide-react';
import { CustomerInfo, DeliveryMethod, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/whatsapp';

interface CustomerFormProps {
  customer: CustomerInfo;
  shippingFee: number;
  bankDetails?: string;
  onChange: (field: keyof CustomerInfo, value: any) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, shippingFee, bankDetails, onChange }) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const isNameValid = customer.name.trim().length >= 2;
  const isPhoneValid = customer.phone.trim().length >= 8;

  const handleCopyBank = () => {
    if (bankDetails) {
      navigator.clipboard.writeText(bankDetails);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  return (
    <section className="bg-white rounded-[28px] shadow-xs border border-[#E5E1DA] p-5 sm:p-6 mb-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#F3EFEA]">
        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#FDE68A]">
          1
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-[#3E2723] font-heading">Data Pemesan & Pembayaran</h2>
          <p className="text-xs text-[#6D4C41]">Isi nama, WA, pengiriman, dan cara bayar</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customer.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Contoh: Budi Santoso / Rina Pekalongan"
              className={`w-full px-4 py-2.5 rounded-xl border bg-[#F9F7F4] text-[#3E2723] text-sm placeholder-[#A1887F] focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                customer.name && !isNameValid
                  ? 'border-red-400 focus:ring-red-200'
                  : isNameValid
                  ? 'border-green-400 focus:ring-green-100'
                  : 'border-[#E5E1DA] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20'
              }`}
            />
            {isNameValid && (
              <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3.5 top-3" />
            )}
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Nomor WhatsApp <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-[#8D6E63] font-normal normal-case">untuk konfirmasi order</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                onChange('phone', val);
              }}
              placeholder="Contoh: 081234567890"
              className={`w-full px-4 py-2.5 rounded-xl border bg-[#F9F7F4] text-[#3E2723] text-sm placeholder-[#A1887F] focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                customer.phone && !isPhoneValid
                  ? 'border-red-400 focus:ring-red-200'
                  : isPhoneValid
                  ? 'border-green-400 focus:ring-green-100'
                  : 'border-[#E5E1DA] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20'
              }`}
            />
            {isPhoneValid && (
              <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3.5 top-3" />
            )}
          </div>
          {customer.phone && !isPhoneValid && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Nomor WA minimal 8-13 digit angka
            </p>
          )}
        </div>

        {/* Metode Pengiriman Selection */}
        <div>
          <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            Pilih Metode Pengiriman <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* COD / Dianter Option */}
            <button
              type="button"
              onClick={() => onChange('deliveryMethod', 'cod')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                customer.deliveryMethod === 'cod' || !customer.deliveryMethod
                  ? 'bg-[#FEF3C7] border-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-2xs'
                  : 'bg-[#F9F7F4] border-[#E5E1DA] hover:border-[#D7CCC8]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#D97706]" />
                  <span className="font-extrabold text-xs text-[#3E2723]">🚚 COD / Dianter Ke Alamat</span>
                </div>
                <span className="bg-[#F59E0B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  +{formatRupiah(shippingFee)}
                </span>
              </div>
              <p className="text-[10px] text-[#8D6E63]">Dianter ke alamat & bayar ongkir di tempat</p>
            </button>

            {/* Ambil Sendiri / Pick-up Option */}
            <button
              type="button"
              onClick={() => onChange('deliveryMethod', 'pickup')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                customer.deliveryMethod === 'pickup'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-2xs'
                  : 'bg-[#F9F7F4] border-[#E5E1DA] hover:border-[#D7CCC8]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs text-[#3E2723]">🏪 Ambil Sendiri (Pick-up)</span>
                </div>
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  GRATIS
                </span>
              </div>
              <p className="text-[10px] text-[#8D6E63]">Ambil sendiri langsung di outlet toko (Tanpa Ongkir)</p>
            </button>
          </div>
        </div>

        {/* Metode Pembayaran (Cash vs Transfer) */}
        <div>
          <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            Pilih Metode Pembayaran <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* Cash Option */}
            <button
              type="button"
              onClick={() => onChange('paymentMethod', 'cash')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                customer.paymentMethod === 'cash' || !customer.paymentMethod
                  ? 'bg-[#FEF3C7] border-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-2xs'
                  : 'bg-[#F9F7F4] border-[#E5E1DA] hover:border-[#D7CCC8]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-[#3E2723]">💵 Cash (Tunai)</span>
              </div>
              <p className="text-[10px] text-[#8D6E63]">Bayar cash tunai di tempat / saat ambil</p>
            </button>

            {/* Transfer Option */}
            <button
              type="button"
              onClick={() => onChange('paymentMethod', 'transfer')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                customer.paymentMethod === 'transfer'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-2xs'
                  : 'bg-[#F9F7F4] border-[#E5E1DA] hover:border-[#D7CCC8]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="font-extrabold text-xs text-[#3E2723]">💳 Transfer / QRIS</span>
              </div>
              <p className="text-[10px] text-[#8D6E63]">Transfer via Bank / DANA / QRIS</p>
            </button>
          </div>

          {/* If Transfer is selected, display Store Bank Details */}
          {customer.paymentMethod === 'transfer' && (
            <div className="mt-3 p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold flex items-center gap-1 text-blue-900">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Rekening Tujuan Transfer:
                </span>
                {bankDetails && (
                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBank ? 'Tercopy!' : 'Copy Rekening'}</span>
                  </button>
                )}
              </div>
              <p className="text-xs font-mono font-bold whitespace-pre-line bg-white/80 p-2.5 rounded-xl border border-blue-200 text-blue-950">
                {bankDetails || 'BCA: 1234567890 a/n Pekalongan Kuliner\nDANA / ShopeePay: 085712345678'}
              </p>
              <p className="text-[10px] text-blue-700 mt-1.5 font-medium">
                *Bukti transfer dapat dikirimkan langsung via WA setelah menekan tombol Pesan.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

