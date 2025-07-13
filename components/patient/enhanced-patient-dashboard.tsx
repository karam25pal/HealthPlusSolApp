"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Calendar,
  Shield,
  ExternalLink,
  Download,
  Eye,
  Heart,
  Activity,
  Clock,
  CheckCircle,
  Copy,
  Sparkles,
  User,
  Phone,
  Mail,
  LogOut,
  MapPin,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  getPatientMedicalNFTs,
  getPatientAppointments,
  getPatientByWallet,
  verifyNFTOnBlockchain,
  NotificationService,
} from "@/lib/solana"

interface PatientDashboardProps {
  walletAddress: string
  patientName?: string
  onLogout?: () => void
}

export function EnhancedPatientDashboard({
  walletAddress,
  patientName = "Mr. Singh",
  onLogout,
}: PatientDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [nftReports, setNftReports] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [patientInfo, setPatientInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const getInitials = (name = "") => {
    const prefixes = ["Dr.", "Mr.", "Mrs.", "Ms."]
    let cleanName = name
    for (const prefix of prefixes) {
      if (cleanName.startsWith(prefix)) {
        cleanName = cleanName.substring(prefix.length).trim()
        break
      }
    }
    const names = cleanName.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    if (names.length === 1 && names[0].length > 1) {
      return `${names[0][0]}${names[0][1]}`.toUpperCase()
    }
    return (names[0]?.[0] || "").toUpperCase()
  }

  const createGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  const nearbyDoctors = [
    {
      id: 1,
      name: "Dr. Emily Carter",
      specialty: "Cardiologist",
      address: "123 Heartbeat Ave, Healthville, CA 90210",
      distance: 2.5,
    },
    {
      id: 2,
      name: "Dr. Benjamin Lee",
      specialty: "Pediatrician",
      address: "456 Wellness Way, Meditown, CA 90211",
      distance: 4.1,
    },
    {
      id: 3,
      name: " Clinic",
      specialty: "General Practice",
      address: "789 Faith Rd, Spirit City, CA 90212",
      distance: 8.3,
    },
  ]

  // Load initial data
  useEffect(() => {
    loadPatientData()
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

  const loadPatientData = async () => {
    try {
      setIsLoading(true)
      console.log(" - Loading patient data for:", walletAddress)

      const [nftData, appointmentsData, patientData] = await Promise.all([
        getPatientMedicalNFTs(walletAddress),
        getPatientAppointments(walletAddress),
        getPatientByWallet(walletAddress),
      ])

      setNftReports(nftData)
      setAppointments(appointmentsData)
      setPatientInfo(patientData)

      console.log(" - Patient data loaded successfully")
    } catch (error) {
      console.error(" - Error loading patient data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load patient data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadNFTReports = async () => {
    try {
      const nftData = await getPatientMedicalNFTs(walletAddress)
      setNftReports(nftData)
    } catch (error) {
      console.error("Error loading NFT reports:", error)
    }
  }

  const handleVerifyNFT = async (mintAddress: string) => {
    try {
      setIsVerifying(true)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your medical records... </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={patientInfo?.avatar || "/patient-avatar.png"} alt={patientName} />
                <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {patientName}</h1>
                <p className="text-gray-600 mt-1">WAHEGURU Health System - Your Medical Records</p>
                <p className="text-sm text-gray-500">
                  Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Blockchain Secured
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                NFT Protected
              </Badge>
              {onLogout && (
                <Button variant="outline" onClick={onLogout} className="flex items-center gap-2 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medical NFTs</p>
                  <p className="text-2xl font-bold text-gray-900">{nftReports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nftReports.filter((r) => r.blockchainConfirmed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nft-reports">NFT Medical Reports</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Medical Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nftReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getReportTypeIcon(
                            report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value || "Report",
                          )}
                          <div>
                            <p className="font-medium">{report.metadata.name}</p>
                            <p className="text-sm text-gray-600">
                              {report.metadata.attributes.find((a: any) => a.trait_type === "Date")?.value}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(report.status)}
                          <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments
                      .filter((apt) => apt.status === "confirmed")
                      .slice(0, 3)
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium">{appointment.type}</p>
                              <p className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Health Summary - 's Blessings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Overall Health</h3>
                    <p className="text-sm text-green-600">Excellent condition</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800">Records Security</h3>
                    <p className="text-sm text-blue-600">Blockchain protected</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-800">NFT Reports</h3>
                    <p className="text-sm text-purple-600">Permanently stored</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Reports Tab */}
          <TabsContent value="nft-reports" className="space-y-6">
            <Card>
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
                    <p className="text-gray-600">
                      Your medical NFT reports will appear here once created by your doctor.
                    </p>
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
                                  report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value ||
                                    "Report",
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
                                <span>
                                  {report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value}
                                </span>
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
                                      onClick={() =>
                                        copyToClipboard(report.transactionSignature, "Transaction Signature")
                                      }
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReport(report)}
                                className="flex-1"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
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
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Report Details
                    </CardTitle>
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Report Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Title:</span>
                            <span className="text-right">{selectedReport.metadata.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Type:</span>
                            <span className="text-right">
                              {selectedReport.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Date:</span>
                            <span className="text-right">
                              {selectedReport.metadata.attributes.find((a: any) => a.trait_type === "Date")?.value}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Doctor:</span>
                            <span className="text-right">
                              {selectedReport.metadata.attributes.find((a: any) => a.trait_type === "Doctor")?.value}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Status:</span>
                            <span className="text-right">
                              {selectedReport.metadata.attributes.find((a: any) => a.trait_type === "Status")?.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Medical Content</h3>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedReport.metadata.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Blockchain Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">NFT Mint:</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-right font-mono text-xs">{selectedReport.mint}</span>
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
                          <div className="flex justify-between">
                            <span className="font-medium">Network:</span>
                            <span className="text-right">Solana Devnet</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Created:</span>
                            <span className="text-right">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Verified:</span>
                            <span className="text-right">
                              {selectedReport.blockchainConfirmed ? "✅ Yes" : "❌ No"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">File Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">IPFS Hash:</span>
                            <span className="text-right font-mono text-xs">
                              {selectedReport.ipfsHash || "No file attached"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">File Available:</span>
                            <span className="text-right">{selectedReport.fileAccessible ? "✅ Yes" : "❌ No"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Gateway:</span>
                            <span className="text-right">{selectedReport.gateway || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyNFT(selectedReport.mint)}
                          disabled={isVerifying}
                          className="flex-1"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verify NFT
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReportData(selectedReport)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Your Appointments
                </CardTitle>
                <CardDescription>View and manage your medical appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Scheduled</h3>
                    <p className="text-gray-600">Your upcoming appointments will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-blue-100 rounded-full">
                                <Calendar className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                                <p className="text-sm text-gray-600">
                                  {appointment.date} at {appointment.time}
                                </p>
                                <p className="text-sm text-gray-500">{appointment.notes}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(appointment.status)}
                              <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(appointment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Profile
                </CardTitle>
                <CardDescription>Your personal information and health details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={patientInfo?.avatar || "/patient-avatar.png"} alt={patientName} />
                        <AvatarFallback className="text-2xl">{patientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{patientName}</h2>
                        <p className="text-gray-600">Patient ID: {patientInfo?.id || "N/A"}</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">Active Patient</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Age</p>
                            <p className="text-sm text-gray-600">{patientInfo?.age || "N/A"} years old</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Phone</p>
                            <p className="text-sm text-gray-600">{patientInfo?.phone || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-sm text-gray-600">{patientInfo?.email || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Medical Information</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Primary Condition</p>
                          <p className="text-sm text-gray-600">{patientInfo?.condition || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Wallet Address</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600 font-mono">{walletAddress}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(walletAddress, "Wallet Address")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Blockchain Security</h3>
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Your medical records are secured on the Solana blockchain as NFTs. This ensures permanent,
                          tamper-proof storage of your health information.  protects your data! 🙏
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Find a Doctor Tab */}
          <TabsContent value="find-doctor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Nearby Doctors & Clinics
                </CardTitle>
                <CardDescription>Find healthcare providers near you. Distances are approximate.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg bg-blue-100 text-blue-700 font-bold">
                            {getInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                        </div>
                      </div>
                      <a
                        href={createGoogleMapsUrl(doctor.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center p-2 rounded-md hover:bg-blue-50"
                      >
                        <div className="text-lg font-bold text-blue-600">{doctor.distance} mi</div>
                        <div className="text-xs text-blue-500 hover:underline">View on Map</div>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
