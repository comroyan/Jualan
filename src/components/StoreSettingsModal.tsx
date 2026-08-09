import React, { useState } from 'react';
import { X, Save, Phone, Store, MapPin, Check, Lock, KeyRound, Calendar, Truck, Utensils, Plus, Trash2, Edit, Image as ImageIcon, Sparkles, AlertCircle, CreditCard, Clock, PlusCircle, Package } from 'lucide-react';
import { Product, StoreConfig } from '../types';
import { formatRupiah } from '../utils/whatsapp';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onSaveConfig: (newConfig: StoreConfig) => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  extraAddons: Product[];
  onSaveExtraAddons: (newExtraAddons: Product[]) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  products,
  onSaveProducts,
  extraAddons,
  onSaveExtraAddons,
}) => {
  // PIN Protection State
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Settings Tab State
  const [activeTab, setActiveTab] = useState<'store' | 'menu'>('store');
  const [menuSubTab, setMenuSubTab] = useState<'main' | 'extra'>('main');

  // Store Configuration Form State
  const [storeName, setStoreName] = useState(config.storeName);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [poBadgeText, setPoBadgeText] = useState(config.poBadgeText);
  const [areaText, setAreaText] = useState(config.areaText);
  const [isPoOpen, setIsPoOpen] = useState(config.isPoOpen ?? true);
  const [poClosedAt, setPoClosedAt] = useState(config.poClosedAt || 'Jumat, 18:00 WIB');
  const [poClosedDeadline, setPoClosedDeadline] = useState(config.poClosedDeadline || '2026-12-31T18:00');
  const [poReadyAt, setPoReadyAt] = useState(config.poReadyAt || 'Sabtu, 10:00 WIB');
  const [shippingFee, setShippingFee] = useState(config.shippingFee ?? 5000);
  const [ownerPin, setOwnerPin] = useState(config.ownerPin || '1234');
  const [bankDetails, setBankDetails] = useState(config.bankDetails || 'BCA: 1234567890 a/n Pekalongan Kuliner\nDANA: 085712345678');
  const [enableQuotaLimit, setEnableQuotaLimit] = useState(config.enableQuotaLimit ?? true);
  const [maxQuota, setMaxQuota] = useState(config.maxQuota ?? 50);
  const [soldQuota, setSoldQuota] = useState(config.soldQuota ?? 18);
  const [isSaved, setIsSaved] = useState(false);

  // Menu Manager State (Main Products & Extras)
  const [menuList, setMenuList] = useState<Product[]>(products);
  const [addonList, setAddonList] = useState<Product[]>(extraAddons);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New/Edit Product Form State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPortion, setProdPortion] = useState('');
  const [prodPrice, setProdPrice] = useState(15000);
  const [prodImage, setProdImage] = useState('');
  const [prodBadge, setProdBadge] = useState('');
  const [prodFreeSauce, setProdFreeSauce] = useState('Free Saos Bangkok Spesial');

  if (!isOpen) return null;

  // Handle PIN Login Verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === (config.ownerPin || '1234')) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Handle Save Store Configuration
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      storeName: storeName.trim() || 'Dimsum & Ayam Keju Pekalongan',
      whatsappNumber: whatsappNumber.replace(/[^0-9]/g, '') || '6285712345678',
      poBadgeText: poBadgeText.trim() || 'Open PO Buka',
      areaText: areaText.trim() || 'Pekalongan & Sekitarnya',
      isPoOpen,
      poClosedAt: poClosedAt.trim(),
      poClosedDeadline: poClosedDeadline.trim(),
      poReadyAt: poReadyAt.trim(),
      shippingFee: Number(shippingFee) || 0,
      ownerPin: ownerPin.trim() || '1234',
      bankDetails: bankDetails.trim(),
      enableQuotaLimit,
      maxQuota: Number(maxQuota) || 0,
      soldQuota: Number(soldQuota) || 0,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1200);
  };

  // Open Product Editor
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingNew(false);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPortion(prod.portion);
    setProdPrice(prod.price);
    setProdImage(prod.image);
    setProdBadge(prod.badge || '');
    setProdFreeSauce(prod.freeSauce || 'Free Saos Bangkok Spesial');
  };

  // Open New Product Creator
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    setProdName('');
    setProdDesc('');
    if (menuSubTab === 'main') {
      setProdPortion('Isi 3 Pcs');
      setProdPrice(15000);
      setProdImage('https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80');
      setProdBadge('BARU 🌶️');
      setProdFreeSauce('Free Saos Bangkok Spesial');
    } else {
      setProdPortion('1 Cup / Porsi');
      setProdPrice(2000);
      setProdImage('https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80');
      setProdBadge('EKSTRA 🌶️');
      setProdFreeSauce('Tambahan Ekstra');
    }
  };

  // Save Product (Create or Edit) for Main Menu or Extra Addons
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (menuSubTab === 'main') {
      let updatedProducts: Product[];
      if (isCreatingNew) {
        const newProd: Product = {
          id: `custom-main-${Date.now()}`,
          name: prodName.trim() || 'Menu Baru',
          description: prodDesc.trim() || 'Deskripsi makanan',
          portion: prodPortion.trim() || 'Isi 1 Porsi',
          price: Number(prodPrice) || 10000,
          image: prodImage.trim() || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
          badge: prodBadge.trim(),
          freeSauce: prodFreeSauce.trim() || 'Free Saos Bangkok',
        };
        updatedProducts = [...menuList, newProd];
      } else if (editingProduct) {
        updatedProducts = menuList.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: prodName.trim(),
                description: prodDesc.trim(),
                portion: prodPortion.trim(),
                price: Number(prodPrice) || 0,
                image: prodImage.trim(),
                badge: prodBadge.trim(),
                freeSauce: prodFreeSauce.trim(),
              }
            : p
        );
      } else {
        return;
      }
      setMenuList(updatedProducts);
      onSaveProducts(updatedProducts);
    } else {
      // Extra Addons
      let updatedAddons: Product[];
      if (isCreatingNew) {
        const newAddon: Product = {
          id: `custom-extra-${Date.now()}`,
          name: prodName.trim() || 'Ekstra Tambahan',
          description: prodDesc.trim() || 'Deskripsi ekstra',
          portion: prodPortion.trim() || '1 Porsi',
          price: Number(prodPrice) || 2000,
          image: prodImage.trim() || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
          badge: prodBadge.trim(),
          freeSauce: prodFreeSauce.trim() || 'Ekstra Tambahan',
        };
        updatedAddons = [...addonList, newAddon];
      } else if (editingProduct) {
        updatedAddons = addonList.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: prodName.trim(),
                description: prodDesc.trim(),
                portion: prodPortion.trim(),
                price: Number(prodPrice) || 0,
                image: prodImage.trim(),
                badge: prodBadge.trim(),
                freeSauce: prodFreeSauce.trim(),
              }
            : p
        );
      } else {
        return;
      }
      setAddonList(updatedAddons);
      onSaveExtraAddons(updatedAddons);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus item ini?')) {
      if (menuSubTab === 'main') {
        const updated = menuList.filter((p) => p.id !== id);
        setMenuList(updated);
        onSaveProducts(updated);
      } else {
        const updated = addonList.filter((p) => p.id !== id);
        setAddonList(updated);
        onSaveExtraAddons(updated);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-[#E5E1DA] p-5 sm:p-6 relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#3E2723] font-heading flex items-center gap-1.5">
                Pengaturan Toko (Owner Only)
              </h3>
              <p className="text-xs text-[#6D4C41]">Kelola PO Realtime, Rekening Bank & Ekstra Add-ons</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F9F7F4] text-[#8D6E63] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PIN AUTHENTICATION LOCK IF NOT VERIFIED */}
        {!isAuthenticated ? (
          <div className="py-8 px-4 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto border border-[#FDE68A] shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-[#3E2723] font-heading">
                Masukkan PIN Khusus Owner
              </h4>
              <p className="text-xs text-[#6D4C41] mt-1">
                Area ini dilindungi agar pembeli tidak bisa mengubah menu & nomor WA tujuan.
              </p>
              <p className="text-[11px] text-[#D97706] font-bold mt-1">
                (PIN Bawaan Default: <span className="underline">1234</span>)
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Masukkan PIN (e.g. 1234)"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-2xl border border-[#E5E1DA] bg-[#F9F7F4] text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                autoFocus
              />

              {pinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 py-1.5 px-3 rounded-xl border border-red-200 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> PIN Salah! Coba lagi (Default: 1234)
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#3E2723] hover:bg-[#4E342E] text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Lock className="w-4 h-4 text-[#F59E0B]" />
                <span>Buka Pengaturan Toko</span>
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: AUTHENTICATED OWNER CONTROL PANEL */
          <div className="flex-1 overflow-y-auto pt-4 space-y-4">
            {/* Top Navigation Tabs */}
            <div className="flex bg-[#F9F7F4] p-1 rounded-2xl border border-[#E5E1DA]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('store');
                  setEditingProduct(null);
                  setIsCreatingNew(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'store'
                    ? 'bg-white text-[#3E2723] shadow-xs border border-[#E5E1DA]'
                    : 'text-[#8D6E63] hover:text-[#3E2723]'
                }`}
              >
                <Store className="w-4 h-4 text-[#F59E0B]" />
                <span>Status PO & Bank</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('menu');
                  setEditingProduct(null);
                  setIsCreatingNew(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-white text-[#3E2723] shadow-xs border border-[#E5E1DA]'
                    : 'text-[#8D6E63] hover:text-[#3E2723]'
                }`}
              >
                <Utensils className="w-4 h-4 text-[#F59E0B]" />
                <span>Kelola Menu & Ekstra ({menuList.length + addonList.length})</span>
              </button>
            </div>

            {/* TAB 1: STORE CONFIGURATION, REALTIME PO & BANK DETAILS */}
            {activeTab === 'store' && (
              <form onSubmit={handleSaveStoreConfig} className="space-y-4">
                {/* Status PO Toggle (Open / Closed) */}
                <div className="p-3.5 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A]">
                  <label className="block text-[10px] font-bold text-[#D97706] uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Status Manual Pendaftaran Open PO</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] text-white font-bold ${
                      isPoOpen ? 'bg-emerald-600' : 'bg-red-600'
                    }`}>
                      {isPoOpen ? 'PO Buka' : 'PO Tutup'}
                    </span>
                  </label>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPoOpen(true)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPoOpen
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-[#3E2723] border border-[#E5E1DA]'
                      }`}
                    >
                      🟢 PO Sedang Buka
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPoOpen(false)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        !isPoOpen
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-[#3E2723] border border-[#E5E1DA]'
                      }`}
                    >
                      🔴 PO Tutup / Full
                    </button>
                  </div>
                </div>

                {/* Realtime Datetime Picker for Auto Closing Order */}
                <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#FDE68A] space-y-2">
                  <label className="block text-[10px] font-bold text-[#D97706] uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Waktu Realtime Otomatis Closed Order (Sistem Realtime)
                  </label>
                  <input
                    type="datetime-local"
                    value={poClosedDeadline}
                    onChange={(e) => setPoClosedDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs font-bold font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                  <p className="text-[10px] text-[#8D6E63]">
                    💡 Setelah tanggal & jam di atas terlewati, pendaftaran PO akan <strong>otomatis terkunci realtime</strong> bagi pembeli.
                  </p>
                </div>

                {/* Quota Limit Settings Card */}
                <div className="p-3.5 rounded-2xl bg-[#FEF3C7]/40 border border-[#FDE68A] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-[#78350F] uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#D97706]" />
                      Sistem Batasan Kuota Pesanan (Porsi)
                    </label>
                    <button
                      type="button"
                      onClick={() => setEnableQuotaLimit(!enableQuotaLimit)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                        enableQuotaLimit ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {enableQuotaLimit ? 'Aktif' : 'Non-aktif'}
                    </button>
                  </div>

                  {enableQuotaLimit && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8D6E63] uppercase mb-1">
                          Batas Maksimal Kuota (Porsi):
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={maxQuota}
                          onChange={(e) => setMaxQuota(Number(e.target.value))}
                          placeholder="e.g. 50"
                          className="w-full px-3 py-1.5 rounded-xl border border-[#E5E1DA] bg-white text-xs font-bold font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8D6E63] uppercase mb-1">
                          Porsi Terjual Saat Ini:
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={soldQuota}
                            onChange={(e) => setSoldQuota(Number(e.target.value))}
                            placeholder="e.g. 18"
                            className="w-full px-3 py-1.5 rounded-xl border border-[#E5E1DA] bg-white text-xs font-bold font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                          />
                          <button
                            type="button"
                            onClick={() => setSoldQuota(0)}
                            title="Reset Terjual ke 0"
                            className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-[10px] font-bold shrink-0 cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <p className="col-span-1 sm:col-span-2 text-[10px] text-[#8D6E63]">
                        💡 Jika porsi terjual telah mencapai/melebihi batas maksimal, formulir pesanan akan otomatis terkunci <strong>FULL BOOKED</strong>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Text Description of PO Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      Teks Closed Order (Info)
                    </label>
                    <input
                      type="text"
                      value={poClosedAt}
                      onChange={(e) => setPoClosedAt(e.target.value)}
                      placeholder="Contoh: Jumat, 18:00 WIB"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Estimasi Ready / Dianter
                    </label>
                    <input
                      type="text"
                      value={poReadyAt}
                      onChange={(e) => setPoReadyAt(e.target.value)}
                      placeholder="Contoh: Sabtu, 10:00 WIB"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                </div>

                {/* Bank Account / Transfer Details */}
                <div>
                  <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    Rincian Rekening Bank / QRIS Pembayaran Transfer
                  </label>
                  <textarea
                    rows={2}
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    placeholder="BCA: 1234567890 a/n Pekalongan Kuliner&#10;DANA: 085712345678"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                  <p className="text-[10px] text-[#8D6E63] mt-0.5">
                    Ditampilkan saat pembeli memilih metode pembayaran Transfer.
                  </p>
                </div>

                {/* Ongkir Dianter Setting */}
                <div>
                  <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Biaya Ongkir Dianter (Nominal Rupiah)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#8D6E63]">Rp</span>
                    <input
                      type="number"
                      step={500}
                      value={shippingFee}
                      onChange={(e) => setShippingFee(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-mono font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                </div>

                {/* Store Name & WA Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                      Nama Toko
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Dimsum Pekalongan"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Nomor WA Toko
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="6285712345678"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                </div>

                {/* Owner Security PIN */}
                <div>
                  <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#3E2723]" />
                    PIN Keamanan Owner
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={ownerPin}
                    onChange={(e) => setOwnerPin(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-xs font-mono font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>

                {/* Submit Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#3E2723] text-white hover:bg-[#4E342E]'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Pengaturan Tersimpan!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Pengaturan Toko</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MANAGE MENU & EXTRA ADDONS */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                {/* Sub Tab Switcher (Menu Utama vs Tambahan Ekstra) */}
                <div className="flex bg-[#E5E1DA]/40 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuSubTab('main');
                      setEditingProduct(null);
                      setIsCreatingNew(false);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                      menuSubTab === 'main'
                        ? 'bg-white text-[#3E2723] shadow-2xs border border-[#E5E1DA]'
                        : 'text-[#8D6E63] hover:text-[#3E2723]'
                    }`}
                  >
                    🍲 Menu Utama ({menuList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuSubTab('extra');
                      setEditingProduct(null);
                      setIsCreatingNew(false);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                      menuSubTab === 'extra'
                        ? 'bg-white text-[#3E2723] shadow-2xs border border-[#E5E1DA]'
                        : 'text-[#8D6E63] hover:text-[#3E2723]'
                    }`}
                  >
                    ✨ Tambahan Ekstra ({addonList.length})
                  </button>
                </div>

                {/* Product Form (Create or Edit) */}
                {isCreatingNew || editingProduct ? (
                  <form onSubmit={handleSaveProductForm} className="bg-[#F9F7F4] p-4 rounded-2xl border border-[#E5E1DA] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5E1DA]">
                      <span className="font-extrabold text-xs text-[#3E2723] font-heading">
                        {isCreatingNew
                          ? `➕ Tambah ${menuSubTab === 'main' ? 'Menu Utama' : 'Ekstra Add-on'}`
                          : `✏️ Edit: ${editingProduct?.name}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreatingNew(false);
                        }}
                        className="text-xs text-[#8D6E63] underline cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                        Nama Items
                      </label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder={menuSubTab === 'main' ? 'e.g. Dimsum Mozzarella' : 'e.g. Extra Saos Bangkok'}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          required
                          step={500}
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          placeholder="15000"
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs font-mono font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                          Porsi / Ukuran
                        </label>
                        <input
                          type="text"
                          required
                          value={prodPortion}
                          onChange={(e) => setProdPortion(e.target.value)}
                          placeholder="Isi 3 Pcs / 1 Cup"
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Link URL Gambar
                      </label>
                      <input
                        type="url"
                        required
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs font-mono text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                      />
                      {prodImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={prodImage}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded-xl border border-[#E5E1DA]"
                          />
                          <span className="text-[10px] text-[#8D6E63]">Preview gambar</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Keterangan singkat..."
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                          Label Badge
                        </label>
                        <input
                          type="text"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="BEST SELLER 🌶️"
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">
                          Keterangan Saos / Info
                        </label>
                        <input
                          type="text"
                          value={prodFreeSauce}
                          onChange={(e) => setProdFreeSauce(e.target.value)}
                          placeholder="Free Saos Bangkok"
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E1DA] bg-white text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#F59E0B] text-white hover:bg-[#D97706] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isCreatingNew ? 'Simpan Baru' : 'Perbarui Items'}</span>
                    </button>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold text-[#3E2723]">
                        {menuSubTab === 'main' ? 'Daftar Menu Utama:' : 'Daftar Tambahan Ekstra:'}
                      </span>
                      <button
                        type="button"
                        onClick={handleOpenCreateProduct}
                        className="px-3 py-1.5 rounded-xl bg-[#F59E0B] text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#D97706] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah {menuSubTab === 'main' ? 'Menu' : 'Ekstra'}</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(menuSubTab === 'main' ? menuList : addonList).map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 bg-[#F9F7F4] rounded-2xl border border-[#E5E1DA] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-11 h-11 rounded-xl object-cover border border-[#E5E1DA] shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-extrabold text-xs text-[#3E2723] block truncate">
                                {prod.name}
                              </span>
                              <span className="text-[11px] text-[#8D6E63] font-bold">
                                {formatRupiah(prod.price)} • {prod.portion}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 bg-white rounded-xl text-[#3E2723] border border-[#E5E1DA] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#D97706]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 bg-white rounded-xl text-red-600 border border-[#E5E1DA] hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

