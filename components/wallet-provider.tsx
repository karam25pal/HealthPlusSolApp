"use client"

import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import {
  WalletAdapterNetwork,
  WalletReadyState, // <- NEW: lets us check if a wallet is usable
} from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets"
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

// Import wallet-adapter modal CSS once
import "@solana/wallet-adapter-react-ui/styles.css"

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  // Network: devnet | testnet | mainnet-beta
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  /**
   * Build the wallet list:
   * 1. UnsafeBurner is always available (good for demos).
   * 2. Other wallets are added ONLY if their extension is installed
   *    (Installed) or can be dynamically imported (Loadable).
   */
  const wallets = useMemo(() => {
    const available = [new UnsafeBurnerWalletAdapter()]

    const optionalWallets = [new BackpackWalletAdapter(), new PhantomWalletAdapter(), new SolflareWalletAdapter()]

    optionalWallets.forEach((wallet) => {
      if (wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable) {
        available.push(wallet)
      }
    })

    return available
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect intentionally disabled so the user picks a wallet */}
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
