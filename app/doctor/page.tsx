"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { EnhancedDoctorDashboard } from "@/components/doctor/enhanced-doctor-dashboard"

export default function DoctorPortal() {
  const { publicKey } = useWallet()

  return (
    <div>
      {publicKey ? (
        <EnhancedDoctorDashboard walletAddress={publicKey.toBase58()} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor's Dashboard</h1>
            <p className="text-gray-600 mb-6">Please connect your Solana wallet to manage patient records.</p>
            <WalletMultiButton />
            <p className="text-xs text-gray-500 mt-8">🙏 WAHEGURU JI - Bless your service to others. 🙏</p>
          </div>
        </div>
      )}
    </div>
  )
}
