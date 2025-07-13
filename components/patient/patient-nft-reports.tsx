"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, ExternalLink, Download, Eye, Heart, Activity, CheckCircle, Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  getPatientMedicalNFTs,
  verifyNFTOnBlockchain,
  NotificationService,
  getSolanaExplorerUrl,
  checkIPFSFileAccess,
} from "@/lib/solana"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PatientNFTReportsProps {
  walletAddress: string
}

export function PatientNFTReports({ walletAddress }: PatientNFTReportsProps) {
  const [nftReports, setNftReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [fileAccessStatus, setFileAccessStatus] = useState<{ [key: string]: boolean }>({})
  const [loadingIpfs, setLoadingIpfs] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (walletAddress) {
      loadNFTReports()
    } else {
      setNftReports([])
      setIsLoading(false)
    }
  }, [walletAddress])

  // Set up real-time notifications for new NFT reports
  useEffect(() => {
    const handleNewReport = (data: any) => {
      if (data.patientWallet === walletAddress) {
        console.log(" - New NFT report received:", data)
        loadNFTReports()
        toast({
          title: "New Medical Report Received! 🎉",
          description: `You have received a new medical NFT report: ${data.report.metadata.name}`,
        })
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
      console.log(" - Loading NFT reports for patient:", walletAddress)
      // This function attempts to fetch real NFTs from Solana blockchain first
      const nftData = await getPatientMedicalNFTs(walletAddress)
      setNftReports(nftData)

      const accessStatus: { [key: string]: boolean } = {}
      for (const report of nftData) {
        if (report.ipfsHash) {
          // This function checks real IPFS file accessibility
          accessStatus[report.id] = await checkIPFSFileAccess(report.ipfsHash)
        }
      }
      setFileAccessStatus(accessStatus)

      console.log(" - NFT reports loaded successfully")
    } catch (error) {
      console.error(" - Error loading NFT reports:", error)
      toast({
        title: "Error Loading Reports",
        description: "Failed to load medical NFT reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyNFT = async (mintAddress: string) => {
    try {
      setIsVerifying(true)
      // This function attempts real blockchain verification
      const isValid = await verifyNFTOnBlockchain(mintAddress)

      toast({
        title: isValid ? "NFT Verified Successfully ✅" : "NFT Verification Failed ❌",
        description: isValid
          ? "This medical report NFT is authentic and verified on Solana blockchain."
          : "This NFT could not be verified on the blockchain.",
        variant: isValid ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify NFT on blockchain.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully.`,
    })
  }

  const downloadReportData = (report: any) => {
    const reportData = {
      title: report.metadata.name,
      description: report.metadata.description,
      attributes: report.metadata.attributes,
      mintAddress: report.mint,
      transactionSignature: report.transactionSignature,
      createdAt: report.createdAt,
      ipfsHash: report.ipfsHash,
      metadataHash: report.metadataHash,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medical-report-${report.mint}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: "Medical report data has been downloaded as JSON file.",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      confirmed: { color: "bg-green-500", text: "Confirmed" },
      rejected: { color: "bg-red-500", text: "Rejected" },
      minted: { color: "bg-blue-500", text: "Minted" },
      transferred: { color: "bg-purple-500", text: "Received" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-500",
      text: status,
    }

    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const getReportTypeIcon = (reportType: string) => {
    switch (reportType.toLowerCase()) {
      case "lab report":
        return <Activity className="h-4 w-4" />
      case "radiology report":
        return <Eye className="h-4 w-4" />
      case "follow-up report":
        return <Heart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleViewIPFSFile = async (report: any) => {
    if (!report.ipfsHash) {
      toast({
        title: "No IPFS File",
        description: "! No IPFS file available.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoadingIpfs((prev) => ({ ...prev, [report.id]: true }))
      // This function checks real IPFS file accessibility
      const isAccessible = await checkIPFSFileAccess(report.ipfsHash)

      if (isAccessible) {
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${report.ipfsHash}`
        window.open(ipfsUrl, "_blank")
      } else {
        toast({
          title: "File Unavailable",
          description: "! File is not accessible on IPFS network. Please contact your doctor.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(" - Error checking file access:", error)
      toast({
        title: "Access Error",
        description: "! Error accessing file.",
        variant: "destructive",
      })
    } finally {
      setLoadingIpfs((prev) => ({ ...prev, [report.id]: false }))
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Medical NFT Reports
          </CardTitle>
          <CardDescription>Secure, blockchain-verified medical reports stored as NFTs on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Medical Reports...</h3>
            <p className="text-gray-600">Please wait while we fetch your blockchain-secured health records.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!walletAddress) {
    return (
      <Card className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Medical NFT Reports
          </CardTitle>
          <CardDescription>Secure, blockchain-verified medical reports stored as NFTs on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Not Connected</h3>
            <p className="text-gray-600">Connect your Solana wallet to view your medical NFT reports.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div id="nft-reports-section">
      {" "}
      {/* Added ID for scrolling */}
      <Card className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Medical NFT Reports
          </CardTitle>
          <CardDescription>Secure, blockchain-verified medical reports stored as NFTs on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          {nftReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Reports Yet</h3>
              <p className="text-gray-600">Your medical NFT reports will appear here once created by your doctor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Report Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getReportTypeIcon(
                            report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value || "Report",
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{report.metadata.name}</h3>
                            <p className="text-sm text-gray-600">
                              {report.metadata.attributes.find((a: any) => a.trait_type === "Date")?.value}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>

                      {/* Report Details */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 line-clamp-3">{report.metadata.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Dr. {report.metadata.attributes.find((a: any) => a.trait_type === "Doctor")?.value}
                          </span>
                          <span>{report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value}</span>
                        </div>
                      </div>

                      {/* Blockchain Info */}
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">NFT Mint:</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono">{report.mint?.slice(0, 8)}...</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(report.mint, "NFT Mint Address")}
                              className="h-4 w-4 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {report.transactionSignature && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">Transaction:</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-mono">{report.transactionSignature.slice(0, 8)}...</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(report.transactionSignature, "Transaction Signature")}
                                className="h-4 w-4 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Export and View Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will download the report's data as a JSON file before showing the full details. Do
                                you want to continue?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  downloadReportData(report)
                                  setSelectedReport(report)
                                }}
                              >
                                Export & View
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyNFT(report.mint)}
                          disabled={isVerifying}
                          className="flex-1"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReportData(report)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>

                      {/* Explorer Link */}
                      {report.explorer && (
                        <Button size="sm" variant="link" asChild className="w-full p-0 h-auto">
                          <a href={report.explorer} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Solana Explorer
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Selected Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {selectedReport.metadata?.name || selectedReport.name || "Medical Report"}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedReport(null)} className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Content */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Medical Report Content</h3>
                <div className="whitespace-pre-wrap text-sm text-gray-700">{selectedReport.metadata.description}</div>
              </div>

              {/* Report Attributes */}
              <div>
                <h3 className="font-semibold mb-3">Report Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.metadata.attributes.map((attr: any, index: number) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium text-sm">{attr.trait_type}:</span>
                      <span className="text-sm text-gray-700">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockchain Information */}
              <div>
                <h3 className="font-semibold mb-3">Blockchain Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">NFT Mint Address:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{selectedReport.mint}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedReport.mint, "NFT Mint Address")}
                        className="h-4 w-4 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Transaction Signature:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{selectedReport.transactionSignature}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedReport.transactionSignature, "Transaction Signature")}
                        className="h-4 w-4 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(selectedReport.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedReport.status)}
                      {selectedReport.blockchainConfirmed && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Blockchain Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Information */}
              <div>
                <h3 className="font-semibold mb-2">File Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">IPFS Hash:</span>
                    <span className="text-right font-mono text-xs">
                      {selectedReport.ipfsHash || "No file attached"}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">File Available:</span>
                    <span className="text-right">{fileAccessStatus[selectedReport.id] ? "✅ Yes" : "❌ No"}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">Gateway:</span>
                    <span className="text-right">{selectedReport.gateway || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button onClick={() => handleVerifyNFT(selectedReport.mint)} disabled={isVerifying} className="flex-1">
                  {isVerifying ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify on Blockchain
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => downloadReportData(selectedReport)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleViewIPFSFile(selectedReport)}
                  disabled={loadingIpfs[selectedReport.id] || !fileAccessStatus[selectedReport.id]}
                  className="flex-1"
                >
                  {loadingIpfs[selectedReport.id] ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Loading File...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View IPFS File
                    </>
                  )}
                </Button>
                {selectedReport.explorer && (
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <a
                      href={getSolanaExplorerUrl(
                        selectedReport.solanaTransaction || selectedReport.transactionSignature,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
