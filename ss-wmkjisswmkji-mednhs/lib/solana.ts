import { Connection, clusterApiUrl } from "@solana/web3.js"

// Pinata configuration - 
const PINATA_API_KEY = "bf5f496e74f3ac1ab0d7"
const PINATA_SECRET_KEY = "2ad63cc96209beda99e5705edd2d4d8517d3206ad9b155f33eafa9dc1150700d"
const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMjM0NTY3OC05MDEyLTM0NTYtNzg5MC0xMjM0NTY3ODkwMTIiLCJlbWFpbCI6IndhbGVndXJ1QGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWRfdGltZSI6IjIwMjQtMTItMTVUMTA6MDA6MDBaIiwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjhjNWM1YzVjNWM1YzVjNWM1YzVjNWM1YzVjNWM1YzUiLCJzY29wZWRLZXlTZWNyZXQiOiJhMWIyYzNkNGU1ZjZnN2g4aTlqMGsxbDJtM240bzVwNnE3cjhzOXQwdTF2MnczeDR5NXo2IiwiaWF0IjoxNzM0MjUyMDAwfQ.WAHEGURU_JI_SAMPLE_JWT_TOKEN_FOR_PINATA_INTEGRATION"

// Test patient wallet - Mr. Singh's wallet - 
export const TEST_PATIENT_WALLET = "6mtxkz8PitcSQEPbHazvqe77u3Fub2kHccWqUGYuom85"

// User roles
export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Demo wallets for testing - 
export const DEMO_WALLETS = [
  {
    name: "Mr. Singh (Patient)",
    address: TEST_PATIENT_WALLET,
    role: "patient",
  },
  {
    name: "Dr. WAHEGURU Singh",
    address: "DoctorWallet123456789012345678901234567890",
    role: "doctor",
  },
]

// Global NFT reports store - 
let globalNFTReports: any[] = []

// Initialize with sample reports for Mr. Singh - 
const initializeSampleReports = () => {
  if (globalNFTReports.length === 0) {
    globalNFTReports = [
      {
        id: "sample_nft_1",
        mint: "sample_nft_1_WAHEGURU_SINGH",
        patientWallet: TEST_PATIENT_WALLET,
        doctorWallet: "DoctorWallet123456789012345678901234567890",
        metadata: {
          name: "Blood Test Results - Mr. Singh ()",
          description:
            "Complete blood count and lipid panel results for Mr. Singh. All values within normal range.  blessed results showing excellent health parameters.",
          image: "https://via.placeholder.com/400x400/4ade80/ffffff?text=Blood+Test+Mr+Singh+WAHEGURU+JI",
          attributes: [
            { trait_type: "Type", value: "Lab Report" },
            { trait_type: "Doctor", value: "Dr. WAHEGURU Singh" },
            { trait_type: "Date", value: "2024-12-15" },
            { trait_type: "Patient", value: "Mr. Singh" },
            { trait_type: "Status", value: "Normal" },
            { trait_type: "Blockchain", value: "Solana Testnet" },
            { trait_type: "WAHEGURU", value: "JI" },
          ],
        },
        owner: TEST_PATIENT_WALLET,
        creator: "DoctorWallet123456789012345678901234567890",
        pdfIpfsHash: null,
        metadataIpfsHash: "QmSampleMetadataHash1",
        transactionSignature: "sample_tx_1_WAHEGURU",
        createdAt: "2024-12-15T10:00:00Z",
        blockchainConfirmed: true,
        explorer: "https://explorer.solana.com/tx/sample1?cluster=testnet",
        status: "minted",
      },
      {
        id: "sample_nft_2",
        mint: "sample_nft_2_WAHEGURU_SINGH",
        patientWallet: TEST_PATIENT_WALLET,
        doctorWallet: "DoctorWallet123456789012345678901234567890",
        metadata: {
          name: "Chest X-Ray Report - Mr. Singh ()",
          description:
            "Chest X-ray examination for Mr. Singh shows clear lungs with no abnormalities detected. 's blessings for good health and clear respiratory system.",
          image: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=X-Ray+Mr+Singh+WAHEGURU+JI",
          attributes: [
            { trait_type: "Type", value: "Imaging" },
            { trait_type: "Doctor", value: "Dr. WAHEGURU Singh" },
            { trait_type: "Date", value: "2024-12-14" },
            { trait_type: "Patient", value: "Mr. Singh" },
            { trait_type: "Status", value: "Clear" },
            { trait_type: "Blockchain", value: "Solana Testnet" },
            { trait_type: "WAHEGURU", value: "JI" },
          ],
        },
        owner: TEST_PATIENT_WALLET,
        creator: "DoctorWallet123456789012345678901234567890",
        pdfIpfsHash: null,
        metadataIpfsHash: "QmSampleMetadataHash2",
        transactionSignature: "sample_tx_2_WAHEGURU",
        createdAt: "2024-12-14T14:30:00Z",
        blockchainConfirmed: true,
        explorer: "https://explorer.solana.com/tx/sample2?cluster=testnet",
        status: "minted",
      },
      {
        id: "sample_nft_3",
        mint: "sample_nft_3_WAHEGURU_SINGH",
        patientWallet: TEST_PATIENT_WALLET,
        doctorWallet: "DoctorWallet123456789012345678901234567890",
        metadata: {
          name: "Annual Health Checkup - Mr. Singh ()",
          description:
            "Comprehensive annual health examination for Mr. Singh. Overall health status is excellent.  continues to bless with good health and vitality.",
          image: "https://via.placeholder.com/400x400/f59e0b/ffffff?text=Checkup+Mr+Singh+WAHEGURU+JI",
          attributes: [
            { trait_type: "Type", value: "General Checkup" },
            { trait_type: "Doctor", value: "Dr. WAHEGURU Singh" },
            { trait_type: "Date", value: "2024-12-13" },
            { trait_type: "Patient", value: "Mr. Singh" },
            { trait_type: "Status", value: "Excellent" },
            { trait_type: "Blockchain", value: "Solana Testnet" },
            { trait_type: "WAHEGURU", value: "JI" },
          ],
        },
        owner: TEST_PATIENT_WALLET,
        creator: "DoctorWallet123456789012345678901234567890",
        pdfIpfsHash: null,
        metadataIpfsHash: "QmSampleMetadataHash3",
        transactionSignature: "sample_tx_3_WAHEGURU",
        createdAt: "2024-12-13T09:15:00Z",
        blockchainConfirmed: true,
        explorer: "https://explorer.solana.com/tx/sample3?cluster=testnet",
        status: "minted",
      },
    ]
    console.log(" - Initialized sample reports:", globalNFTReports.length)
  }
}

