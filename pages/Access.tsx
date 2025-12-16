import React, { useEffect, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { rentalsService } from '../services/rentalsService';
import { Rental } from '../types';
import { userService } from '../services/userService';
import { QrCode, Lock, RefreshCw, AlertOctagon } from 'lucide-react';

export default function Access() {
  const { user } = useSession();
  const [rental, setRental] = useState<Rental | null>(null);
  const [pin, setPin] = useState<string>('--------');
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeRental = await rentalsService.getMyActiveRental();
        setRental(activeRental);

        if (!activeRental || activeRental.status === 'Pendiente' || activeRental.status === 'Cancelado') {
          setBlocked(true);
        }

        const profile = await userService.getProfile();
        if (profile?.document_id) {
            // Logic: Remove letters and pad with 0
            const raw = profile.document_id.toUpperCase();
            // Replace any A-Z char with '0'
            const processed = raw.replace(/[A-Z]/g, '0');
            setPin(processed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    if (!rental) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Lock className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Sin acceso activo</h2>
          <p className="text-gray-500 mt-2">Necesitas tener un alquiler activo para generar tus credenciales de acceso.</p>
        </div>
      );
    }

  if (blocked) {
      return (
          <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border-2 border-red-100 m-4 text-center">
              <AlertOctagon className="w-16 h-16 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Bloqueado</h2>
              <p className="text-red-700">Tu acceso ha sido restringido por falta de pago o finalización de contrato.</p>
              <p className="text-sm text-red-600 mt-4">Contacta con administración o regulariza tus pagos para reactivar el PIN.</p>
          </div>
      );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-primary-600 p-6 text-center text-white">
            <h2 className="text-2xl font-bold">Llave Digital</h2>
            <p className="text-primary-100 text-sm">{rental.unit?.code} - {rental.unit?.type}</p>
        </div>
        
        <div className="p-8 flex flex-col items-center">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200 mb-8">
                {/* Using a reliable public API for QR generation for demo purposes without npm packages */}
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pin}`}
                    alt="Código QR de Acceso"
                    className="w-48 h-48 object-contain"
                />
            </div>

            <div className="w-full text-center mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Tu Código PIN</p>
                <div className="text-4xl font-mono font-bold text-gray-800 tracking-[0.5em] bg-gray-50 py-4 rounded-lg border border-gray-200 select-all">
                    {pin}
                </div>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-4 px-4">
                Utiliza el código QR en el lector de la entrada o introduce el PIN manualmente en el teclado numérico.
            </p>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center"><QrCode size={14} className="mr-1"/> Puerta Principal</span>
            <span className="flex items-center"><Lock size={14} className="mr-1"/> {pin.slice(0,4)}...</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
         <RefreshCw className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
         <div>
             <h4 className="text-sm font-semibold text-blue-900">Sincronización Automática</h4>
             <p className="text-xs text-blue-700 mt-1">Este código es único para ti. Si cancelas tu contrato, dejará de funcionar automáticamente en la fecha límite.</p>
         </div>
      </div>
    </div>
  );
}