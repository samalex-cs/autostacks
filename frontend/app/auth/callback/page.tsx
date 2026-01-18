'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { completeLoginWithLink, isEmailLink, verifyAuth } from '@/lib/firebase';

type Status = 'loading' | 'success' | 'error';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    handleAuthCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Check if this is a valid email link
      if (!isEmailLink()) {
        setError('Invalid or expired login link');
        setStatus('error');
        return;
      }

      // Complete the login
      const user = await completeLoginWithLink();

      if (!user) {
        setError('Failed to complete login');
        setStatus('error');
        return;
      }

      // Verify with backend
      try {
        await verifyAuth();
      } catch (verifyError) {
        console.log('Backend verification optional:', verifyError);
        // Continue even if backend verification fails
      }

      setStatus('success');

      // Redirect after short delay
      setTimeout(() => {
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      }, 1500);
    } catch (err: unknown) {
      console.error('Auth callback error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-400">
              <Car className="w-6 h-6 text-navy-900" />
            </div>
            <span className="text-xl font-bold text-surface-900">AutoStack</span>
          </Link>

          {status === 'loading' && (
            <div className="animate-fade-in">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary-500 animate-spin" />
              <h1 className="text-xl font-semibold text-surface-900 mb-2">
                Signing you in...
              </h1>
              <p className="text-surface-500">
                Please wait while we verify your login link.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-surface-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-surface-500 mb-6">
                Login successful. Redirecting you now...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-surface-900 mb-2">
                Login Failed
              </h1>
              <p className="text-surface-500 mb-6">{error}</p>
              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button variant="primary" fullWidth>
                    Try Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" fullWidth>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary-500 animate-spin" />
          <h1 className="text-xl font-semibold text-surface-900 mb-2">
            Loading...
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
