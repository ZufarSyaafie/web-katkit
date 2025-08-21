'use client'
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Gamepad2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      // Call internal API route instead of directly calling PlayFab
      const response = await fetch('/api/playfab/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Login berhasil!');
        
        // Simpan session ticket dan PlayFab ID ke localStorage
        localStorage.setItem('playfab_session_ticket', data.sessionTicket);
        localStorage.setItem('playfab_id', data.playFabId);
        localStorage.setItem('user_email', data.email);
        
        console.log('PlayFab Session Ticket:', data.sessionTicket);
        console.log('PlayFab ID:', data.playFabId);
        
        setTimeout(() => {
          window.location.href = '/dash';
        }, 1500);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Periksa koneksi internet Anda.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... rest of your JSX remains the same ...
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Gamepad2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600 mt-2">Masuk ke akun PlayFab Anda</p>
        </div>
        
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="nama@example.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-emerald-700 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Memproses...
            </div>
          ) : (
            'Masuk'
          )}
        </button>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span className="text-emerald-600 font-medium">PlayFab</span>
          </p>
        </div>
      </div>
    </div>
  );
}