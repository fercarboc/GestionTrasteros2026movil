import React, { useEffect, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { userService } from '../services/userService';
import { Client, RentalHistory } from '../types';
import { User, MapPin, Calendar, CreditCard, Archive, Clock } from 'lucide-react';

export default function Profile() {
  const { user } = useSession();
    const [profile, setProfile] = useState<Client | null>(null);
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  useEffect(() => {
    userService.getProfile().then(setProfile);
    userService.getRentalHistory().then(setHistory);
  }, []);

  if (!profile) return <div className="p-8 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary-600 rounded-full"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Summary & History (Desktop) / Tabs (Mobile) */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* User Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-900 h-24 relative">
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-white p-1 rounded-full">
                            <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold border border-gray-100">
                                {profile.email ? profile.email.charAt(0).toUpperCase() : profile.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-12 pb-6 px-4 text-center">
                    <h2 className="text-lg font-bold text-gray-900">{profile.name} {profile.surname || ''}</h2>
                    <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        Cliente Activo
                    </div>
                </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="flex lg:hidden bg-white rounded-lg border border-gray-200 p-1">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'details' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    Mis Datos
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'history' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    Historial
                </button>
            </div>

            {/* History List (Visible on Desktop always, Mobile if tab active) */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${activeTab === 'history' ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <Clock size={18} className="mr-2 text-primary-600"/> Historial
                    </h3>
                    <span className="text-xs text-gray-500">{history.length} alquileres</span>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {history.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">Sin historial reciente.</p>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-gray-800">{item.unit_code}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${item.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {item.status === 'Activo' ? 'Activo' : 'Finalizado'}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{item.size_m2} m²</span>
                                    <span>{new Date(item.start_date).toLocaleDateString()} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : '...'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Detailed Personal Info */}
        <div className={`lg:col-span-2 space-y-6 ${activeTab === 'details' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Información Personal</h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Editar</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Nombre Completo</label>
                        <div className="mt-1 flex items-center text-gray-900 font-medium">
                            <User size={16} className="mr-2 text-gray-400"/> {profile.name} {profile.surname || ''}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Documento (DNI/NIE)</label>
                        <div className="mt-1 flex items-center text-gray-900 font-medium">
                            <CreditCard size={16} className="mr-2 text-gray-400"/> {profile.dni || '---'}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Fecha de Alta</label>
                        {/* No hay created_at en Client, se puede omitir o usar otro campo si existe */}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">ID Interno</label>
                        <div className="mt-1 font-mono text-sm text-gray-600 truncate">
                            {profile.id}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Dirección y Facturación</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Dirección Postal</label>
                        <div className="mt-1 flex items-center text-gray-900 font-medium">
                            <MapPin size={16} className="mr-2 text-gray-400"/> {profile.address || 'No definida'}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Localidad</label>
                        <p className="mt-1 font-medium text-gray-900">{profile.city || '---'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Código Postal</label>
                        <p className="mt-1 font-medium text-gray-900">{profile.postal_code || '---'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Provincia</label>
                        <p className="mt-1 font-medium text-gray-900">{profile.province || '---'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">País</label>
                        {/* No hay country en Client, se puede omitir o dejar en blanco */}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}