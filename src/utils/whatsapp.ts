import { CartItem, CustomerInfo, GPSLocation, DeliveryMethod } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace('Rp', 'Rp');
};

export const getDeliveryMethodLabel = (method: DeliveryMethod, shippingFee: number): string => {
  switch (method) {
    case 'cod':
      return `COD / Dianter (Ongkir ${formatRupiah(shippingFee)})`;
    case 'pickup':
      return 'Ambil Sendiri / Pick-up (Tanpa Ongkir)';
    default:
      return 'COD / Dianter';
  }
};

export const getPaymentMethodLabel = (method?: string): string => {
  if (method === 'transfer') {
    return 'Transfer Bank / E-Wallet';
  }
  return 'Cash (Tunai / COD)';
};

export const buildWhatsAppMessage = (
  customer: CustomerInfo,
  cartItems: CartItem[],
  subtotalAmount: number,
  shippingFee: number,
  grandTotal: number,
  location: GPSLocation | null,
  poReadyAt?: string,
  bankDetails?: string
): string => {
  const activeItems = cartItems.filter(item => item.quantity > 0);

  const itemsList = activeItems
    .map(item => {
      const sub = item.product.price * item.quantity;
      return `- ${item.product.name} x${item.quantity} = ${formatRupiah(sub)}`;
    })
    .join('\n');

  let deliveryText = getDeliveryMethodLabel(customer.deliveryMethod, shippingFee);
  let paymentText = getPaymentMethodLabel(customer.paymentMethod);

  let alamatSection = customer.address.trim();
  if (!alamatSection) {
    alamatSection = 'Tidak diisi (Gunakan patokan lokasi GPS)';
  }

  let lokasiSection = '-';
  if (location && location.googleMapsUrl) {
    lokasiSection = location.googleMapsUrl;
  } else {
    lokasiSection = 'Lokasi GPS tidak dilampirkan (Gunakan alamat manual)';
  }

  let catatanSection = customer.notes.trim();
  if (!catatanSection) {
    catatanSection = '-';
  }

  const deliveryCostLine = customer.deliveryMethod === 'cod'
    ? `\nSubtotal Menu: ${formatRupiah(subtotalAmount)}\nOngkir COD / Dianter: ${formatRupiah(shippingFee)}`
    : `\nSubtotal Menu: ${formatRupiah(subtotalAmount)}\nOngkir: Gratis (Ambil Sendiri)`;

  const poReadyLine = poReadyAt ? `\nEstimasi Ready / Dianter: ${poReadyAt}` : '';
  
  let transferNote = '';
  if (customer.paymentMethod === 'transfer' && bankDetails) {
    transferNote = `\n\n*Rekening Pembayaran Transfer:*\n${bankDetails.trim()}`;
  }

  const message = `Halo Admin, saya mau ikutan Pre-Order (PO).

Nama: ${customer.name.trim()}
No. WhatsApp: ${customer.phone.trim()}

Detail Pesanan:
${itemsList}
${deliveryCostLine}
Total Bayar: ${formatRupiah(grandTotal)}

Metode Pengiriman: ${deliveryText}
Metode Pembayaran: ${paymentText}${poReadyLine}${transferNote}

Alamat Lengkap / Patokan:
${alamatSection}

Link Lokasi GPS:
${lokasiSection}

Catatan Tambahan:
${catatanSection}

Mohon konfirmasi dan rekap pesanan saya ya Kak. Terima kasih!`;

  return message;
};

export const createWhatsAppLink = (
  phone: string,
  message: string
): string => {
  // Clean phone number format
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

