"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Hat from "@/app/icon/hat";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const { connect, isConnected, isConnecting, wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected && wallet) {
      router.push("/dashboard");
    }
  }, [isConnected, wallet, router]);

  const handlePasskeyLogin = async () => {
    try {
      setError(null);
      // Connect with paymaster fee mode for gasless transactions
      await connect({ feeMode: 'paymaster' });
      // Connection successful, redirect handled by useEffect
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={300}
        repeatdelay={1}
        className={cn(
          "fixed inset-0 -z-10",
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-sky-200/40 via-blue-200/30 to-blue-300/20" />

      {/* Login Card */}
      <div className="w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Hat />
            <span className="text-2xl font-bold">TeachRelief</span>
          </Link>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in with your passkey
            </p>
          </div>

          {/* Passkey Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🔐 <strong>Passkey Login</strong>
              <br />
              Use FaceID, TouchID, Windows Hello, or your device PIN
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handlePasskeyLogin}
            disabled={isConnecting}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {isConnecting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Connecting...
              </>
            ) : (
              <>
                <span className="mr-2">🔑</span>
                Sign in with Passkey
              </>
            )}
          </Button>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No wallet extension needed • No seed phrases • Gasless transactions
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