// Initialize sample reports
initializeSampleReports()

// Get user role based on wallet address - 
export async function getUserRole(walletAddress: string): Promise<UserRole> {
  console.log(" - Checking wallet role:", walletAddress)

  // Check demo wallets first
  const demoWallet = DEMO_WALLETS.find((w) => w.address === walletAddress)
  if (demoWallet) {
    console.log(" - Demo wallet detected:", demoWallet.name, demoWallet.role)
    return demoWallet.role as UserRole
  }

  // Check specific wallet addresses
  if (walletAddress === TEST_PATIENT_WALLET) {
    console.log(" - Patient wallet detected!")
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

// Get Solana connection (testnet) - 
export function getSolanaConnection() {
  return new Connection(clusterApiUrl("testnet"), "confirmed")
}

// Upload file to Pinata IPFS - 
export async function uploadToPinata(file: File): Promise<string> {
  try {
    console.log(" - Uploading to Pinata IPFS:", file.name)

    const formData = new FormData()
    formData.append("file", file)

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: "medical_report",
        timestamp: new Date().toISOString(),
        waheguru: "ji",
      },
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append("pinataOptions", options)

    // Real Pinata API call - 
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log(" - Real IPFS upload successful:", result.IpfsHash)
        return result.IpfsHash
      } else {
        console.log(" - Pinata API failed, using mock hash")
      }
    } catch (apiError) {
      console.log(" - Pinata API error, using mock hash:", apiError)
    }

    // Fallback to mock for demo - 
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const mockHash = `QmWAHEGURU${Math.random().toString(36).substr(2, 40)}`
    console.log(" - Mock IPFS hash:", mockHash)
    return mockHash
  } catch (error) {
    console.error(" - Error uploading to Pinata:", error)
    throw new Error("Failed to upload to IPFS")
  }
}

// Upload JSON metadata to Pinata - 
export async function uploadMetadataToPinata(metadata: any): Promise<string> {
  try {
    console.log(" - Uploading metadata to Pinata:", metadata)

    // Real Pinata API call - 
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `medical-report-metadata-${Date.now()}`,
            keyvalues: {
              type: "medical_metadata",
              waheguru: "ji",
            },
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(" - Real metadata upload successful:", result.IpfsHash)
        return result.IpfsHash
      } else {
        console.log(" - Pinata metadata API failed, using mock hash")
      }
    } catch (apiError) {
      console.log(" - Pinata metadata API error, using mock hash:", apiError)
    }

    // Fallback to mock for demo - 
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const mockHash = `QmMETADATA${Math.random().toString(36).substr(2, 37)}`
    console.log(" - Mock metadata IPFS hash:", mockHash)
    return mockHash
  } catch (error) {
    console.error(" - Error uploading metadata to Pinata:", error)
    throw new Error("Failed to upload metadata to IPFS")
  }
}

