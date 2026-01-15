"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/button";
import { SimpleCard } from "@/components/ui/simple-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Hat from "@/app/icon/hat";

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, wallet, disconnect, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/auth/login");
    }
  }, [isConnected, router]);

  // Copy wallet address
  const copyAddress = () => {
    if (smartWalletPubkey) {
      navigator.clipboard.writeText(smartWalletPubkey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    router.push("/");
  };

  if (!isConnected || !wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const shortAddress = smartWalletPubkey
    ? `${smartWalletPubkey.toString().slice(0, 4)}...${smartWalletPubkey.toString().slice(-4)}`
    : "";

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      {/* Header */}
      <header className="w-full absolute top-0 left-0 z-40 bg-transparent">
        <div className="container mx-auto flex items-center justify-between py-6 px-4">
          <Link href="/" className="flex items-center text-gray-700 dark:text-gray-200">
            <Hat />
            TeachRelief
          </Link>
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your smart wallet is active and ready to use
            </p>
          </div>

          {/* Wallet Card */}
          <div className="mb-8">
            <SimpleCard className="w-full">
              <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Smart Wallet</h2>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                      ✓ Connected
                    </span>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-sm font-mono">
                      {smartWalletPubkey?.toString()}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAddress}
                      className="shrink-0"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                {/* Balance (placeholder) */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Balance
                  </label>
                  <p className="text-3xl font-bold">0 SOL</p>
                  <p className="text-sm text-gray-500 mt-1">≈ $0.00 USD</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://explorer.solana.com/address/${smartWalletPubkey?.toString()}?cluster=devnet`,
                        "_blank"
                      )
                    }
                  >
                    View on Explorer
                  </Button>
                  <Button variant="outline" disabled>
                    Request Devnet SOL
                  </Button>
                </div>
              </div>
            </SimpleCard>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Feature */}
            <SimpleCard>
              <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl h-full shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold mb-2">One-Time Payment</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Make gasless payments for AI grading services
                </p>
                <Button className="w-full" onClick={() => router.push("/payment")}>
                  Try Payment Demo
                </Button>
              </div>
            </SimpleCard>

            {/* Subscription Feature */}
            <SimpleCard>
              <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl h-full shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Recurring Subscription</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Set up automatic monthly or yearly payments
                </p>
                <Button className="w-full" onClick={() => router.push("/subscribe")}>
                  Manage Subscription
                </Button>
              </div>
            </SimpleCard>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              🎉 Your wallet is powered by LazorKit
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>✓ No seed phrases or private keys to manage</li>
              <li>✓ Biometric authentication (FaceID/TouchID/Windows Hello)</li>
              <li>✓ Gasless transactions sponsored by paymaster</li>
              <li>✓ Built on Solana for fast, low-cost operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
