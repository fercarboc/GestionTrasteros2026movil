import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';
import { useSession } from '../hooks/useSession';

interface AuthProps {
  type: 'login' | 'register';
}

export default function AuthPage({ type }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAsDemo } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Auth state change listener in useSession will handle redirect via PublicRoute/ProtectedRoute logic in App
        // But we can also navigate manually to be sure
        navigate('/app/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
        alert('Revisa tu email para confirmar el registro.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    // The change in session state will cause App.tsx's PublicRoute to redirect automatically, 
    // but explicit navigation helps ensure smooth transition
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="p-6 bg-primary-600 text-white text-center">
            <h2 className="text-2xl font-bold">{type === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h2>
            <p className="text-primary-100 text-sm mt-1">Trasteros Portal Cliente</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded">
                {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        {type === 'login' && (
          <div className="px-6 pb-2">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
            >
              <Layout className="w-4 h-4 mr-2" />
              Acceso Demo (Usuario Prueba)
            </button>
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-600">
                {type === 'login' ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <button 
                    onClick={() => navigate(type === 'login' ? '/register' : '/login')}
                    className="text-primary-600 font-medium hover:underline"
                >
                    {type === 'login' ? 'Regístrate' : 'Entra aquí'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}