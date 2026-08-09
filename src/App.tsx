import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, MessageSquare, ExternalLink, RefreshCw, Heart, Flame, Sparkles, Truck, ShieldCheck, ShoppingBag, Store, MapPin, AlertCircle } from 'lucide-react';
import { CustomerInfo, CartItem, GPSLocation, StoreConfig, Product } from './types';
import { DEFAULT_STORE_CONFIG, DEFAULT_PRODUCTS, EXTRA_ADDONS } from './data/defaultProducts';
import { buildWhatsAppMessage, createWhatsAppLink, formatRupiah, getDeliveryMethodLabel } from './utils/whatsapp';
import { Header } from './components/Header';
import { CustomerForm } from './components/CustomerForm';
import { MenuList } from './components/MenuList';
import { LocationPicker } from './components/LocationPicker';
import { OrderSummary } from './components/OrderSummary';
import { StickyBottomBar } from './components/StickyBottomBar';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { PekalonganInfoBadge } from './components/PekalonganInfoBadge';

const CONFIG_STORAGE_KEY = 'pekalongan_dimsum_store_config_v2';
const CUSTOMER_STORAGE_KEY = 'pekalongan_dimsum_customer_v2';
const PRODUCTS_STORAGE_KEY = 'pekalongan_dimsum_products_v2';
const EXTRA_ADDONS_STORAGE_KEY = 'pekalongan_dimsum_extras_v2';

