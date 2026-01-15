"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { SimpleCard } from "@/components/ui/simple-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Hat from "@/app/icon/hat";

type Plan = "monthly" | "yearly";

export default function SubscribePage() {
  const router = useRouter();
  const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/auth/login");
    }
  }, [isConnected, router]);

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: "0.05 SOL",
      priceUsd: "$5",
      interval: "month",
      features: [
        "Unlimited AI grading",
        "Up to 100 students",
        "Priority support",
        "Advanced analytics",
      ],
    },
    yearly: {
      name: "Yearly Plan",
      price: "0.5 SOL",
      priceUsd: "$50",
      interval: "year",
      savings: "Save 17%",
      features: [
        "Unlimited AI grading",
        "Unlimited students",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
      ],
    },
  };

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setTxSignature(null);

      if (!smartWalletPubkey) {
        throw new Error("Wallet not connected");
      }

      const plan = plans[selectedPlan];
      const amount =
        selectedPlan === "monthly"
          ? 0.05 * LAMPORTS_PER_SOL
          : 0.5 * LAMPORTS_PER_SOL;

      // Demo: Send payment (in production, this would set up recurring authority)
      const DEMO_RECIPIENT = "11111111111111111111111111111111"; // System program

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: new PublicKey(DEMO_RECIPIENT),
        lamports: amount,
      });

      // Sign and send with gasless transaction
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          // In production, add recurring payment authority here
        },
      });

      setTxSignature(signature);
      setIsSubscribed(true);
      console.log("Subscription successful:", signature);
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setError(err.message || "Subscription failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = () => {
    // In production, this would revoke the recurring payment authority
    setIsSubscribed(false);
    setTxSignature(null);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Subscription</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Recurring payments with automatic renewals
            </p>
          </div>

          {!isSubscribed ? (
            <>
              {/* Plan Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Monthly Plan */}
                <SimpleCard className={selectedPlan === "monthly" ? "ring-2 ring-blue-500" : ""}>
                  <div
                    className="p-8 bg-white dark:bg-gray-900 rounded-2xl h-full cursor-pointer"
                    onClick={() => setSelectedPlan("monthly")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">{plans.monthly.name}</h2>
                      {selectedPlan === "monthly" && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <p className="text-4xl font-bold mb-1">{plans.monthly.price}</p>
                      <p className="text-gray-500">per {plans.monthly.interval}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plans.monthly.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SimpleCard>

                {/* Yearly Plan */}
                <SimpleCard className={selectedPlan === "yearly" ? "ring-2 ring-blue-500" : ""}>
                  <div
                    className="p-8 bg-white dark:bg-gray-900 rounded-2xl h-full cursor-pointer relative"
                    onClick={() => setSelectedPlan("yearly")}
                  >
                    {plans.yearly.savings && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {plans.yearly.savings}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">{plans.yearly.name}</h2>
                      {selectedPlan === "yearly" && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <p className="text-4xl font-bold mb-1">{plans.yearly.price}</p>
                      <p className="text-gray-500">per {plans.yearly.interval}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plans.yearly.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SimpleCard>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Subscribe Button */}
              <div className="max-w-2xl mx-auto">
                <Button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing Subscription...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔄</span>
                      Subscribe to {plans[selectedPlan].name}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  🔒 Automatic renewal • Cancel anytime • Gas fees sponsored
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                  🔄 How Recurring Payments Work
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                  When you subscribe, you authorize LazorKit to automatically charge your wallet
                  each {selectedPlan === "monthly" ? "month" : "year"}. You can cancel anytime
                  without penalties.
                </p>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>✓ Automatic renewals - no manual payments</li>
                  <li>✓ Gasless - all fees sponsored</li>
                  <li>✓ Cancel anytime in one click</li>
                  <li>✓ Built on Solana for instant processing</li>
                </ul>
              </div>
            </>
          ) : (
            /* Subscription Active State */
            <div className="max-w-2xl mx-auto">
              <SimpleCard>
                <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl">
                  {/* Success Message */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Subscription Active!</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      You're subscribed to the {plans[selectedPlan].name}
                    </p>
                  </div>

                  {/* Subscription Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Plan</span>
                      <span className="font-semibold">{plans[selectedPlan].name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <span className="font-semibold">{plans[selectedPlan].price}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
                      <span className="font-semibold">
                        Every {plans[selectedPlan].interval}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Next Billing</span>
                      <span className="font-semibold">
                        {new Date(
                          Date.now() +
                            (selectedPlan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Link */}
                  {txSignature && (
                    <div className="mb-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(
                            `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                            "_blank"
                          )
                        }
                      >
                        View Transaction on Solscan
                      </Button>
                    </div>
                  )}

                  {/* Cancel Button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    You can cancel anytime. No refunds for partial periods.
                  </p>
                </div>
              </SimpleCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
