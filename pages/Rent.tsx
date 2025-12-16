import React, { useEffect, useState } from 'react';
import { unitsService } from '../services/unitsService';
import { userService } from '../services/userService';
import { invoicesService } from '../services/invoicesService';
import { Unit, UserProfile } from '../types';
import { paymentsService } from '../services/paymentsService';
import { Filter, X, CreditCard, Calendar, User, ShieldCheck, CheckCircle, QrCode } from 'lucide-react';

type RentStep = 'select' | 'details' | 'payment' | 'success';
type DurationOption = '1_month' | '6_months' | '12_months';

export default function Rent() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSize, setFilterSize] = useState<string>('all');
  
  // Wizard State
  const [step, setStep] = useState<RentStep>('select');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // Form State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
      full_name: '',
      document_id: '',
      address: '',
      city: '',
      zip_code: '',
      phone: ''
  });
  
  // Rental Config State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<DurationOption>('1_month');

  // Generated Access Data
  const [accessData, setAccessData] = useState<{pin: string, qr: string} | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [unitsData, userProfile] = await Promise.all([
            unitsService.getAvailableUnits(),
            userService.getProfile()
        ]);
        
        // Mock data if empty
        if (unitsData.length === 0) {
             setUnits([
                { id: '1', name: 'Trastero S', size_m2: 2, price_monthly: 26, status: 'available', location: 'Planta 1', features: ['Cámara 24h', 'Acceso App'] },
                { id: '2', name: 'Trastero M', size_m2: 5, price_monthly: 45, status: 'available', location: 'Planta 1', features: ['Cámara 24h', 'Acceso App', 'Luz'] },
                { id: '3', name: 'Trastero L', size_m2: 10, price_monthly: 80, status: 'available', location: 'Planta 0', features: ['Acceso Vehículo', 'Luz'] },
            ]);
        } else {
            setUnits(unitsData);
        }

        if (userProfile) {
            setProfile(userProfile);
            setFormData({
                full_name: userProfile.full_name || '',
                document_id: userProfile.document_id || '',
                address: userProfile.address || '',
                city: userProfile.city || '',
                zip_code: userProfile.zip_code || '',
                phone: userProfile.phone || ''
            });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleUnitSelect = (unit: Unit) => {
      setSelectedUnit(unit);
      setStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (!formData.document_id || !formData.full_name) {
          alert('Por favor completa los datos obligatorios');
          return;
      }
      setStep('payment');
  };

  const calculateTotals = () => {
      if (!selectedUnit) return { total: 0, deposit: 0, monthly: 0, discount: 0 };
      
      const price = selectedUnit.price_monthly;
      const deposit = price; // 1 month deposit
      let months = 1;
      let discountRate = 0;

      if (duration === '6_months') {
          months = 6;
          discountRate = 0.10;
      } else if (duration === '12_months') {
          months = 12;
          discountRate = 0.15;
      }

      const subtotal = price * months;
      const discountAmount = subtotal * discountRate;
      const finalRentalPrice = subtotal - discountAmount;
      const totalToPay = finalRentalPrice + deposit;

      return {
          monthlyBase: price,
          months,
          subtotal,
          discountRate,
          discountAmount,
          finalRentalPrice,
          deposit,
          totalToPay
      };
  };

  const handlePayment = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate Access Credentials
      const rawDoc = formData.document_id.toUpperCase();
      // Logic: Replace letters with 0
      const pin = rawDoc.replace(/[A-Z]/g, '0').padEnd(8, '0').substring(0,8);
      
      setAccessData({
          pin,
          qr: pin // In real app, this might be a signed JWT or similar
      });

    // Aquí se generaría la factura real tras el pago en producción

      setLoading(false);
      setStep('success');
  };

  const filteredUnits = filterSize === 'all' 
    ? units 
    : units.filter(u => u.size_m2 >= Number(filterSize));

  const totals = calculateTotals();

  // --- Render Steps ---

  // Success Step
  if (step === 'success' && selectedUnit && accessData) {
      return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-center max-w-lg mx-auto mt-8">
              <div className="bg-green-600 p-6">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">¡Alquiler Confirmado!</h2>
                  <p className="text-green-100 mt-1">Tu trastero está listo para usarse</p>
              </div>
              
              <div className="p-8">
                  <p className="text-gray-600 mb-6">
                      Hemos enviado el contrato y la factura a tu email.
                      Aquí tienes tu llave digital de acceso inmediato:
                  </p>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 inline-block">
                       <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${accessData.qr}`}
                            alt="QR Acceso"
                            className="w-32 h-32 mx-auto mb-4"
                        />
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">PIN DE ACCESO</p>
                        <p className="text-3xl font-mono font-bold text-gray-800 tracking-widest">{accessData.pin}</p>
                  </div>

                  <div className="space-y-3">
                    <button 
                        onClick={() => window.location.hash = '#/app/access'}
                        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700"
                    >
                        Ir a mi Zona de Acceso
                    </button>
                    <button 
                         onClick={() => window.location.hash = '#/app/invoices'}
                        className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50"
                    >
                        Ver Factura (VeriFactu)
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  // Payment Modal Overlay
  if ((step === 'details' || step === 'payment') && selectedUnit) {
      return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800">
                          {step === 'details' ? 'Configurar Alquiler' : 'Pago Seguro'}
                      </h3>
                      <button onClick={() => setStep('select')} className="text-gray-400 hover:text-gray-600">
                          <X size={24} />
                      </button>
                  </div>

                  {step === 'details' ? (
                      <form onSubmit={handleDetailsSubmit} className="p-6 space-y-6">
                          {/* Section: User Data */}
                          <div>
                              <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                  <User size={16} className="mr-2"/> Datos del Titular
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
                                      <input 
                                        type="text" required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        value={formData.full_name}
                                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">DNI / NIE (Para PIN)</label>
                                      <input 
                                        type="text" required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                                        value={formData.document_id}
                                        onChange={e => setFormData({...formData, document_id: e.target.value})}
                                        placeholder="12345678Z"
                                      />
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                                      <input 
                                        type="text" required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                      />
                                  </div>
                              </div>
                          </div>

                          {/* Section: Configuration */}
                          <div className="pt-4 border-t border-gray-100">
                               <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                  <Calendar size={16} className="mr-2"/> Duración y Fechas
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                                      <input 
                                        type="date" 
                                        required 
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-2">Plan de Pago</label>
                                      <div className="space-y-2">
                                          <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${duration === '1_month' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                              <input type="radio" name="duration" className="text-primary-600" checked={duration === '1_month'} onChange={() => setDuration('1_month')} />
                                              <span className="ml-2 text-sm font-medium">Mensual ({selectedUnit.price_monthly}€/mes)</span>
                                          </label>
                                          <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${duration === '6_months' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                              <input type="radio" name="duration" className="text-primary-600" checked={duration === '6_months'} onChange={() => setDuration('6_months')} />
                                              <div className="ml-2">
                                                <span className="text-sm font-medium">6 Meses</span>
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">-10% Dto</span>
                                              </div>
                                          </label>
                                          <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${duration === '12_months' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                              <input type="radio" name="duration" className="text-primary-600" checked={duration === '12_months'} onChange={() => setDuration('12_months')} />
                                              <div className="ml-2">
                                                <span className="text-sm font-medium">1 Año</span>
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">-15% Dto</span>
                                              </div>
                                          </label>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="pt-4 flex justify-end">
                              <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">
                                  Continuar al Pago
                              </button>
                          </div>
                      </form>
                  ) : (
                      // PAYMENT STEP
                      <div className="p-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               {/* Left: Summary */}
                               <div className="bg-gray-50 p-6 rounded-xl h-full">
                                   <h4 className="font-bold text-gray-900 mb-4">Resumen de Importes</h4>
                                   
                                   <div className="space-y-3 text-sm">
                                       <div className="flex justify-between">
                                           <span className="text-gray-600">Unidad</span>
                                           <span className="font-medium">{selectedUnit.name} ({selectedUnit.size_m2}m²)</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="text-gray-600">Periodo</span>
                                           <span className="font-medium">{totals.months} mes{totals.months > 1 ? 'es' : ''}</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="text-gray-600">Precio Base</span>
                                           <span>{totals.monthlyBase}€ x {totals.months}</span>
                                       </div>
                                       
                                       {totals.discountAmount > 0 && (
                                           <div className="flex justify-between text-green-600">
                                               <span>Descuento ({(totals.discountRate * 100)}%)</span>
                                               <span>-{totals.discountAmount.toFixed(2)}€</span>
                                           </div>
                                       )}

                                       <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                                           <span className="text-gray-600">Subtotal Alquiler</span>
                                           <span className="font-medium">{totals.finalRentalPrice.toFixed(2)}€</span>
                                       </div>
                                       <div className="flex justify-between text-gray-600">
                                           <span>Fianza (1 mes)</span>
                                           <span>{totals.deposit.toFixed(2)}€</span>
                                       </div>

                                       <div className="border-t-2 border-gray-300 mt-4 pt-3 flex justify-between items-center">
                                           <span className="font-bold text-lg text-gray-900">Total a Pagar</span>
                                           <span className="font-bold text-2xl text-primary-600">{totals.totalToPay.toFixed(2)}€</span>
                                       </div>
                                   </div>
                               </div>

                               {/* Right: Fake Card Form */}
                               <div className="space-y-4">
                                   <div className="flex items-center mb-4">
                                       <ShieldCheck className="text-green-600 w-5 h-5 mr-2" />
                                       <span className="text-xs font-semibold text-gray-500 uppercase">Pasarela Segura Simulada</span>
                                   </div>

                                   <div>
                                       <label className="block text-xs font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                                       <div className="relative">
                                           <CreditCard className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                           <input type="text" placeholder="0000 0000 0000 0000" className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
                                       </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div>
                                           <label className="block text-xs font-medium text-gray-700 mb-1">Caducidad</label>
                                           <input type="text" placeholder="MM/AA" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
                                       </div>
                                       <div>
                                           <label className="block text-xs font-medium text-gray-700 mb-1">CVC</label>
                                           <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
                                       </div>
                                   </div>
                                   
                                   <button 
                                      onClick={handlePayment}
                                      disabled={loading}
                                      className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center"
                                   >
                                       {loading ? (
                                           <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                       ) : (
                                           `Pagar ${totals.totalToPay.toFixed(2)}€`
                                       )}
                                   </button>
                                   <p className="text-xs text-center text-gray-400 mt-2">Simulación: No se realizará ningún cargo real.</p>
                               </div>
                           </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // DEFAULT VIEW: Unit Selection
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-900">Disponibilidad</h2>
        <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400"/>
            <select 
                className="text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
            >
                <option value="all">Todos</option>
                <option value="4">+4 m²</option>
                <option value="8">+8 m²</option>
            </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="h-32 bg-gray-200 relative">
                 <img 
                    src={unit.image_url || `https://picsum.photos/seed/${unit.id}/400/200`} 
                    alt={unit.name}
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">
                    {unit.size_m2} m²
                 </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{unit.name}</h3>
                    <span className="text-lg font-bold text-primary-600">{unit.price_monthly}€<span className="text-xs text-gray-500 font-normal">/mes</span></span>
                </div>
                <ul className="text-xs text-gray-500 space-y-1 mb-4 flex-1">
                    {unit.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center">• {f}</li>
                    ))}
                </ul>
                <button
                    onClick={() => handleUnitSelect(unit)}
                    className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Alquilar ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}