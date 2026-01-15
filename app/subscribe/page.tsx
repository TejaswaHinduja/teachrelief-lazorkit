"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { SimpleCard } from "@/components/ui/simple-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import Link from "next/link";
import Hat from "@/app/icon/hat";

type Plan = "monthly" | "yearly";

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, smartWalletPubkey, signAndSendTransaction, wallet, disconnect, connect } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Helper function to reconnect wallet
  const handleReconnect = async () => {
    try {
      setIsReconnecting(true);
      setError(null);
      await disconnect();
      // Wait a moment before reconnecting
      await new Promise(resolve => setTimeout(resolve, 500));
      // Reconnect with paymaster fee mode for gasless transactions
      await connect({ feeMode: 'paymaster' });
    } catch (err) {
      console.error("Reconnection failed:", err);
      setError("Failed to reconnect. Please refresh the page and try again.");
    } finally {
      setIsReconnecting(false);
    }
  };

  // Handle plan parameter from URL (e.g., /subscribe?plan=yearly)
  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "monthly" || planParam === "yearly") {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

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
      hasWallet: !!wallet,
      hasSignAndSendTransaction: typeof signAndSendTransaction === "function",
    });
  }, [isConnected, smartWalletPubkey, wallet, signAndSendTransaction]);

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

      // Validate wallet connection
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }

      if (!smartWalletPubkey) {
        throw new Error("Wallet address not available. Please reconnect your wallet.");
      }

      if (!wallet) {
        throw new Error("Wallet object not available. Please reconnect your wallet.");
      }

      if (!signAndSendTransaction) {
        throw new Error("Transaction signing not available. Please reconnect your wallet.");
      }

      console.log("Wallet validation passed:", {
        isConnected,
        hasSmartWalletPubkey: !!smartWalletPubkey,
        hasWallet: !!wallet,
        hasSignAndSendTransaction: !!signAndSendTransaction,
      });

      console.log("Smart wallet pubkey:", smartWalletPubkey.toString());

      const plan = plans[selectedPlan];
      const amount =
        selectedPlan === "monthly"
          ? 0.05 * LAMPORTS_PER_SOL
          : 0.5 * LAMPORTS_PER_SOL;

      // Validate amount
      if (amount <= 0 || amount > 1000 * LAMPORTS_PER_SOL) {
        throw new Error("Invalid transaction amount");
      }

      // Check wallet balance - IMPORTANT: Even with gasless transactions, wallet needs SOL for the transfer amount
      try {
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const balance = await connection.getBalance(smartWalletPubkey);
        const balanceSOL = balance / LAMPORTS_PER_SOL;
        const requiredSOL = amount / LAMPORTS_PER_SOL;
        
        console.log("Wallet balance check:", {
          balance: balance,
          balanceSOL: balanceSOL.toFixed(6),
          requiredSOL: requiredSOL.toFixed(6),
          hasEnough: balance >= amount,
        });
        
        if (balance < amount) {
          const errorMsg = `Insufficient balance. Your wallet has ${balanceSOL.toFixed(4)} SOL, but you need ${requiredSOL.toFixed(4)} SOL for this transaction. Even though gas fees are free, you still need SOL for the transfer amount. Please fund your wallet first.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
      } catch (balanceErr: any) {
        // If it's a balance error, throw it
        if (balanceErr.message?.includes("Insufficient balance")) {
          throw balanceErr;
        }
        // If balance check fails for other reasons, log but continue
        console.warn("Could not check balance:", balanceErr.message);
      }

      // Use recipient address from config
      const recipientAddress = CONFIG.SUBSCRIPTION_RECIPIENT;

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

      console.log("Creating transfer instruction...");
      console.log("From:", smartWalletPubkey.toString());
      console.log("To:", recipientPubkey.toString());
      console.log("Amount:", amount, "lamports (", amount / LAMPORTS_PER_SOL, "SOL)");

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amount,
      });

      console.log("Instruction created successfully");
      
      // Wait a moment to ensure wallet is fully ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Double-check wallet state before signing
      if (!isConnected || !smartWalletPubkey || !wallet) {
        throw new Error("Wallet not ready. Please wait a moment and try again.");
      }

      console.log("Wallet state before signing:", {
        isConnected,
        hasSmartWalletPubkey: !!smartWalletPubkey,
        smartWalletPubkey: smartWalletPubkey.toString(),
        hasWallet: !!wallet,
        walletSmartWallet: wallet?.smartWallet,
        hasSignAndSendTransaction: typeof signAndSendTransaction === "function",
      });

      // Verify wallet.smartWallet matches smartWalletPubkey
      if (wallet?.smartWallet && wallet.smartWallet !== smartWalletPubkey.toString()) {
        console.warn("Wallet address mismatch:", {
          walletSmartWallet: wallet.smartWallet,
          smartWalletPubkey: smartWalletPubkey.toString(),
        });
      }

      console.log("Signing and sending transaction with gasless option...");
      console.log("Instruction details:", {
        from: smartWalletPubkey.toString(),
        to: recipientPubkey.toString(),
        lamports: amount,
        solAmount: amount / LAMPORTS_PER_SOL,
      });
      
      // Sign and send with gasless transaction
      let signature: string;
      try {
        // Ensure we have a fresh reference to the function
        if (typeof signAndSendTransaction !== "function") {
          throw new Error("Transaction signing function not available. Please reconnect your wallet.");
        }

        // Verify wallet is still connected and ready
        if (!isConnected || !wallet || !smartWalletPubkey) {
          throw new Error("Wallet session expired. Please reconnect your wallet.");
        }

        // Call signAndSendTransaction with proper structure
        console.log("Calling signAndSendTransaction...");
        console.log("Wallet credential ID:", wallet.credentialId);
        console.log("Wallet smart wallet address:", wallet.smartWallet);
        
        // The signAndSendTransaction will trigger passkey authentication
        // Make sure the user is ready to authenticate
        signature = await signAndSendTransaction({
          instructions: [instruction],
          transactionOptions: {
            // Gas fees automatically sponsored by paymaster
            // Optional: specify compute unit limit if needed
            // computeUnitLimit: 200_000,
          },
        });
        console.log("signAndSendTransaction call completed, signature:", signature);
      } catch (signError: any) {
        // Log detailed error information
        console.error("=== SIGNING ERROR DETAILS ===");
        console.error("Raw error:", signError);
        console.error("Error type:", typeof signError);
        console.error("Error constructor:", signError?.constructor?.name);
        console.error("Error keys:", Object.keys(signError || {}));
        
        // Try to extract error message from various possible properties
        const errorDetails: any = {
          message: signError?.message,
          name: signError?.name,
          stack: signError?.stack,
          code: signError?.code,
          err: signError?.err,
          error: signError?.error,
          reason: signError?.reason,
          cause: signError?.cause,
          toString: signError?.toString?.(),
        };
        
        // Check nested error objects
        if (signError?.error) {
          errorDetails.nestedError = {
            message: signError.error?.message,
            code: signError.error?.code,
            name: signError.error?.name,
            stack: signError.error?.stack,
          };
        }
        
        // Check for logs if available (Solana errors often have logs)
        if (signError?.logs) {
          errorDetails.logs = signError.logs;
          console.error("Transaction logs:", signError.logs);
        }
        
        console.error("Extracted error details:", errorDetails);
        console.error("=== END ERROR DETAILS ===");
        
        // Re-throw with better message
        let errorMsg = "Signing failed. Please check your wallet connection and try again.";
        
        if (signError?.message) {
          errorMsg = signError.message;
        } else if (signError?.error?.message) {
          errorMsg = signError.error.message;
        } else if (signError?.reason) {
          errorMsg = signError.reason;
        } else if (signError?.toString && typeof signError.toString === "function") {
          const strErr = signError.toString();
          if (strErr !== "[object Object]") {
            errorMsg = strErr;
          }
        }
        
        // Add helpful context based on error
        if (errorMsg.toLowerCase().includes("insufficient") || errorMsg.toLowerCase().includes("balance")) {
          errorMsg = "Insufficient balance. Even with gasless transactions, your wallet needs SOL for the transfer amount. Please fund your wallet first.";
        } else if (errorMsg.toLowerCase().includes("sign") || errorMsg.toLowerCase().includes("auth") || 
                   errorMsg.toLowerCase().includes("credential") || errorMsg.toLowerCase().includes("webauthn") ||
                   errorMsg.toLowerCase().includes("passkey") || errorMsg.toLowerCase().includes("not allowed")) {
          errorMsg = "Passkey authentication failed. This usually happens when:\n1. You cancelled the biometric prompt\n2. Your device's biometric authentication failed\n3. The passkey session expired\n\nPlease try again and make sure to complete the biometric authentication when prompted.";
        } else if (errorMsg.toLowerCase().includes("session") || errorMsg.toLowerCase().includes("expired")) {
          errorMsg = "Wallet session expired. Please reconnect your wallet and try again.";
        }
        
        throw new Error(errorMsg);
      }

      console.log("Transaction signature:", signature);
      setTxSignature(signature);
      setIsSubscribed(true);
      console.log("Subscription successful:", signature);
    } catch (err: any) {
      console.error("Subscription failed:", err);
      
      // Extract error message from various possible sources
      let errorMessage = "Subscription failed. Please try again.";
      
      // Try different ways to extract the error message
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.reason) {
        errorMessage = err.reason;
      } else if (err?.toString && typeof err.toString === "function") {
        const stringErr = err.toString();
        if (stringErr !== "[object Object]") {
          errorMessage = stringErr;
        }
      }
      
      // Check for specific error patterns
      if (errorMessage.toLowerCase().includes("signing failed") || 
          errorMessage.toLowerCase().includes("sign")) {
        errorMessage = "Unable to sign transaction. Please ensure your wallet is connected and try again. If the issue persists, try disconnecting and reconnecting your wallet.";
      } else if (errorMessage.includes("simulation") || errorMessage.includes("Instruction Error")) {
        errorMessage = "Transaction simulation failed. Please ensure your wallet has sufficient balance and try again.";
      } else if (errorMessage.includes("balance") || errorMessage.includes("insufficient")) {
        // Keep the balance error message as is
      } else if (errorMessage === "Subscription failed. Please try again.") {
        // If we couldn't extract a meaningful message, provide a helpful default
        errorMessage = "Transaction failed. Please check your wallet connection and ensure you have sufficient balance, then try again.";
      }
      
      console.error("Final error message:", errorMessage);
      setError(errorMessage);
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
          "mask[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="fixed inset-0 -z-10 pointer-events-none bg-linear-to-b from-sky-200/40 via-blue-200/30 to-blue-300/20" />

      {/* Header */}
      <header className="w-full absolute top-0 left-0 z-40 bg-transparent">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link href="/dashboard" className="flex items-center text-gray-700 dark:text-gray-200 hover:opacity-80 transition-opacity">
            <Hat />
            <span className="ml-2 font-semibold">TeachRelief</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a subscription plan to get started
            </p>
          </div>

          {!isSubscribed ? (
            <>
              {/* Plan Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Monthly Plan */}
                <div
                  className={`relative p-6 bg-white dark:bg-gray-900 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "monthly"
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan("monthly")}
                >
                  {selectedPlan === "monthly" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">Monthly</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plans.monthly.price}</span>
                      <span className="text-sm text-gray-500">/{plans.monthly.interval}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plans.monthly.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Yearly Plan */}
                <div
                  className={`relative p-6 bg-white dark:bg-gray-900 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "yearly"
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan("yearly")}
                >
                  {plans.yearly.savings && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {plans.yearly.savings}
                    </div>
                  )}
                  {selectedPlan === "yearly" && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">Yearly</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plans.yearly.price}</span>
                      <span className="text-sm text-gray-500">/{plans.yearly.interval}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plans.yearly.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="text-sm text-red-800 dark:text-red-200 mb-3 whitespace-pre-line">
                    {error}
                  </div>
                  {(error.toLowerCase().includes("sign") || 
                    error.toLowerCase().includes("wallet") || 
                    error.toLowerCase().includes("auth") ||
                    error.toLowerCase().includes("passkey") ||
                    error.toLowerCase().includes("session")) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReconnect}
                      disabled={isReconnecting}
                      className="w-full"
                    >
                      {isReconnecting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Reconnecting...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🔄</span>
                          Reconnect Wallet
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Subscribe Button */}
              <div className="max-w-md mx-auto space-y-3">
                <Button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full py-6 text-lg font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe Now - {plans[selectedPlan].price}
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  🔒 Auto-renewal • Cancel anytime • Gas fees sponsored
                </p>
              </div>
            </>
          ) : (
            /* Subscription Active State */
            <div className="max-w-lg mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                {/* Success Message */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Subscription Active!</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plans[selectedPlan].name}
                  </p>
                </div>

                {/* Subscription Details */}
                <div className="space-y-2 mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-semibold">{plans[selectedPlan].price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Billing Cycle</span>
                    <span className="font-semibold">Every {plans[selectedPlan].interval}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Billing</span>
                    <span className="font-semibold text-sm">
                      {new Date(
                        Date.now() +
                          (selectedPlan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Transaction Link */}
                {txSignature && (
                  <Button
                    variant="outline"
                    className="w-full mb-3"
                    onClick={() =>
                      window.open(
                        `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                        "_blank"
                      )
                    }
                  >
                    View Transaction
                  </Button>
                )}

                {/* Cancel Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
