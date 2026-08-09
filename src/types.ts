export interface Product {
  id: string;
  name: string;
  description: string;
  portion: string; // e.g., "Isi 3" or "Isi 4"
  price: number;
  image: string;
  badge?: string;
  freeSauce: string; // e.g., "Free Saos Bangkok"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = 'cod' | 'pickup';
export type PaymentMethod = 'cash' | 'transfer';

export interface CustomerInfo {
  name: string;
  phone: string;
  notes: string;
  address: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  googleMapsUrl: string;
}

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  poBadgeText: string;
  areaText: string;
  noticeText?: string;
  // Settings for Owner, Delivery, and PO Schedule
  isPoOpen: boolean;
  poClosedAt: string; // Text string e.g., "Jumat, 18:00 WIB"
  poClosedDeadline?: string; // Realtime deadline ISO or YYYY-MM-DDTHH:mm string e.g., "2026-08-14T18:00"
  poReadyAt: string;  // e.g., "Sabtu, 10:00 WIB"
  shippingFee: number; // e.g., 5000
  ownerPin: string;    // PIN lock, default "1234"
  bankDetails?: string; // Bank account/QRIS transfer instructions
  enableQuotaLimit?: boolean; // Enable max quota cap
  maxQuota?: number;    // e.g. 50 porsi total quota
  soldQuota?: number;   // e.g. 18 porsi already ordered
}

