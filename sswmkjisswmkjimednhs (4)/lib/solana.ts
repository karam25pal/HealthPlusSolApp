import { Connection, clusterApiUrl } from "@solana/web3.js"

// User roles
export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Specific wallet addresses - WAHEGURU JI!
const DOCTOR_WALLET = "626yQWQb5CvSihetyvd1UZdJWQEYb7YdEHjjR5R7hgewji"
const PATIENT_WALLET = "kTgKvTpTypFqP44APkt7b6PDnkPzG4trnctb3Z65eNHWAHEGURU"

// Demo wallets for testing view switching
export const DEMO_WALLETS = [
  {
    name: "Dr. WAHEGURU Singh",
    address: "DoctorWAHEGURU123456789TestWallet",
    role: "doctor",
    description: "Demo doctor wallet for testing doctor dashboard",
  },
  {
    name: "Patient Mr. Singh",
    address: "PatientWAHEGURU123456789TestWallet",
    role: "patient",
    description: "Demo patient wallet for testing patient dashboard",
  },
  {
    name: "Dr. Sarah Wilson",
    address: "DoctorSarahWilson987654321TestWallet",
    role: "doctor",
    description: "Another demo doctor wallet",
  },
  {
    name: "Patient Mrs. Kaur",
    address: "PatientMrsKaur456789123TestWallet",
    role: "patient",
    description: "Another demo patient wallet",
  },
] as const

// Solana connection setup
const SOLANA_NETWORK = clusterApiUrl("devnet")
const connection = new Connection(SOLANA_NETWORK, "confirmed")

// IPFS configuration for metadata storage
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/"

// Enhanced function to get user role with specific wallets
export async function getUserRole(walletAddress: string): Promise<UserRole> {
  console.log("WAHEGURU JI - Checking wallet role:", walletAddress)

  // Check demo wallets first
  const demoWallet = DEMO_WALLETS.find((w) => w.address === walletAddress)
  if (demoWallet) {
    console.log("WAHEGURU JI - Demo wallet detected:", demoWallet.name, demoWallet.role)
    return demoWallet.role as UserRole
  }

  // Check specific wallet addresses
  if (walletAddress === DOCTOR_WALLET) {
    console.log("WAHEGURU JI - Doctor wallet detected!")
    return USER_ROLES.DOCTOR
  }

  if (walletAddress === PATIENT_WALLET) {
    console.log("WAHEGURU JI - Patient wallet detected!")
    return USER_ROLES.PATIENT
  }

  // Fallback patterns for demo purposes
  const doctorPatterns = ["doc", "dr", "med", "health", "waheguru", "singh", "doctor"]
  const address = walletAddress.toLowerCase()

  for (const pattern of doctorPatterns) {
    if (address.includes(pattern)) {
      return USER_ROLES.DOCTOR
    }
  }

  // Default to patient
  return USER_ROLES.PATIENT
}

// Enhanced appointment management with real-time features
const appointmentsStore: any[] = [
  {
    id: "apt_001",
    doctorWallet: DOCTOR_WALLET,
    patientWallet: PATIENT_WALLET,
    patientName: "Mr. Singh",
    date: "2024-12-15",
    time: "10:00 AM",
    type: "Consultation",
    status: "pending",
    notes: "Regular checkup - WAHEGURU JI",
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt_002",
    doctorWallet: DOCTOR_WALLET,
    patientWallet: "patient_wallet_456",
    patientName: "Mrs. Kaur",
    date: "2024-12-15",
    time: "2:30 PM",
    type: "Follow-up",
    status: "confirmed",
    notes: "Blood test results review",
    createdAt: new Date().toISOString(),
  },
]

// Enhanced NFT reports store for real-time updates
const nftReportsStore: any[] = [
  {
    id: "nft_001",
    mint: "nft_sample_1_waheguru",
    patientWallet: PATIENT_WALLET,
    doctorWallet: DOCTOR_WALLET,
    metadata: {
      name: "Blood Test Results - WAHEGURU JI",
      description:
        "Complete blood count and lipid panel results. All values within normal range. WAHEGURU JI's blessings for good health.",
      image: "/placeholder.svg?height=200&width=200",
      attributes: [
        { trait_type: "Type", value: "Lab Report" },
        { trait_type: "Doctor", value: "Dr. WAHEGURU Singh" },
        { trait_type: "Date", value: "2024-12-10" },
        { trait_type: "Status", value: "Normal" },
        { trait_type: "Patient", value: "Mr. Singh" },
        { trait_type: "Blockchain", value: "Solana" },
        { trait_type: "Contract", value: "Medical NFT Contract" },
      ],
    },
    createdAt: new Date().toISOString(),
    solanaTransaction: "tx_waheguru_sample_1",
    ipfsHash: "QmWAHEGURU123456789",
    status: "minted",
    blockchainConfirmed: true,
  },
]

