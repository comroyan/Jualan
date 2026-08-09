import { Product, StoreConfig } from '../types';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: "Dimsum & Ayam Keju Pekalongan",
  whatsappNumber: "6285712345678", // Default store WA number (easy to change in shop settings)
  poBadgeText: "Open PO Buka",
  areaText: "Khusus Area Pekalongan & Sekitarnya 📍",
  noticeText: "🔥 Diproduksi Fresh Setiap Hari | Halal & 100% Nagih!",
  isPoOpen: true,
  poClosedAt: "Jumat, 18:00 WIB",
  poClosedDeadline: "2026-12-31T18:00",
  poReadyAt: "Sabtu, 10:00 WIB",
  shippingFee: 5000,
  ownerPin: "1234",
  bankDetails: "BCA: 1234567890 a/n Pekalongan Kuliner\nDANA / ShopeePay: 085712345678",
  enableQuotaLimit: true,
  maxQuota: 50,
  soldQuota: 18,
  requireDp: true,
  dpNote: "Wajib konfirmasi via WA & kirim bukti DP/Transfer agar pesanan resmi masuk daftar produksi (Anti Fake Order).",
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "dimsum-goreng",
    name: "DIMSUM GORENG",
    description: "Dimsum ayam udang goreng renyah di luar, lembut & gurih di dalam. Sangat cocok disajikan hangat!",
    portion: "Isi 3 Pcs",
    price: 15000,
    // High quality representation image for crispy fried dimsum
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    badge: "BEST SELLER 🌶️",
    freeSauce: "Free Saos Bangkok Spesial"
  },
  {
    id: "ayam-keju",
    name: "AYAM KEJU",
    description: "Olahan daging ayam pilihan dibalut tepung roti renyah dengan isian keju melimpah yang meleleh saat digigit!",
    portion: "Isi 4 Pcs",
    price: 10000,
    // High quality representation image for cheese chicken bites
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    badge: "KEJU LUMER 🧀",
    freeSauce: "Free Saos Bangkok Spesial"
  }
];

export const EXTRA_ADDONS: Product[] = [
  {
    id: "extra-saos-bangkok",
    name: "Extra Saos Bangkok",
    description: "Tambahan saos pedas manis gurih khas Bangkok untuk cocolan ekstra.",
    portion: "1 Cup",
    price: 2000,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
    freeSauce: "Saos Bangkok Ekstra"
  },
  {
    id: "extra-keju",
    name: "Extra Topping Keju Parut",
    description: "Taburan keju gurih melimpah di atas porsi pesananmu.",
    portion: "1 Portion",
    price: 3000,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
    freeSauce: "Topping Keju"
  }
];
