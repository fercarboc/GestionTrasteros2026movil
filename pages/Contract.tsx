import React, { useState, useEffect } from 'react';
import { rentalsService } from '../services/rentalsService';
import { Rental } from '../types';
import { AlertTriangle, Download, ShieldAlert } from 'lucide-react';

export default function ContractPage() {
  const [contract, setContract] = useState<Contract | null>(null);
    const [rental, setRental] = useState<Rental | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    rentalsService.getMyActiveRental().then(setRental);
  }, []);

  const handleCancel = async () => {
    if (!rental) return;
    if (window.confirm('¿Estás seguro de que quieres cancelar el alquiler? Esta acción es irreversible.')) {
        setCancelling(true);
        try {
            await rentalsService.requestCancellation(rental.id, 'User requested via portal');
            // Refresh
            const updated = await rentalsService.getMyActiveRental();
            setRental(updated);
        } catch (e) {
            alert('Error al procesar la cancelación.');
        } finally {
            setCancelling(false);
        }
    }
  };

    if (!rental) return <div className="p-8 text-center text-gray-500">No tienes un alquiler activo.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detalles del Contrato</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Unidad</p>
                <p className="font-medium">{rental.unit?.code}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha Inicio</p>
                <p className="font-medium">{new Date(rental.start_date).toLocaleDateString()}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Estado</p>
                <span className={`inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rental.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {rental.status === 'Activo' ? 'Activo' : 'Cancelación Pendiente'}
                </span>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Próxima Renovación</p>
                {/* Aquí deberías calcular la próxima renovación si aplica */}
                <p className="font-medium">{rental.end_date ? new Date(rental.end_date).toLocaleDateString() : 'Sin fecha'}</p>
            </div>
        </div>

        <button className="flex items-center text-primary-600 text-sm font-medium hover:text-primary-700">
            <Download className="w-4 h-4 mr-2" />
            Descargar Copia Firmada (PDF)
        </button>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex items-center mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600 mr-2"/>
            <h3 className="text-lg font-semibold text-red-900">Zona de Peligro - Cancelación</h3>
        </div>
        
        <div className="text-sm text-red-800 space-y-3 mb-6 bg-white p-4 rounded-lg border border-red-100">
            <p className="font-bold">CONDICIONES DE CANCELACIÓN Y DESALOJO:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>
                    Si confirma la cancelación, deberá <strong>vaciar completamente el trastero</strong> antes de la fecha de renovación ({new Date(contract.next_renewal_date).toLocaleDateString()}).
                </li>
                <li>
                    <strong>BLOQUEO DE ACCESO:</strong> Si no ha vaciado el trastero antes de dicha fecha, se le bloqueará el acceso (código PIN y QR dejarán de funcionar).
                </li>
                <li>
                    <strong>PENALIZACIÓN:</strong> Para recuperar el acceso y retirar sus pertenencias tras la fecha límite, deberá abonar una penalización equivalente a <strong>un mes de fianza</strong> (no se devolverá la fianza depositada).
                </li>
                <li>
                    <strong>ENAJENACIÓN DE BIENES (Cláusula XX):</strong> Si transcurridos dos meses desde el impago o fecha de desalojo la situación persiste, la compañía podrá acceder al trastero y proceder a la <strong>venta o disposición de los enseres</strong> para cubrir la deuda acumulada, previo aviso reiterado por email y teléfono.
                </li>
            </ul>
        </div>
        
        {rental.status === 'Activo' ? (
            <button 
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full md:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-colors shadow-sm"
            >
                {cancelling ? 'Procesando...' : 'Entiendo las condiciones y deseo Cancelar'}
            </button>
        ) : (
            <div className="bg-yellow-100 p-4 rounded-lg flex items-center border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-700 mr-2"/>
                <span className="font-medium text-yellow-900">La cancelación ya está en curso. Recuerde desalojar antes de la fecha límite.</span>
            </div>
        )}
      </div>
    </div>
  );
}