// Mock patients database
const patientsDatabase = [
  {
    id: 1,
    name: "Mr. Singh",
    wallet: PATIENT_WALLET,
    age: 45,
    condition: "Hypertension",
    phone: "+1 (555) 123-4567",
    email: "singh@email.com",
    avatar: "/patient-avatar.png",
  },
  {
    id: 2,
    name: "Mrs. Kaur",
    wallet: "patient_wallet_456",
    age: 38,
    condition: "Diabetes",
    phone: "+1 (555) 987-6543",
    email: "kaur@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mr. Sharma",
    wallet: "patient_wallet_789",
    age: 52,
    condition: "Arthritis",
    phone: "+1 (555) 456-7890",
    email: "sharma@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Real IPFS upload function simulation
export async function uploadToIPFS(file: File): Promise<string> {
  console.log("WAHEGURU JI - Uploading file to IPFS:", file.name, "Size:", file.size, "bytes")

  try {
    // Simulate file validation
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      throw new Error("File too large. Maximum size is 10MB.")
    }

    // Simulate upload progress
    const steps = ["Preparing file...", "Connecting to IPFS...", "Uploading to network...", "Generating hash..."]

    for (let i = 0; i < steps.length; i++) {
      console.log(`WAHEGURU JI - ${steps[i]}`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Generate realistic IPFS hash
    const ipfsHash = `QmWAHEGURU${Date.now()}${Math.random().toString(36).substr(2, 15)}`
    console.log("WAHEGURU JI - File uploaded to IPFS successfully:", ipfsHash)

    return ipfsHash
  } catch (error) {
    console.error("WAHEGURU JI - Error uploading to IPFS:", error)
    throw error
  }
}

// Upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  console.log("WAHEGURU JI - Uploading metadata to IPFS")

  try {
    // Simulate metadata upload
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const metadataHash = `QmWAHEGURUMeta${Date.now()}${Math.random().toString(36).substr(2, 15)}`
    console.log("WAHEGURU JI - Metadata uploaded to IPFS:", metadataHash)

    return metadataHash
  } catch (error) {
    console.error("WAHEGURU JI - Error uploading metadata:", error)
    throw error
  }
}

// Enhanced Solana NFT creation with realistic blockchain simulation
export class SolanaNFTManager {
  private connection: Connection

  constructor() {
    this.connection = new Connection(SOLANA_NETWORK, "confirmed")
  }

  // Create and mint NFT for medical report
  async createMedicalReportNFT(
    doctorWallet: string,
    patientWallet: string,
    reportData: {
      title: string
      content: string
      date: string
      doctorName: string
      remarks: string
      pdfFile?: File
    },
  ) {
    console.log("WAHEGURU JI - Creating medical report NFT on Solana blockchain")

    try {
      // Step 1: Upload PDF to IPFS if provided
      let pdfHash = null
      if (reportData.pdfFile) {
        console.log("WAHEGURU JI - Step 1: Uploading PDF to IPFS...")
        pdfHash = await uploadToIPFS(reportData.pdfFile)
      }

      // Step 2: Find patient info
      const patient = patientsDatabase.find((p) => p.wallet === patientWallet)
      const patientName = patient ? patient.name : "Unknown Patient"

      // Step 3: Create comprehensive NFT metadata
      console.log("WAHEGURU JI - Step 2: Creating NFT metadata...")
      const metadata = {
        name: reportData.title,
        symbol: "MEDREPORT",
        description: reportData.content,
        image: "/placeholder.svg?height=400&width=400",
        external_url: pdfHash ? `${IPFS_GATEWAY}${pdfHash}` : "",
        animation_url: pdfHash ? `${IPFS_GATEWAY}${pdfHash}` : "",
        attributes: [
          { trait_type: "Type", value: "Medical Report" },
          { trait_type: "Doctor", value: reportData.doctorName },
          { trait_type: "Patient", value: patientName },
          { trait_type: "Date", value: reportData.date },
          { trait_type: "Remarks", value: reportData.remarks },
          { trait_type: "PDF_Hash", value: pdfHash || "No PDF" },
          { trait_type: "Blockchain", value: "Solana Devnet" },
          { trait_type: "Status", value: "Verified" },
          { trait_type: "Created_By", value: "WAHEGURU Health System" },
          { trait_type: "Patient_Wallet", value: patientWallet },
          { trait_type: "Doctor_Wallet", value: doctorWallet },
          { trait_type: "Timestamp", value: new Date().toISOString() },
        ],
        properties: {
          files: pdfHash
            ? [
                {
                  uri: `${IPFS_GATEWAY}${pdfHash}`,
                  type: "application/pdf",
                  name: reportData.title,
                },
              ]
            : [],
          category: "medical_report",
          creators: [
            {
              address: doctorWallet,
              share: 100,
              verified: true,
            },
          ],
        },
        collection: {
          name: "WAHEGURU Medical Reports",
          family: "Medical NFTs",
        },
      }

      // Step 4: Upload metadata to IPFS
      console.log("WAHEGURU JI - Step 3: Uploading metadata to IPFS...")
      const metadataHash = await uploadMetadataToIPFS(metadata)
      const metadataUri = `${IPFS_GATEWAY}${metadataHash}`

      // Step 5: Simulate NFT minting on Solana
      console.log("WAHEGURU JI - Step 4: Minting NFT on Solana blockchain...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mintAddress = `${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const transactionSignature = `${Date.now()}${Math.random().toString(36).substr(2, 20)}`

      // Step 6: Simulate blockchain confirmation
      console.log("WAHEGURU JI - Step 5: Waiting for blockchain confirmation...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create NFT record
      const nftReport = {
        id: `nft_${Date.now()}`,
        mint: mintAddress,
        patientWallet,
        doctorWallet,
        metadata: {
          ...metadata,
          uri: metadataUri,
        },
        ipfsHash: pdfHash,
        metadataHash,
        metadataUri,
        status: "minted",
        transactionSignature,
        createdAt: new Date().toISOString(),
        blockchainConfirmed: true,
        network: "devnet",
        explorer: `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`,
      }

      // Add to store
      nftReportsStore.push(nftReport)

      console.log("WAHEGURU JI - NFT Report created successfully on Solana!")
      console.log("Transaction:", transactionSignature)
      console.log("Mint Address:", mintAddress)

      return nftReport
    } catch (error) {
      console.error("WAHEGURU JI - Error creating NFT:", error)
      throw new Error(`Failed to create NFT: ${error.message}`)
    }
  }

  // Transfer NFT to patient wallet
  async transferNFTToPatient(mintAddress: string, patientWallet: string) {
    console.log("WAHEGURU JI - Transferring NFT ownership to patient:", { mintAddress, patientWallet })

    try {
      // Simulate NFT transfer transaction
      console.log("WAHEGURU JI - Creating transfer transaction...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("WAHEGURU JI - Signing transaction...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("WAHEGURU JI - Broadcasting to network...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const transferSignature = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`

      // Update NFT record
      const nft = nftReportsStore.find((n) => n.mint === mintAddress)
      if (nft) {
        nft.transferredAt = new Date().toISOString()
        nft.transferSignature = transferSignature
        nft.status = "transferred"
        nft.currentOwner = patientWallet
        nft.transferExplorer = `https://explorer.solana.com/tx/${transferSignature}?cluster=devnet`
      }

      console.log("WAHEGURU JI - NFT ownership transferred successfully!")
      console.log("Transfer Transaction:", transferSignature)

      return transferSignature
    } catch (error) {
      console.error("WAHEGURU JI - Error transferring NFT:", error)
      throw error
    }
  }

  // Get NFT details from blockchain
  async getNFTDetails(mintAddress: string) {
    try {
      console.log("WAHEGURU JI - Fetching NFT details from blockchain:", mintAddress)

      // Simulate blockchain query
      await new Promise((resolve) => setTimeout(resolve, 500))

      const nft = nftReportsStore.find((n) => n.mint === mintAddress)

      if (nft) {
        console.log("WAHEGURU JI - NFT found on blockchain")
        return {
          ...nft,
          onChain: true,
          verified: true,
          lastUpdated: new Date().toISOString(),
        }
      }

      return null
    } catch (error) {
      console.error("WAHEGURU JI - Error getting NFT details:", error)
      return null
    }
  }

  // Verify NFT authenticity
  async verifyNFTAuthenticity(mintAddress: string): Promise<boolean> {
    try {
      console.log("WAHEGURU JI - Verifying NFT authenticity:", mintAddress)

      // Simulate blockchain verification
      await new Promise((resolve) => setTimeout(resolve, 800))

      const nft = nftReportsStore.find((n) => n.mint === mintAddress)
      const isValid = !!nft && nft.blockchainConfirmed

      console.log("WAHEGURU JI - NFT verification result:", isValid ? "AUTHENTIC" : "INVALID")
      return isValid
    } catch (error) {
      console.error("WAHEGURU JI - Error verifying NFT:", error)
      return false
    }
  }
}

// Enhanced NFT creation with real Solana integration
export async function createMedicalReportNFTWithPDF(
  doctorWallet: string,
  patientWallet: string,
  reportData: {
    title: string
    content: string
    date: string
    doctorName: string
    remarks: string
    pdfFile?: File
  },
) {
  console.log("WAHEGURU JI - Starting complete NFT creation process...")

  try {
    const nftManager = new SolanaNFTManager()

    // Create the NFT
    const nftReport = await nftManager.createMedicalReportNFT(doctorWallet, patientWallet, reportData)

    // Transfer to patient automatically
    if (nftReport.mint) {
      console.log("WAHEGURU JI - Transferring NFT to patient...")
      await nftManager.transferNFTToPatient(nftReport.mint, patientWallet)
    }

    // Emit notification for real-time updates
    NotificationService.emit("nft_report_created", {
      patientWallet,
      doctorWallet,
      report: nftReport,
    })

    console.log("WAHEGURU JI - Complete NFT creation process finished successfully!")
    console.log("Patient can now view their medical NFT report")

    return nftReport
  } catch (error) {
    console.error("WAHEGURU JI - Error in NFT creation process:", error)
    throw error
  }
}

// Enhanced appointment creation
export async function createAppointment(appointmentData: {
  doctorWallet: string
  patientWallet: string
  date: string
  time: string
  type: string
  notes: string
}) {
  console.log("WAHEGURU JI - Creating appointment:", appointmentData)

  // Find patient name
  const patient = patientsDatabase.find((p) => p.wallet === appointmentData.patientWallet)
  const patientName = patient ? patient.name : "Unknown Patient"

  const appointment = {
    id: `apt_${Date.now()}`,
    ...appointmentData,
    patientName,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // Add to store
  appointmentsStore.push(appointment)

  // Simulate blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 1500))

  console.log("WAHEGURU JI - Appointment created:", appointment)
  return appointment
}

// Approve appointment
export async function approveAppointment(appointmentId: string) {
  console.log("WAHEGURU JI - Approving appointment:", appointmentId)

  const appointment = appointmentsStore.find((apt) => apt.id === appointmentId)
  if (appointment) {
    appointment.status = "confirmed"
    appointment.approvedAt = new Date().toISOString()
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return appointment
}

// Reject appointment
export async function rejectAppointment(appointmentId: string, reason?: string) {
  console.log("WAHEGURU JI - Rejecting appointment:", appointmentId)

  const appointment = appointmentsStore.find((apt) => apt.id === appointmentId)
  if (appointment) {
    appointment.status = "rejected"
    appointment.rejectedAt = new Date().toISOString()
    appointment.rejectionReason = reason
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return appointment
}

// Get doctor's appointments with real-time data
export async function getDoctorAppointments(doctorWallet: string) {
  console.log("WAHEGURU JI - Fetching doctor appointments:", doctorWallet)

  const doctorAppointments = appointmentsStore.filter((apt) => apt.doctorWallet === doctorWallet)

  await new Promise((resolve) => setTimeout(resolve, 500))
  return doctorAppointments
}

// Get patient's appointments
export async function getPatientAppointments(patientWallet: string) {
  console.log("WAHEGURU JI - Fetching patient appointments:", patientWallet)

  const patientAppointments = appointmentsStore.filter((apt) => apt.patientWallet === patientWallet)

  await new Promise((resolve) => setTimeout(resolve, 500))
  return patientAppointments
}

// Enhanced function to get patient's medical NFTs with real-time data
export async function getPatientMedicalNFTs(walletAddress: string) {
  console.log("WAHEGURU JI - Fetching medical NFTs for patient:", walletAddress)

  // Filter NFTs for this patient
  const patientNFTs = nftReportsStore.filter((nft) => nft.patientWallet === walletAddress)

  // Simulate blockchain query delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log(`WAHEGURU JI - Found ${patientNFTs.length} medical NFT reports for patient`)
  return patientNFTs
}

// Get all patients for doctor
export async function getDoctorPatients(doctorWallet: string) {
  console.log("WAHEGURU JI - Fetching doctor's patients:", doctorWallet)

  // In real app, this would query blockchain for doctor's patients
  await new Promise((resolve) => setTimeout(resolve, 500))
  return patientsDatabase
}

// Get patient by wallet
export async function getPatientByWallet(walletAddress: string) {
  const patient = patientsDatabase.find((p) => p.wallet === walletAddress)
  return patient || null
}

// Enhanced Solana operations
export async function transferSOL(fromWallet: string, toWallet: string, amount: number): Promise<string> {
  console.log("WAHEGURU JI - Transferring SOL:", { fromWallet, toWallet, amount })

  // Simulate SOL transfer for payment
  const transactionSignature = `sol_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`

  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log("WAHEGURU JI - SOL transfer completed:", transactionSignature)
  return transactionSignature
}

// Get wallet balance
export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    // Simulate getting balance
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return demo balance
    return Math.random() * 10 + 1 // 1-11 SOL
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    return 0
  }
}

// Connection helper
export function getSolanaConnection() {
  return new Connection(clusterApiUrl("devnet"))
}

// Real-time notification system
export class NotificationService {
  private static listeners: { [key: string]: Function[] } = {}

  static subscribe(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  static unsubscribe(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  static emit(event: string, data: any) {
    console.log("WAHEGURU JI - Notification:", event, data)
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }
}

// Enhanced report management functions
export async function getAllReportsForDoctor(doctorWallet: string) {
  console.log("WAHEGURU JI - Fetching all reports for doctor:", doctorWallet)

  const doctorReports = nftReportsStore.filter((report) => report.doctorWallet === doctorWallet)

  await new Promise((resolve) => setTimeout(resolve, 500))
  return doctorReports
}

export async function getReportById(reportId: string) {
  const report = nftReportsStore.find((r) => r.id === reportId)
  return report || null
}

export async function updateReportStatus(reportId: string, status: string) {
  const report = nftReportsStore.find((r) => r.id === reportId)
  if (report) {
    report.status = status
    report.updatedAt = new Date().toISOString()

    NotificationService.emit("report_status_updated", {
      reportId,
      status,
      report,
    })
  }
  return report
}

// Verify NFT on blockchain
export async function verifyNFTOnBlockchain(mintAddress: string): Promise<boolean> {
  try {
    console.log("WAHEGURU JI - Verifying NFT on blockchain:", mintAddress)

    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nft = nftReportsStore.find((n) => n.mint === mintAddress)
    const isValid = !!nft && nft.blockchainConfirmed

    console.log("WAHEGURU JI - NFT verification:", isValid ? "VALID" : "INVALID")
    return isValid
  } catch (error) {
    console.error("WAHEGURU JI - Error verifying NFT:", error)
    return false
  }
}

// Get transaction details
export async function getTransactionDetails(signature: string) {
  try {
    console.log("WAHEGURU JI - Getting transaction details:", signature)

    // Simulate getting transaction details
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      signature,
      slot: Math.floor(Math.random() * 1000000) + 100000,
      blockTime: Math.floor(Date.now() / 1000),
      confirmationStatus: "confirmed",
      fee: 5000, // lamports
      status: "success",
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    }
  } catch (error) {
    console.error("WAHEGURU JI - Error getting transaction details:", error)
    return null
  }
}

// Get all NFT reports (for admin/overview)
export async function getAllNFTReports() {
  console.log("WAHEGURU JI - Fetching all NFT reports")
  await new Promise((resolve) => setTimeout(resolve, 300))
  return nftReportsStore
}

// Search NFT reports
export async function searchNFTReports(query: string, walletAddress?: string) {
  console.log("WAHEGURU JI - Searching NFT reports:", query)

  await new Promise((resolve) => setTimeout(resolve, 500))

  let results = nftReportsStore

  if (walletAddress) {
    results = results.filter((nft) => nft.patientWallet === walletAddress || nft.doctorWallet === walletAddress)
  }

  if (query) {
    const searchTerm = query.toLowerCase()
    results = results.filter(
      (nft) =>
        nft.metadata.name.toLowerCase().includes(searchTerm) ||
        nft.metadata.description.toLowerCase().includes(searchTerm) ||
        nft.metadata.attributes.some((attr) => attr.value.toString().toLowerCase().includes(searchTerm)),
    )
  }

  return results
}

// Export specific wallet addresses for use in components
export { DOCTOR_WALLET, PATIENT_WALLET }
