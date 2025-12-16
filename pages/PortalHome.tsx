import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Smartphone, Clock } from 'lucide-react';

export default function PortalHome() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between p-4 md:px-8 border-b border-gray-100">
        <div className="text-xl font-bold text-primary-600">Trasteros</div>
        <div className="space-x-2">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">Entrar</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Registrarse</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Tu trastero, <span className="text-primary-600">en tu bolsillo</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Gestiona tu alquiler, realiza pagos y accede a tus facturas sin desplazamientos. 
          Todo desde tu móvil, 24/7.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link to="/register" className="px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg shadow-lg hover:bg-primary-700 transition-all">
            Empezar Ahora
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Lock size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Contratación Segura</h3>
            <p className="text-sm text-gray-600">Firma tu contrato digitalmente y accede a tu espacio al instante.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Smartphone size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Todo en tu móvil</h3>
            <p className="text-sm text-gray-600">Consulta facturas, cambia métodos de pago y gestiona accesos.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Acceso 24h</h3>
            <p className="text-sm text-gray-600">Sistema automatizado para que entres cuando lo necesites.</p>
          </div>
        </div>
      </main>
    </div>
  );
}