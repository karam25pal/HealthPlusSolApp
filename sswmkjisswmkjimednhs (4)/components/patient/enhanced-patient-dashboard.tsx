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
  patientName: string
}

export function EnhancedPatientDashboard({ walletAddress, patientName }: PatientDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [nftReports, setNftReports] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [patientInfo, setPatientInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {patientName}!</h1>
              <p className="text-gray-600 mt-1">Your Secure Medical Records on Blockchain</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Blockchain Secured
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                NFT Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        {patientInfo && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-16 w-16 ring-4 ring-blue-200">
                  <AvatarImage src={patientInfo.avatar || "/placeholder.svg"} alt={patientInfo.name} />
                  <AvatarFallback className="text-lg">{patientInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{patientInfo.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Age: {patientInfo.age} years
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {patientInfo.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {patientInfo.email}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Primary Condition: {patientInfo.condition}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                    </span>
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
            </CardContent>
          </Card>
        )}

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
                <Shield className="h-8 w-8 text-purple-600" />
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nft-reports">Medical NFT Reports</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent NFT Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Medical Reports
                  </CardTitle>
                  <CardDescription>Your latest blockchain-verified medical NFT reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nftReports.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getReportTypeIcon(
                              report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value || "Report",
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{report.metadata.name}</p>
                            <p className="text-sm text-gray-600">
                              Dr. {report.metadata.attributes.find((a: any) => a.trait_type === "Doctor")?.value}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(report.status)}
                          <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                    {nftReports.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No medical reports yet</p>
                        <p className="text-sm">Your NFT medical reports will appear here</p>
                      </div>
                    )}
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
                  <CardDescription>Your scheduled medical appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </p>
                            {appointment.notes && <p className="text-xs text-gray-500">{appointment.notes}</p>}
                          </div>
                        </div>
                        <div className="text-right">{getStatusBadge(appointment.status)}</div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No appointments scheduled</p>
                        <p className="text-sm">Your appointments will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Summary */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Heart className="h-5 w-5 mr-2" />
                  Health Summary - 's Blessings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                    <p className="text-sm text-gray-600">Overall Health Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{nftReports.length}</div>
                    <p className="text-sm text-gray-600">Medical Records Secured</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                    <p className="text-sm text-gray-600">Blockchain Verified</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    All your medical records are securely stored as NFTs on the Solana blockchain, ensuring permanent
                    access and verification.  protects your health data! 🙏
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Reports Tab */}
          <TabsContent value="nft-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Medical NFT Reports
                </CardTitle>
                <CardDescription>Blockchain-verified medical reports that you own permanently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getReportTypeIcon(
                                report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value || "Report",
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{report.metadata.name}</h3>
                              <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>

                        <div className="space-y-2 text-xs text-gray-600 mb-4">
                          <div className="flex justify-between">
                            <span>Doctor:</span>
                            <span className="font-medium">
                              {report.metadata.attributes.find((a: any) => a.trait_type === "Doctor")?.value}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium">
                              {report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>NFT Mint:</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-mono">{report.mint.slice(0, 6)}...</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(report.mint, "NFT Mint Address")}
                                className="h-3 w-3 p-0"
                              >
                                <Copy className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                            className="w-full"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <div className="flex space-x-2">
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
                          {report.explorer && (
                            <Button size="sm" variant="outline" asChild className="w-full bg-transparent">
                              <a href={report.explorer} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on Blockchain
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {nftReports.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Reports Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Your blockchain-verified medical NFT reports will appear here when doctors create them for you.
                    </p>
                    <Alert className="max-w-md mx-auto">
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        Medical reports are automatically sent to your wallet as NFTs when created by your healthcare
                        providers.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Your Appointments
                </CardTitle>
                <CardDescription>Manage your medical appointments and consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.type}</h3>
                              <p className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </p>
                              {appointment.notes && <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>}
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

                  {appointments.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Scheduled</h3>
                      <p className="text-gray-600">
                        Your medical appointments will appear here when scheduled by your healthcare providers.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {selectedReport.metadata.name}
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

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleVerifyNFT(selectedReport.mint)}
                    disabled={isVerifying}
                    className="flex-1"
                  >
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
                  {selectedReport.explorer && (
                    <Button variant="outline" asChild className="flex-1 bg-transparent">
                      <a href={selectedReport.explorer} target="_blank" rel="noopener noreferrer">
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
    </div>
  )
}
