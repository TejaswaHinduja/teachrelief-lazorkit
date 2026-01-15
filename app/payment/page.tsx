"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { SimpleCard } from "@/components/ui/simple-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import Link from "next/link";
import Hat from "@/app/icon/hat";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function PaymentPage() {
  const router = useRouter();
  const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/auth/login");
    }
  }, [isConnected, router]);

  // Log wallet state for debugging
  useEffect(() => {
    console.log("Wallet state:", {
      isConnected,
      smartWalletPubkey: smartWalletPubkey?.toString(),
    });
  }, [isConnected, smartWalletPubkey]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setTxSignature(null);

      // Validate wallet connection
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }

      if (!smartWalletPubkey) {
        throw new Error("Wallet address not available. Please reconnect your wallet.");
      }

      console.log("Smart wallet pubkey:", smartWalletPubkey.toString());

      // Use recipient address from config
      const recipientAddress = CONFIG.PAYMENT_RECIPIENT;
      const amount = CONFIG.PAYMENT_AMOUNT * LAMPORTS_PER_SOL;

      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipientAddress);
        console.log("Recipient address validated:", recipientPubkey.toString());
      } catch (err) {
        throw new Error(`Invalid recipient address: ${recipientAddress}`);
      }

      // Ensure we're not sending to ourselves
      if (smartWalletPubkey.toString() === recipientPubkey.toString()) {
        throw new Error("Cannot send to the same wallet address");
      }

      // Check wallet balance
      try {
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const balance = await connection.getBalance(smartWalletPubkey);
        console.log("Wallet balance:", balance / LAMPORTS_PER_SOL, "SOL");
        
        if (balance < amount) {
          throw new Error(
            `Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL, but need ${CONFIG.PAYMENT_AMOUNT} SOL. Please fund your wallet first.`
          );
        }
      } catch (balanceErr: any) {
        console.warn("Could not check balance:", balanceErr.message);
        if (balanceErr.message.includes("Insufficient balance")) {
          throw balanceErr;
        }
      }

      console.log("Creating transfer instruction...");
      console.log("From:", smartWalletPubkey.toString());
      console.log("To:", recipientPubkey.toString());
      console.log("Amount:", amount, "lamports (", CONFIG.PAYMENT_AMOUNT, "SOL)");

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amount,
      });

      console.log("Signing and sending transaction...");
      // Sign and send with gasless transaction (paymaster handles fees)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          // Gas fees automatically sponsored by paymaster when connected with feeMode: 'paymaster'
          // Optional: specify compute unit limit if needed
          // computeUnitLimit: 200_000,
          // feeToken: "USDC", // Uncomment to pay gas fees in USDC instead of SOL
        },
      });

      console.log("Transaction signature:", signature);
      setTxSignature(signature);
      console.log("Payment successful:", signature);
    } catch (err: any) {
      console.error("Payment failed:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      
      // Provide more detailed error messages
      let errorMessage = "Payment failed. Please try again.";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.toString) {
        errorMessage = err.toString();
      }
      
      // Check for specific error types
      if (errorMessage.includes("simulation") || errorMessage.includes("Instruction Error")) {
        errorMessage = "Transaction failed. Please ensure your wallet has sufficient balance and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
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
          "mask[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="fixed inset-0 -z-10 pointer-events-none bg-linear-to-b from-sky-200/40 via-blue-200/30 to-blue-300/20" />

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
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Unlock AI Grading</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Make a one-time payment with gasless transactions
            </p>
          </div>

          {/* Payment Card */}
          <SimpleCard className="mb-8">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
              {/* Service Details */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">AI Grading Service</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Service</span>
                    <span className="font-semibold">AI Assignment Grading</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Price</span>
                    <span className="font-semibold">0.001 SOL</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Gas Fee</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      FREE (Sponsored)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">0.001 SOL</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  ✨ What you get:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>✓ Instant AI-powered grading</li>
                  <li>✓ Detailed feedback for students</li>
                  <li>✓ Support for multiple question types</li>
                  <li>✓ Save hours of manual grading</li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {txSignature && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✓ Payment Successful!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                    Transaction: {txSignature}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                        "_blank"
                      )
                    }
                  >
                    View on Solscan
                  </Button>
                </div>
              )}

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !!txSignature}
                className="w-full py-6 text-lg"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing Payment...
                  </>
                ) : txSignature ? (
                  <>
                    <span className="mr-2">✓</span>
                    Payment Complete
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Pay 0.001 SOL (Gasless)
                  </>
                )}
              </Button>

              {/* Info Text */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🔒 Secure payment powered by LazorKit • Gas fees sponsored by paymaster
                </p>
              </div>
            </div>
          </SimpleCard>

          {/* Info Box */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
              🚀 How Gasless Transactions Work
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Your transaction fees are automatically paid by our paymaster service. You only pay
              for the service itself - no extra fees for gas! This is made possible by LazorKit's
              smart wallet architecture on Solana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