export default function App() {
  // Realtime Current Clock
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Store Config State
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  // Dynamic Main Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Dynamic Extra Addons State
  const [extraAddons, setExtraAddons] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(EXTRA_ADDONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : EXTRA_ADDONS;
    } catch {
      return EXTRA_ADDONS;
    }
  });

  // Customer Info State
  const [customer, setCustomer] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { name: '', phone: '', address: '', notes: '', deliveryMethod: 'cod', paymentMethod: 'cash' };
    } catch {
      return { name: '', phone: '', address: '', notes: '', deliveryMethod: 'cod', paymentMethod: 'cash' };
    }
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const all = [...products, ...extraAddons];
    return all.map((p) => ({ product: p, quantity: 0 }));
  });

  // Synchronize cartItems when products or extra addons list is updated
  useEffect(() => {
    setCartItems((prev) => {
      const all = [...products, ...extraAddons];
      return all.map((p) => {
        const existing = prev.find((item) => item.product.id === p.id);
        return {
          product: p,
          quantity: existing ? existing.quantity : 0,
        };
      });
    });
  }, [products, extraAddons]);

  // Location State
  const [location, setLocation] = useState<GPSLocation | null>(null);

  // Settings Modal & Success Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastOrderWaUrl, setLastOrderWaUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Save customer info in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // ignore storage error
    }
  }, [customer]);

  // Save config in localStorage
  const handleSaveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  // Save products in localStorage
  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
    } catch {
      // ignore
    }
  };

  // Save extra addons in localStorage
  const handleSaveExtraAddons = (newExtraAddons: Product[]) => {
    setExtraAddons(newExtraAddons);
    try {
      localStorage.setItem(EXTRA_ADDONS_STORAGE_KEY, JSON.stringify(newExtraAddons));
    } catch {
      // ignore
    }
  };

  const handleCustomerChange = (field: keyof CustomerInfo, value: any) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Realtime PO Deadline & Quota Status Check
  const isClosedByDeadline = config.poClosedDeadline
    ? now >= new Date(config.poClosedDeadline)
    : false;

  const isQuotaFull = Boolean(
    (config.enableQuotaLimit ?? true) &&
    config.maxQuota &&
    config.maxQuota > 0 &&
    (config.soldQuota ?? 0) >= config.maxQuota
  );

  const isPoOpenEffective = (config.isPoOpen !== false) && !isClosedByDeadline && !isQuotaFull;

  // Calculate Remaining Time String
  const getRemainingTimeString = () => {
    if (!config.poClosedDeadline) return null;
    const deadline = new Date(config.poClosedDeadline);
    const diffMs = deadline.getTime() - now.getTime();
    if (diffMs <= 0) return null;

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (days > 0) {
      return `${days} Hari ${hours} Jam ${mins} Mnt`;
    }
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTimeStr = getRemainingTimeString();

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  const currentShippingFee = config.shippingFee ?? 5000;
  const shippingCost = customer.deliveryMethod === 'cod' ? currentShippingFee : 0;
  const grandTotal = subtotalAmount + shippingCost;

  // Validation
  const isNameValid = customer.name.trim().length >= 2;
  const isPhoneValid = customer.phone.trim().length >= 8;
  const isMenuValid = totalItems > 0;
  const isLocationValid = location !== null || customer.address.trim().length >= 3;

  const isValid = isPoOpenEffective && isNameValid && isPhoneValid && isMenuValid && isLocationValid;

  let validationError: string | null = null;
  if (!isPoOpenEffective) {
    if (isQuotaFull) {
      validationError = `Maaf, Kuota Pre-Order telah PENUH (${config.soldQuota || 0}/${config.maxQuota} Porsi / Full Booked).`;
    } else if (isClosedByDeadline) {
      validationError = 'Maaf, Pendaftaran Open PO telah ditutup secara otomatis (melewati deadline realtime).';
    } else {
      validationError = 'Maaf, Pendaftaran Open PO saat ini sedang TUTUP / FULL BOOKED';
    }
  } else if (!isNameValid) {
    validationError = 'Mohon isi Nama Lengkap Anda';
  } else if (!isPhoneValid) {
    validationError = 'Mohon isi Nomor WhatsApp (min 8 digit)';
  } else if (!isMenuValid) {
    validationError = 'Pilih minimal 1 porsi Dimsum / Ayam Keju / Ekstra';
  } else if (!isLocationValid) {
    validationError = 'Klik Gunakan Lokasi Saya atau isi alamat manual';
  }

  // Handle Order Submit
  const handleSubmitOrder = () => {
    if (!isValid) return;

    // Automatically update sold quota count
    const updatedSoldQuota = (config.soldQuota || 0) + totalItems;
    const updatedConfig = { ...config, soldQuota: updatedSoldQuota };
    handleSaveConfig(updatedConfig);

    const message = buildWhatsAppMessage(
      customer,
      cartItems,
      subtotalAmount,
      currentShippingFee,
      grandTotal,
      location,
      config.poReadyAt,
      config.bankDetails
    );
    const waUrl = createWhatsAppLink(config.whatsappNumber, message);

    setLastOrderWaUrl(waUrl);
    setShowSuccessModal(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#D97706', '#25D366', '#3E2723'],
      });
    } catch {
      // ignore
    }

    // Open WhatsApp Click to Chat
    window.open(waUrl, '_blank');
  };

  const handleResetForm = () => {
    setCartItems((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
    setLocation(null);
    setShowSuccessModal(false);
  };

  const activeCartList = cartItems.filter((i) => i.quantity > 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-28 text-[#3E2723]">
      {/* Top Banner Accent */}
      <div className="bg-[#3E2723] text-white py-2 px-4 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>Pemesanan Dimsum & Ayam Keju Pekalongan • Kirim Langsung via WA</span>
      </div>

      {/* Main Bento Grid Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT BENTO COLUMN (Visible on lg/xl screens) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-6">
            {/* Bento Box 1: Brand Highlight */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E5E1DA] shadow-xs relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold mb-4 border border-[#FDE68A]">
                <Flame className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <span className={`text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isPoOpenEffective ? 'bg-[#F59E0B]' : 'bg-red-600'
              }`}>
                {isPoOpenEffective ? config.poBadgeText : 'PO TUTUP'}
              </span>
              <h2 className="text-xl font-extrabold text-[#3E2723] mt-2 font-heading leading-snug">
                {config.storeName}
              </h2>
              <p className="text-xs text-[#6D4C41] mt-2 leading-relaxed">
                Spesialis Dimsum Goreng Krispi & Ayam Keju Lumer Pekalongan. Setiap porsi GRATIS Saos Bangkok khas!
              </p>
              
              <div className="mt-4 pt-4 border-t border-[#F3EFEA] space-y-2 text-xs">
                {products.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex justify-between font-medium">
                    <span className="text-[#8D6E63] truncate pr-2">{p.name} ({p.portion})</span>
                    <span className="font-extrabold text-[#F59E0B] shrink-0">{formatRupiah(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Box 2: Dark Accent Quality Guarantee */}
            <div className="bg-[#3E2723] text-white rounded-[32px] p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-3 text-[#F59E0B]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Kualitas Terjamin</span>
              </div>
              <h3 className="font-extrabold text-base mb-2 font-heading">
                Dibuat Fresh Saat Ada Order
              </h3>
              <p className="text-xs text-[#D7CCC8] leading-relaxed">
                Olahan daging pilihan, gurih krispi di luar, lembut di dalam. 100% Halal & Higienis.
              </p>
            </div>

            {/* Bento Box 3: Social & Promo Badge */}
            <div className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-[32px] p-5 text-center">
              <span className="text-2xl mb-1 block">📱 Order via TikTok / IG</span>
              <p className="text-xs font-bold">Favorit Kuliner Pekalongan</p>
              <p className="text-[11px] text-[#B45309] mt-1">
                Tinggal klik menu di tengah, otomatis terhubung ke WA admin!
              </p>
            </div>
          </div>

          {/* CENTER BENTO COLUMN (The Main Mobile Ordering Form) */}
          <div className="lg:col-span-6 max-w-md lg:max-w-none mx-auto w-full">
            {/* Store Header */}
            <Header
              config={config}
              isPoOpenEffective={isPoOpenEffective}
              remainingTimeStr={remainingTimeStr}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Closed PO Warning Banner */}
            {!isPoOpenEffective && (
              <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 mb-5 text-center space-y-1 animate-pulse">
                <div className="flex items-center justify-center gap-1.5 font-black text-sm text-red-700">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span>
                    {isQuotaFull
                      ? 'KUOTA PO PENUH / FULL BOOKED'
                      : 'PENDAFTARAN OPEN PO SEDANG TUTUP'}
                  </span>
                </div>
                <p className="text-xs text-red-800">
                  {isQuotaFull
                    ? `Kuota pesanan maksimal ${config.maxQuota} porsi telah terpenuhi (${config.soldQuota}/${config.maxQuota} porsi terisi). Sampai jumpa di Open PO berikutnya!`
                    : isClosedByDeadline
                    ? 'Waktu pendaftaran order telah habis otomatis berdasarkan tanggal closed PO.'
                    : 'Saat ini pendaftaran order sedang ditutup/full booked. Nantikan jadwal Open PO berikutnya!'}
                </p>
              </div>
            )}

            {/* Pekalongan Info Badge */}
            <PekalonganInfoBadge />

            {/* Step 1: Customer Data & Delivery Method */}
            <CustomerForm
              customer={customer}
              shippingFee={currentShippingFee}
              bankDetails={config.bankDetails}
              onChange={handleCustomerChange}
            />

            {/* Step 2: Choose Menu & Extra Addons */}
            <MenuList
              products={products}
              extraAddons={extraAddons}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
            />

            {/* Step 3: Location Picker (GPS + Manual Address) */}
            <LocationPicker
              location={location}
              onLocationChange={setLocation}
              address={customer.address}
              onAddressChange={(val) => handleCustomerChange('address', val)}
            />

            {/* Step 4: Order Summary & Notes */}
            <OrderSummary
              cartItems={cartItems}
              subtotalAmount={subtotalAmount}
              shippingFee={currentShippingFee}
              deliveryMethod={customer.deliveryMethod}
              grandTotal={grandTotal}
              notes={customer.notes}
              onNotesChange={(val) => handleCustomerChange('notes', val)}
            />

            {/* Big Order Button */}
            <div className="mb-8">
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={!isValid}
                className={`w-full py-4 px-5 rounded-[24px] font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isValid
                    ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:opacity-95 cursor-pointer shadow-green-200'
                    : 'bg-[#E5E1DA] text-[#8D6E63] cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-5 h-5 fill-current" />
                <span>PESAN SEKARANG VIA WHATSAPP</span>
              </button>
              {!isValid && validationError && (
                <p className="text-center text-xs text-amber-900 mt-2 font-bold bg-amber-50 py-2 px-3 rounded-xl border border-amber-200">
                  ⚠️ {validationError}
                </p>
              )}
            </div>

            {/* Footer info */}
            <footer className="text-center text-xs text-[#8D6E63] py-4 space-y-1 border-t border-[#E5E1DA]">
              <p className="font-extrabold text-[#3E2723] font-heading">{config.storeName}</p>
              <p>Dibuat khusus untuk Kemudahan Order Pelanggan TikTok & Instagram</p>
              <p className="text-[11px] text-[#A1887F] flex items-center justify-center gap-1 mt-1">
                Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-current" /> Pekalongan Kuliner
              </p>
            </footer>
          </div>

          {/* RIGHT BENTO COLUMN (Visible on lg/xl screens) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-6">
            {/* Bento Box 1: Live Order Summary Card */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E5E1DA] shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F3EFEA]">
                <ShoppingBag className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-extrabold text-base text-[#3E2723] font-heading">
                  Rincian Live Order
                </h3>
              </div>

              {activeCartList.length === 0 ? (
                <p className="text-xs text-[#8D6E63] text-center py-6 border border-dashed border-[#E5E1DA] rounded-2xl">
                  Belum ada item dipilih
                </p>
              ) : (
                <div className="space-y-3">
                  {activeCartList.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs border-b border-dashed border-[#F3EFEA] pb-2">
                      <div>
                        <span className="font-bold text-[#3E2723] block">{item.product.name}</span>
                        <span className="text-[11px] text-[#8D6E63]">{item.quantity} porsi</span>
                      </div>
                      <span className="font-extrabold text-[#F59E0B]">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-[#E5E1DA] text-xs space-y-1 text-[#6D4C41]">
                    <div className="flex justify-between">
                      <span>Subtotal Menu:</span>
                      <span className="font-bold text-[#3E2723]">{formatRupiah(subtotalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkir:</span>
                      <span className="font-bold text-[#3E2723]">
                        {customer.deliveryMethod === 'delivery' ? formatRupiah(currentShippingFee) : 'Rp0'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-sm font-black text-[#3E2723] border-t border-[#E5E1DA]">
                    <span>Total Tagihan:</span>
                    <span className="text-[#F59E0B] text-base">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bento Box 2: Delivery Area Info */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E5E1DA] shadow-xs text-center">
              <Truck className="w-8 h-8 text-[#D97706] mx-auto mb-2" />
              <h4 className="font-extrabold text-sm text-[#3E2723] font-heading">
                Pengiriman Pekalongan
              </h4>
              <p className="text-xs text-[#6D4C41] mt-1">
                Bisa COD / Dianter Cepat (Ongkir {formatRupiah(currentShippingFee)}) / Ambil Sendiri.
              </p>
            </div>

            {/* Bento Box 3: Quick Owner WA Settings */}
            <div className="bg-[#F9F7F4] rounded-[32px] p-5 border border-[#E5E1DA] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D6E63] block">Admin Toko</span>
                <span className="text-xs font-bold text-[#3E2723]">{config.whatsappNumber}</span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 bg-white rounded-xl text-[#3E2723] border border-[#E5E1DA] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
                title="Atur Toko (Owner Only)"
              >
                <Store className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile TikTok/IG users */}
      <StickyBottomBar
        totalItems={totalItems}
        totalAmount={grandTotal}
        isValid={isValid}
        validationError={validationError}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Store Owner Settings Drawer/Modal */}
      <StoreSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        products={products}
        onSaveProducts={handleSaveProducts}
        extraAddons={extraAddons}
        onSaveExtraAddons={handleSaveExtraAddons}
      />

      {/* Order Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl border border-[#E5E1DA] space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-[#3E2723] font-heading">
                Pesanan Berhasil Disiapkan!
              </h3>
              <p className="text-xs text-[#6D4C41] mt-1 leading-relaxed">
                Aplikasi sedang membuka WhatsApp otomatis untuk mengirimkan rincian pesanan Anda ke penjual.
              </p>
            </div>

            <div className="bg-[#F9F7F4] p-3.5 rounded-2xl text-left border border-[#E5E1DA] text-xs space-y-1 font-mono text-[#3E2723]">
              <div className="font-sans font-bold border-b border-[#E5E1DA] pb-1 text-[#3E2723]">
                Ringkasan Order:
              </div>
              <div>Pemesan: {customer.name}</div>
              <div>Metode: {getDeliveryMethodLabel(customer.deliveryMethod, currentShippingFee)}</div>
              <div>Total Bayar: {formatRupiah(grandTotal)}</div>
              <div>Lokasi: {location ? 'GPS Terlampir 📍' : 'Alamat Manual'}</div>
            </div>

            <div className="space-y-2 pt-2">
              {lastOrderWaUrl && (
                <a
                  href={lastOrderWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Buka WhatsApp Lagi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#8D6E63] hover:bg-[#F9F7F4] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Buat Pesanan Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

