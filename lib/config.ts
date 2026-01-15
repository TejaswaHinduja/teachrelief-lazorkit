/**
 * Configuration file for TeachRelief application
 * 
 * In production, replace these with your actual addresses:
 * - SUBSCRIPTION_RECIPIENT: Your subscription service wallet address
 * - PAYMENT_RECIPIENT: Your payment service wallet address
 */

// Solana Devnet Configuration
export const CONFIG = {
  // Recipient addresses for transactions
  // Your actual wallet address for receiving payments
  SUBSCRIPTION_RECIPIENT: "9Z6KRFhhpVjmc512yx7Vb51FVmVD6r1hRvg2WiXcfHNc", // Your wallet address
  PAYMENT_RECIPIENT: "9Z6KRFhhpVjmc512yx7Vb51FVmVD6r1hRvg2WiXcfHNc", // Your wallet address
  
  // Network configuration
  NETWORK: "devnet" as const,
  
  // Transaction amounts (in SOL)
  SUBSCRIPTION_AMOUNTS: {
    monthly: 0.05, // 0.05 SOL per month
    yearly: 0.5,   // 0.5 SOL per year
  },
  
  PAYMENT_AMOUNT: 0.001, // 0.001 SOL for one-time payments
} as const;
