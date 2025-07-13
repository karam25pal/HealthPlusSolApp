"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Share, Eye, Calendar, User, ExternalLink, Wallet } from "lucide-react"
import { getPatientMedicalNFTs, NotificationService, PATIENT_WALLET } from "@/lib/solana"

interface PatientNFTReportsProps {
  walletAddress: string
}

export function PatientNFTReports({ walletAddress }: PatientNFTReportsProps) {
  const [nftReports, setNftReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNFTReports()
  }, [walletAddress])

  // Real-time updates for new NFT reports
  useEffect(() => {
    const handleNewReport = (data: any) => {
      if (data.patientWallet === walletAddress) {
        console.log("WAHEGURU JI - New NFT report received:", data.report)
        loadNFTReports() // Refresh the reports
      }
    }

    NotificationService.subscribe("nft_report_created", handleNewReport)

    return () => {
      NotificationService.unsubscribe("nft_report_created", handleNewReport)
    }
  }, [walletAddress])

  const loadNFTReports = async () => {
    setIsLoading(true)
    try {
      const reports = await getPatientMedicalNFTs(walletAddress)
      setNftReports(reports)
      console.log("WAHEGURU JI - NFT reports loaded:", reports)
    } catch (error) {
      console.error("Error loading NFT reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case "Lab Report":
        return "bg-green-100 text-green-800"
      case "Imaging":
        return "bg-blue-100 text-blue-800"
      case "Prescription":
        return "bg-purple-100 text-purple-800"
      case "Medical Report":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownloadReport = (report: any) => {
    // In a real implementation, this would download from IPFS
    console.log("WAHEGURU JI - Downloading report:", report.metadata.name)
    alert(`WAHEGURU JI! Downloading ${report.metadata.name}...`)
  }

  const handleShareReport = (report: any) => {
    // In a real implementation, this would create a shareable link
    const shareData = {
      title: report.metadata.name,
      text: `Medical Report: ${report.metadata.name}`,
      url: `https://solscan.io/token/${report.mint}?cluster=devnet`,
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert("WAHEGURU JI! Report link copied to clipboard!")
    }
  }

  const handleViewOnBlockchain = (report: any) => {
    // Open Solscan to view the NFT on blockchain
    window.open(`https://solscan.io/token/${report.mint}?cluster=devnet`, "_blank")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            NFT Medical Reports - WAHEGURU JI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading your NFT reports...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            NFT Medical Reports - WAHEGURU JI
            <Badge variant="outline" className="ml-auto">
              {nftReports.length} Reports
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">Secure medical reports stored as NFTs on Solana blockchain</p>
          {walletAddress === PATIENT_WALLET && (
            <div className="bg-green-50 p-2 rounded-lg">
              <p className="text-xs text-green-800">✓ Connected as verified patient - Real-time updates enabled</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {nftReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No NFT reports found</p>
              <p className="text-sm text-gray-500">Your doctors will send reports directly to your wallet</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>WAHEGURU JI:</strong> When doctors create medical reports, they will appear here as verified
                  NFTs on the Solana blockchain.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {nftReports.map((report, index) => (
                <div
                  key={report.mint || index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-sm"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{report.metadata.name}</h3>
                        <Badge
                          className={getStatusColor(
                            report.metadata.attributes.find((attr: any) => attr.trait_type === "Type")?.value ||
                              "General",
                          )}
                        >
                          {report.metadata.attributes.find((attr: any) => attr.trait_type === "Type")?.value ||
                            "General"}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          Verified NFT
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.metadata.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {report.metadata.attributes.find((attr: any) => attr.trait_type === "Doctor")?.value}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.metadata.attributes.find((attr: any) => attr.trait_type === "Date")?.value}
                        </div>
                        <div className="flex items-center gap-1">
                          <Wallet className="h-3 w-3" />
                          Solana NFT
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewOnBlockchain(report)
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Blockchain
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  {selectedReport.metadata.name} - WAHEGURU JI
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedReport.metadata.image || "/placeholder.svg"}
                    alt={selectedReport.metadata.name}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{selectedReport.metadata.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedReport.metadata.attributes.map((attr: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <span className="font-medium text-gray-700">{attr.trait_type}:</span>
                          <span className="ml-2 text-gray-600">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Doctor's Remarks Section */}
                {selectedReport.metadata.attributes.find((attr: any) => attr.trait_type === "Remarks") && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">Doctor's Remarks - WAHEGURU JI</h4>
                    <p className="text-sm text-blue-800">
                      {selectedReport.metadata.attributes.find((attr: any) => attr.trait_type === "Remarks")?.value}
                    </p>
                  </div>
                )}

                {/* NFT Blockchain Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">NFT Blockchain Details - WAHEGURU JI</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Mint Address:</span>
                      <span className="font-mono text-xs bg-white px-2 py-1 rounded">{selectedReport.mint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Blockchain:</span>
                      <Badge variant="outline" className="text-xs">
                        Solana Devnet
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        ✓ Verified & Immutable
                      </Badge>
                    </div>
                    {selectedReport.contractAddress && (
                      <div className="flex justify-between">
                        <span className="font-medium">Contract:</span>
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                          {selectedReport.contractAddress}
                        </span>
                      </div>
                    )}
                    {selectedReport.transactionHash && (
                      <div className="flex justify-between">
                        <span className="font-medium">Transaction:</span>
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                          {selectedReport.transactionHash}
                        </span>
                      </div>
                    )}
                    {selectedReport.ipfsHash && (
                      <div className="flex justify-between">
                        <span className="font-medium">IPFS Hash:</span>
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded">{selectedReport.ipfsHash}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => handleDownloadReport(selectedReport)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={() => handleShareReport(selectedReport)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={() => handleViewOnBlockchain(selectedReport)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Blockchain
                  </Button>
                </div>

                {/* WAHEGURU JI Message */}
                <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>WAHEGURU JI:</strong> This medical report is permanently stored on the Solana blockchain as
                    an NFT, ensuring it cannot be tampered with or lost. Your health data is secure and verifiable
                    forever.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
