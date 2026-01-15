"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Hat from "@/app/icon/hat";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan"); // Get plan from URL (monthly/yearly)
  const { connect, isConnected, isConnecting, wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "creating">("intro");

  // Redirect to subscribe page if plan is selected and wallet is connected
  useEffect(() => {
    if (isConnected && wallet && plan) {
      router.push("/subscribe?plan=" + plan);
    } else if (isConnected && wallet) {
      router.push("/dashboard");
    }
  }, [isConnected, wallet, plan, router]);

  const handleCreateWallet = async () => {
    try {
      setError(null);
      setStep("creating");
      await connect();
      // Connection successful, redirect handled by useEffect
    } catch (err) {
      console.error("Wallet creation failed:", err);
      setError("Failed to create wallet. Please try again.");
      setStep("intro");
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

      {/* Signup Card */}
      <div className="w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Hat />
            <span className="text-2xl font-bold">TeachRelief</span>
          </Link>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get started with your smart wallet in seconds
            </p>
            {plan && (
              <div className="mt-4 inline-block bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  🎯 {plan === "monthly" ? "Monthly Plan" : "Yearly Plan"} Selected
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Passkey Security</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Biometric authentication - no passwords needed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart Wallet</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Powered by Solana - fast and secure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Gasless Transactions</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We sponsor your transaction fees
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🚀 <strong>No wallet extension needed!</strong>
              <br />
              Your device (FaceID/TouchID/Windows Hello) becomes your wallet.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Create Wallet Button */}
          <Button
            onClick={handleCreateWallet}
            disabled={isConnecting || step === "creating"}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {step === "creating" || isConnecting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating your wallet...
              </>
            ) : (
              <>
                <span className="mr-2">🔑</span>
                Create Smart Wallet
              </>
            )}
          </Button>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our Terms of Service
            </p>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Sign in
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
