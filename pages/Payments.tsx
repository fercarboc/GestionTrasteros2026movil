import React from 'react';
import { paymentsService } from '../services/paymentsService';
import { CreditCard, ExternalLink } from 'lucide-react';

export default function Payments() {
  const handlePortal = async () => {
    try {
      const session = await paymentsService.createPortalSession();
      if (session?.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      alert('Error connecting to Stripe.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-indigo-50 rounded-full">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Método de Pago</h2>
            <p className="text-sm text-gray-500">Gestionado de forma segura por Stripe</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Para actualizar tu tarjeta, ver el historial completo de transacciones o descargar recibos fiscales oficiales, accede al portal de cliente de Stripe.
        </p>

        <button
          onClick={handlePortal}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
        >
          Gestionar suscripción en Stripe
          <ExternalLink className="ml-2 w-4 h-4" />
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">Pago Automático Activado</h3>
        <p className="text-xs text-blue-700">
          Tu suscripción se renueva automáticamente el día 1 de cada mes. No necesitas hacer nada manualmente.
        </p>
      </div>
    </div>
  );
}