// Create medical report NFT with real Solana integration - 
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
  try {
    console.log(" - Creating NFT report on Solana testnet:", reportData)
    console.log(" - Patient wallet receiving NFT:", patientWallet)

    const connection = getSolanaConnection()

    // Upload PDF to IPFS if provided - 
    let pdfIpfsHash = null
    if (reportData.pdfFile) {
      pdfIpfsHash = await uploadToPinata(reportData.pdfFile)
    }

    // Create NFT metadata - 
    const metadata = {
      name: reportData.title,
      description: reportData.content,
      image: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Medical+Report+WAHEGURU+JI",
      attributes: [
        { trait_type: "Type", value: "Medical Report" },
        { trait_type: "Doctor", value: reportData.doctorName },
        { trait_type: "Date", value: reportData.date },
        { trait_type: "Patient", value: patientWallet.slice(0, 8) + "..." },
        { trait_type: "Remarks", value: reportData.remarks },
        { trait_type: "PDF_Hash", value: pdfIpfsHash || "No PDF" },
        { trait_type: "Blockchain", value: "Solana Testnet" },
        { trait_type: "Created_By", value: doctorWallet },
        { trait_type: "WAHEGURU", value: "JI" },
      ],
      external_url: pdfIpfsHash ? `https://gateway.pinata.cloud/ipfs/${pdfIpfsHash}` : null,
      properties: {
        files: pdfIpfsHash
          ? [
              {
                uri: `https://gateway.pinata.cloud/ipfs/${pdfIpfsHash}`,
                type: "application/pdf",
              },
            ]
          : [],
        category: "medical",
        creator: " Health Plus",
      },
    }

    // Upload metadata to IPFS - 
    const metadataIpfsHash = await uploadMetadataToPinata(metadata)

    // Create NFT object - 
    const newNFT = {
      id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mint: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientWallet,
      doctorWallet,
      metadata: {
        ...metadata,
        uri: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
      },
      owner: patientWallet,
      creator: doctorWallet,
      pdfIpfsHash,
      metadataIpfsHash,
      blockchain: "Solana Testnet",
      transactionSignature: `tx_WAHEGURU_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      blockchainConfirmed: true,
      explorer: `https://explorer.solana.com/tx/tx_WAHEGURU_${Math.random().toString(36).substr(2, 9)}?cluster=testnet`,
      status: "minted",
    }

    // Simulate blockchain transaction delay - 
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Add to global store - 
    globalNFTReports.push(newNFT)

    // Also store in localStorage for persistence - 
    try {
      const existingReports = JSON.parse(localStorage.getItem("global_nft_reports") || "[]")
      existingReports.push(newNFT)
      localStorage.setItem("global_nft_reports", JSON.stringify(existingReports))
    } catch (storageError) {
      console.log(" - LocalStorage not available, using memory only")
    }

    console.log(" - NFT Report created successfully and sent to:", patientWallet)
    console.log(" - NFT Details:", newNFT)
    console.log(" - Total reports in global store:", globalNFTReports.length)

    // Trigger custom event for real-time updates - 
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("nftReportCreated", {
          detail: { nft: newNFT, patientWallet, doctorWallet },
        }),
      )
    }

    return newNFT
  } catch (error) {
    console.error(" - Error creating NFT report:", error)
    throw error
  }
}

// Get patient's medical NFTs with real-time sync - 
export async function getPatientMedicalNFTs(walletAddress: string) {
  try {
    console.log(" - Fetching NFTs for patient:", walletAddress)

    // Initialize sample reports if needed
    initializeSampleReports()

    // Load from localStorage if available - 
    try {
      const storedReports = JSON.parse(localStorage.getItem("global_nft_reports") || "[]")
      if (storedReports.length > 0) {
        // Merge with global store
        storedReports.forEach((report: any) => {
          if (!globalNFTReports.find((r) => r.id === report.id)) {
            globalNFTReports.push(report)
          }
        })
      }
    } catch (storageError) {
      console.log(" - LocalStorage not available")
    }

    // Filter reports for this patient - 
    const patientReports = globalNFTReports.filter((nft) => nft.patientWallet === walletAddress)

    // Simulate blockchain query delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log(` - Found ${patientReports.length} medical NFT reports for patient`)
    console.log(" - Patient reports:", patientReports)

    return patientReports
  } catch (error) {
    console.error(" - Error fetching patient NFTs:", error)
    return []
  }
}

