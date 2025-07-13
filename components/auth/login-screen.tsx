"use client"

import { useEffect, useState } from "react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"

import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"
import { PatientNFTReports } from "@/components/patient/patient-nft-reports"
import { getUserRole, USER_ROLES } from "@/lib/solana"

/**
 * LoginScreen
 * 1. Prompts the visitor to connect a Solana wallet.
 * 2. Looks up the user’s role (doctor or patient).
 * 3. Shows the correct dashboard.
 */
export default function LoginScreen() {
  const { connected, publicKey, disconnect } = useWallet()
  const [role, setRole] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(false)

  // Determine role once the wallet is connected.
  useEffect(() => {
    if (!connected || !publicKey) return
    setLoadingRole(true)
    ;(async () => {
      const r = await getUserRole(publicKey.toString())
      setRole(r)
      setLoadingRole(false)
    })()
  }, [connected, publicKey])

  // 1️⃣  Wallet NOT connected yet ­→ show connect button.
  if (!connected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold text-center">Connect your&nbsp;Solana&nbsp;wallet</h1>
        <WalletMultiButton />
      </main>
    )
  }

  // 2️⃣  Wallet connected but role still loading.
  if (loadingRole) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
      </main>
    )
  }

  // 3️⃣  Show the correct interface.
  if (role === USER_ROLES.DOCTOR) {
    return (
      <DoctorDashboard
        walletAddress={publicKey!.toString()}
        onLogout={() => {
          disconnect().catch(() => null)
          location.reload()
        }}
      />
    )
  }

  // Default = patient dashboard (NFT reports + anything else you add)
  return (
    <main className="p-4 max-w-4xl mx-auto space-y-6">
      <PatientNFTReports walletAddress={publicKey!.toString()} />
    </main>
  )
}
