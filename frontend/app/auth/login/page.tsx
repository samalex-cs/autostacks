'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Check, Car, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { sendLoginLink, getCurrentUser } from '@/lib/firebase';
import { isValidEmail } from '@/utils/validators';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await sendLoginLink(email);
      setSent(true);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send login link. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-surface-900 mb-3">
              Check Your Email
            </h1>
            
            <p className="text-surface-500 mb-6">
              We&apos;ve sent a magic link to <br />
              <span className="font-medium text-surface-900">{email}</span>
            </p>

            <p className="text-sm text-surface-400 mb-6">
              Click the link in the email to sign in. The link will expire in 1 hour.
            </p>

            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setSent(false)}
              >
                Use Different Email
              </Button>
              
              <Link href="/">
                <Button variant="ghost" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary-400">
              <Car className="w-8 h-8 text-navy-900" />
            </div>
            <span className="text-3xl font-bold text-white">AutoStack</span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-primary-400">Dream Car</span>
          </h2>

          <p className="text-lg text-surface-300 mb-8">
            Sign in to save your favorite cars, book test drives, and get
            personalized recommendations.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 text-left">
            {[
              'Save and compare your favorite cars',
              'Book test drives with verified dealers',
              'Get personalized car recommendations',
              'Track your interests and bookings',
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-surface-300"
              >
                <div className="w-6 h-6 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-400" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-400">
                  <Car className="w-6 h-6 text-navy-900" />
                </div>
                <span className="text-xl font-bold text-surface-900">AutoStack</span>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-surface-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-surface-500">
                Sign in with your email to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                error={error}
                autoFocus
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
              >
                Send Magic Link
              </Button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-6">
              No password needed. We&apos;ll send you a secure link to sign in.
            </p>

            <div className="mt-8 pt-6 border-t border-surface-100 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-surface-400 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
