"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { EnhancedPatientDashboard } from "@/components/patient/enhanced-patient-dashboard"

export default function PatientPortal() {
  const { publicKey, disconnect } = useWallet()

  return (
    <div>
      {publicKey ? (
        <EnhancedPatientDashboard walletAddress={publicKey.toBase58()} onLogout={disconnect} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Portal</h1>
            <p className="text-gray-600 mb-6">Please connect your Solana wallet to access your medical records.</p>
            <WalletMultiButton />
            <p className="text-xs text-gray-500 mt-8">🙏  - Your health data is safe with us. 🙏</p>
          </div>
        </div>
      )}
    </div>
  )
}
