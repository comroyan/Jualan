import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { GPSLocation } from '../types';

interface LocationPickerProps {
  location: GPSLocation | null;
  onLocationChange: (loc: GPSLocation | null) => void;
  address: string;
  onAddressChange: (val: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
  address,
  onAddressChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGetLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("Fitur GPS tidak didukung oleh browser Anda. Silakan isi alamat manual di bawah.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

        onLocationChange({
          latitude: lat,
          longitude: lng,
          accuracy,
          googleMapsUrl: mapsUrl,
        });

        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg("Izin lokasi tidak diberikan. Jangan khawatir, Anda tetap bisa memasukkan alamat pengantaran secara manual di bawah.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg("Informasi lokasi tidak tersedia. Silakan isi alamat pengantaran secara manual.");
            break;
          case error.TIMEOUT:
            setErrorMsg("Waktu pencarian lokasi habis. Silakan coba lagi atau isi alamat manual.");
            break;
          default:
            setErrorMsg("Gagal mengambil lokasi GPS. Silakan isi alamat manual.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  return (
    <section className="bg-white rounded-[28px] shadow-xs border border-[#E5E1DA] p-5 sm:p-6 mb-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#F3EFEA]">
        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#FDE68A]">
          3
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-[#3E2723] font-heading">Lokasi Pengantaran</h2>
          <p className="text-xs text-[#6D4C41]">Gunakan GPS presisi atau ketik alamat manual Pekalongan</p>
        </div>
      </div>

      {/* GPS Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
            location
              ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] hover:bg-[#C8E6C9]'
              : 'bg-[#F59E0B] text-white hover:bg-[#D97706] active:bg-[#B45309]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mencari Lokasi GPS Anda...</span>
            </>
          ) : location ? (
            <>
              <CheckCircle className="w-4 h-4 text-[#1B5E20]" />
              <span>📍 Lokasi Terdeteksi (Klik Perbarui GPS)</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>📍 Gunakan Lokasi Saya</span>
            </>
          )}
        </button>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success Location Preview */}
        {location && (
          <div className="mt-3 p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DA] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#3E2723] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                Koordinat Terdeteksi
              </span>
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F59E0B] font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                Buka Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-[#5D4037] font-mono bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E1DA]">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>

            {/* Embedded OpenStreetMap Preview */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-[#E5E1DA] shadow-2xs mt-2">
              <iframe
                title="Peta Lokasi Pengantaran"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.003}%2C${location.latitude - 0.003}%2C${location.longitude + 0.003}%2C${location.latitude + 0.003}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Manual Address Input */}
      <div>
        <label className="block text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center justify-between">
          <span>Detail Alamat / Patokan Rumah</span>
          <span className="text-[11px] text-[#8D6E63] font-normal normal-case">
            {location ? '(opsional jika GPS aktif)' : '(wajib jika tanpa GPS)'}
          </span>
        </label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Contoh: Jl. Hayam Wuruk No. 12, Kel. Bendan, Pekalongan Barat (Rumah pagar hijau dekat Masjid / Depan Indomaret)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1DA] bg-[#F9F7F4] text-[#3E2723] text-sm placeholder-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] focus:bg-white transition-all resize-none"
        />
      </div>
    </section>
  );
};
