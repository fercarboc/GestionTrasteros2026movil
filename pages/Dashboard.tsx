import React, { useEffect, useState } from 'react';
import { rentalsService } from '../services/rentalsService';
import { Rental } from '../types';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, CreditCard, Box } from 'lucide-react';

export default function Dashboard() {
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rentalsService.getMyActiveRental()
      .then(setRental)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>;

  if (!rental) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Box className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">No tienes trasteros activos</h2>
        <p className="text-gray-500 text-sm mb-6">Encuentra el espacio perfecto para tus cosas hoy mismo.</p>
        <Link to="/app/rent" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
          Ver disponibilidad
        </Link>
      </div>
    );
  }

  const isPastDue = rental.status === 'Pendiente';

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`p-4 rounded-xl border ${isPastDue ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isPastDue ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${isPastDue ? 'text-red-800' : 'text-green-800'}`}>
              Estado del Alquiler: {isPastDue ? 'Pago Pendiente' : 'Activo'}
            </h3>
            {isPastDue && (
              <div className="mt-2">
                <Link to="/app/payments" className="text-sm font-medium text-red-800 underline hover:text-red-900">
                  Resolver pago ahora &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Tu Unidad</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{rental.unit?.code || 'Unidad'}</h2>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {rental.unit?.size_m2} m²
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Próxima renovación</p>
              <p className="text-sm font-semibold text-gray-900">
                {/* Aquí deberías calcular la próxima renovación si aplica */}
                {rental.end_date ? new Date(rental.end_date).toLocaleDateString() : 'Sin fecha'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Precio mensual</p>
              <p className="text-sm font-semibold text-gray-900">{rental.unit?.price}€</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <Link to="/app/contract" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Ver alquiler
          </Link>
          <button className="text-gray-400 hover:text-gray-500">
            <CreditCard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/app/invoices" className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors">
          <p className="text-sm font-medium text-gray-900">Mis Facturas</p>
        </Link>
        <Link to="/app/payments" className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors">
          <p className="text-sm font-medium text-gray-900">Métodos de Pago</p>
        </Link>
      </div>
    </div>
  );
}