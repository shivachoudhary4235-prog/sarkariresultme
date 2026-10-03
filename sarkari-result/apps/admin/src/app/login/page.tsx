'use client';

/**
 * Admin Login Page
 * Uses Supabase Auth for authentication.
 *
 * SECURITY:
 * - Returns IDENTICAL generic error messages for all failure types.
 * - Does NOT reveal whether email exists, password is wrong, or account is admin.
 * - Rate limiting is enforced on the API side.
 */
import React, { useState, Suspense } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/browser';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Mail } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createSupabaseBrowserClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      // SECURITY: Generic error message — do NOT reveal reason
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    // Verify admin role via API
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const verifyUrl = apiBase ? `${apiBase.replace(/\/$/, '')}/api/admin/auth/verify` : '/api/admin/auth/verify';

    const verifyRes = await fetch(
      verifyUrl,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!verifyRes.ok) {
      await supabase.auth.signOut();
      // SECURITY: Same generic message
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push(redirectTo);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sarkari Result Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
        </div>

        {/* Login Card with Suspense */}
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-slate-500 text-xs mt-6">
          This panel is for authorized administrators only.
        </p>
      </div>
    </div>
  );
}