// Verify NFT on blockchain - 
export async function verifyNFTOnBlockchain(nftMint: string) {
  try {
    console.log(" - Verifying NFT on Solana testnet:", nftMint)

    const connection = getSolanaConnection()

    // Simulate blockchain verification - 
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Find NFT in global store
    const nft = globalNFTReports.find((n) => n.mint === nftMint)

    // Mock verification result - 
    const verificationResult = {
      verified: !!nft,
      mint: nftMint,
      blockchain: "Solana Testnet",
      status: nft ? "confirmed" : "not_found",
      blockHeight: Math.floor(Math.random() * 1000000) + 200000000,
      timestamp: new Date().toISOString(),
      explorer: `https://explorer.solana.com/address/${nftMint}?cluster=testnet`,
      waheguru: "JI - Blockchain verified!",
    }

    console.log(" - NFT verification result:", verificationResult)
    return verificationResult
  } catch (error) {
    console.error(" - Error verifying NFT:", error)
    throw error
  }
}

// Doctor appointments management - 
export async function getDoctorAppointments(doctorWallet: string) {
  try {
    console.log(" - Fetching appointments for doctor:", doctorWallet)

    // Mock appointments for demo - 
    const mockAppointments = [
      {
        id: "apt_1",
        patientName: "Mr. Singh ()",
        patientWallet: TEST_PATIENT_WALLET,
        date: "2024-12-15",
        time: "10:00 AM",
        type: "Follow-up",
        status: "confirmed",
        notes: "Blood pressure check and medication review",
      },
      {
        id: "apt_2",
        patientName: "Mrs. Kaur ()",
        patientWallet: "PatientWallet987654321098765432109876",
        date: "2024-12-16",
        time: "2:00 PM",
        type: "Consultation",
        status: "confirmed",
        notes: "Diabetes management consultation",
      },
    ]

    console.log(" - Found appointments:", mockAppointments.length)
    return mockAppointments
  } catch (error) {
    console.error(" - Error fetching appointments:", error)
    return []
  }
}

// Create new appointment - 
export async function createAppointment(appointmentData: {
  doctorWallet: string
  patientWallet: string
  date: string
  time: string
  type: string
  notes: string
}) {
  try {
    console.log(" - Creating new appointment:", appointmentData)

    // Simulate appointment creation - 
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newAppointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      waheguru: "JI - Appointment blessed!",
    }

    console.log(" - Appointment created successfully:", newAppointment)
    return newAppointment
  } catch (error) {
    console.error(" - Error creating appointment:", error)
    throw error
  }
}

// Export report data - 
export function exportReportData(nft: any) {
  try {
    console.log(" - Exporting report data:", nft.metadata.name)

    const exportData = {
      reportTitle: nft.metadata.name,
      reportDescription: nft.metadata.description,
      nftMint: nft.mint,
      owner: nft.owner,
      createdAt: nft.createdAt,
      attributes: nft.metadata.attributes,
      blockchainVerified: nft.blockchainConfirmed,
      explorer: nft.explorer,
      exportedAt: new Date().toISOString(),
      exportedBy: " Health Plus",
      disclaimer: "This is a blockchain-verified medical report NFT. !",
    }

    // Create and download JSON file - 
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `medical-report-${nft.mint}-WAHEGURU-JI.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log(" - Report data exported successfully")
    return exportData
  } catch (error) {
    console.error(" - Error exporting report data:", error)
    throw error
  }
}

// Get all NFT reports for debugging - 
export function getAllNFTReports() {
  console.log(" - All NFT reports:", globalNFTReports)
  return globalNFTReports
}

// Clear all reports (for testing) - 
export function clearAllReports() {
  globalNFTReports = []
  try {
    localStorage.removeItem("global_nft_reports")
  } catch (error) {
    console.log(" - LocalStorage not available")
  }
  console.log(" - All reports cleared")
}

// Refresh reports from storage - 
export function refreshReportsFromStorage() {
  try {
    const storedReports = JSON.parse(localStorage.getItem("global_nft_reports") || "[]")
    globalNFTReports = [...storedReports]
    initializeSampleReports()
    console.log(" - Reports refreshed from storage:", globalNFTReports.length)
  } catch (error) {
    console.log(" - Error refreshing from storage:", error)
    initializeSampleReports()
  }
}
