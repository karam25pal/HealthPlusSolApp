"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Shield,
  ExternalLink,
  Download,
  Eye,
  Heart,
  Activity,
  CheckCircle,
  Copy,
  Sparkles,
  User,
  Phone,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Share2,
  Verified,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  getPatientMedicalNFTs,
  verifyNFTOnBlockchain,
  exportReportData,
  TEST_PATIENT_WALLET,
  getAllNFTReports,
  refreshReportsFromStorage,
} from "@/lib/solana"

interface PatientNFTReportsProps {
  walletAddress: string
  onLogout: () => void
}

export function PatientNFTReports({ walletAddress, onLogout }: PatientNFTReportsProps) {
  // State management
  const [activeTab, setActiveTab] = useState("all")
  const [nftReports, setNftReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Load patient's NFTs
  useEffect(() => {
    loadPatientNFTs()
  }, [walletAddress])

  // Set up real-time updates - WAHEGURU JI
  useEffect(() => {
    const handleNewReport = (event: any) => {
      console.log("WAHEGURU JI - New report event received:", event.detail)
      if (event.detail.patientWallet === walletAddress) {
        toast({
          title: "New Medical Report Received! 🎉 WAHEGURU JI",
          description: `You have received a new medical NFT report: ${event.detail.nft.metadata.name}`,
        })
        // Reload reports
        loadPatientNFTs()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("nftReportCreated", handleNewReport)
      return () => window.removeEventListener("nftReportCreated", handleNewReport)
    }
  }, [walletAddress])

  // Auto-refresh every 10 seconds - WAHEGURU JI
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("WAHEGURU JI - Auto-refreshing reports...")
      loadPatientNFTs()
    }, 10000)

    return () => clearInterval(interval)
  }, [walletAddress])

  const loadPatientNFTs = async () => {
    try {
      setIsLoading(true)
      console.log("WAHEGURU JI - Loading NFTs for patient:", walletAddress)

      // Refresh from storage first
      refreshReportsFromStorage()

      const patientNFTs = await getPatientMedicalNFTs(walletAddress)
      setNftReports(patientNFTs)
      setLastRefresh(new Date())

      console.log("WAHEGURU JI - Loaded NFTs:", patientNFTs.length)
      console.log("WAHEGURU JI - NFT Details:", patientNFTs)

      // Debug: Show all reports
      const allReports = getAllNFTReports()
      console.log("WAHEGURU JI - All reports in system:", allReports.length)
    } catch (error) {
      console.error("WAHEGURU JI - Error loading NFTs:", error)
      toast({
        title: "Error Loading Reports",
        description: "Failed to load medical reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    toast({
      title: "Refreshing Reports - WAHEGURU JI",
      description: "Checking for new medical reports...",
    })
    loadPatientNFTs()
  }

  const handleViewDetails = (nft: any) => {
    setSelectedReport(nft)
    setDetailsOpen(true)
    setVerificationResult(null)
  }

  const handleVerifyNFT = async () => {
    if (!selectedReport) return

    setIsVerifying(true)
    try {
      const result = await verifyNFTOnBlockchain(selectedReport.mint)
      setVerificationResult(result)
      toast({
        title: result.verified ? "NFT Verified Successfully ✅" : "NFT Verification Failed ❌",
        description: result.verified
          ? "This medical report NFT is authentic and verified on Solana blockchain."
          : "This NFT could not be verified on the blockchain.",
        variant: result.verified ? "default" : "destructive",
      })
    } catch (error) {
      console.error("WAHEGURU JI - Error verifying NFT:", error)
      toast({
        title: "Verification Error",
        description: "Failed to verify NFT on blockchain.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleExportReport = (nft: any) => {
    try {
      exportReportData(nft)
      toast({
        title: "Report Exported - WAHEGURU JI",
        description: "Medical report data has been downloaded as JSON file.",
      })
    } catch (error) {
      console.error("WAHEGURU JI - Error exporting report:", error)
      toast({
        title: "Export Error",
        description: "Failed to export report data.",
        variant: "destructive",
      })
    }
  }

  const handleShareReport = (nft: any) => {
    if (navigator.share) {
      navigator.share({
        title: nft.metadata.name,
        text: `Medical Report: ${nft.metadata.name} - WAHEGURU JI`,
        url: nft.explorer || window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(nft.explorer || window.location.href)
      toast({
        title: "Link Copied - WAHEGURU JI",
        description: "Report link copied to clipboard!",
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully.`,
    })
  }

  const filteredNFTs = nftReports.filter((nft) => {
    const matchesSearch =
      nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "recent") {
      const nftDate = new Date(nft.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return matchesSearch && nftDate > weekAgo
    }
    if (activeTab === "verified") return matchesSearch && nft.blockchainConfirmed

    return matchesSearch
  })

  const getReportTypeIcon = (attributes: any[]) => {
    const typeAttr = attributes.find((attr) => attr.trait_type === "Type")
    const type = typeAttr?.value || "General"

    switch (type) {
      case "Lab Report":
        return <Activity className="h-5 w-5 text-red-600" />
      case "Imaging":
        return <Eye className="h-5 w-5 text-blue-600" />
      case "General Checkup":
        return <Heart className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
      case "Clear":
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Attention":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isTestWallet = walletAddress === TEST_PATIENT_WALLET

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Health Plus
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  Patient Portal
                </Badge>
              </div>
            </div>

            {/* Patient Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-green-50 transition-all duration-200 hover:scale-105"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-green-100">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>{isTestWallet ? "MS" : "PT"}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="font-medium text-sm block">{isTestWallet ? "Mr. Singh" : "Patient"}</span>
                    <span className="text-xs text-gray-500">{isTestWallet ? "Test Account" : "Patient"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{isTestWallet ? "Mr. Singh (WAHEGURU JI)" : "Patient"}</p>
                    <p className="text-xs text-gray-500">{isTestWallet ? "Test Patient Account" : "Patient Account"}</p>
                    <p className="text-xs text-gray-400 truncate">{walletAddress.slice(0, 20)}...</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-green-50 transition-colors cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-50 transition-colors cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-50 transition-colors cursor-pointer">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {isTestWallet ? "Mr. Singh!" : "Patient!"}</h1>
              <p className="text-gray-600 mt-1">Your secure medical records on blockchain - WAHEGURU JI</p>
              {isTestWallet && (
                <Badge variant="outline" className="mt-2 text-blue-600 border-blue-200">
                  Test Patient Wallet
                </Badge>
              )}
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
              <Button onClick={handleRefresh} variant="outline" size="sm" className="hover:bg-blue-50 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-16 w-16 ring-4 ring-blue-200">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Patient Avatar" />
                <AvatarFallback className="text-lg">{isTestWallet ? "MS" : "PT"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isTestWallet ? "Mr. Singh (WAHEGURU JI)" : "Patient"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {isTestWallet ? "Age: 45 years" : "Patient Profile"}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {isTestWallet ? "+1 (555) WAHEGURU" : "+1 (555) XXX-XXXX"}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {isTestWallet ? "mrsingh@waheguru.ji" : "patient@email.com"}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {isTestWallet ? "Primary Condition: Hypertension" : "Active Patient"}
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
                <p className="text-xs text-gray-500 mt-1">Last refresh: {lastRefresh.toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Shield className="h-8 w-8 text-green-600" />
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
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      nftReports.filter((r) => {
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        return new Date(r.createdAt) > weekAgo
                      }).length
                    }
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

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your medical reports..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Reports ({nftReports.length})</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>

          {/* Reports Content */}
          <TabsContent value={activeTab} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Medical NFT Reports
                </CardTitle>
                <CardDescription>Blockchain-verified medical reports that you own permanently</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500">Loading your medical reports... WAHEGURU JI</p>
                  </div>
                ) : filteredNFTs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? "No reports match your search" : "No Medical Reports Yet"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Your blockchain-verified medical NFT reports will appear here when doctors create them for you."}
                    </p>
                    {isTestWallet && !searchTerm && (
                      <Alert className="max-w-md mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          If you're Mr. Singh, sample reports should load automatically. Try refreshing the page or
                          check if the doctor has created reports for your wallet.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNFTs.map((report) => {
                      const statusAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Status")
                      const dateAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Date")
                      const doctorAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Doctor")

                      return (
                        <Card
                          key={report.id || report.mint}
                          className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-blue-100"
                          onClick={() => handleViewDetails(report)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  {getReportTypeIcon(report.metadata.attributes)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm">{report.metadata.name}</h3>
                                  <p className="text-xs text-gray-500">
                                    {doctorAttr?.value || "Unknown Doctor"} • {dateAttr?.value || "No date"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {report.blockchainConfirmed && <Verified className="h-4 w-4 text-green-600" />}
                                {statusAttr && (
                                  <Badge className={`text-xs ${getStatusColor(statusAttr.value)}`}>
                                    {statusAttr.value}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 mb-4">{report.metadata.description}</p>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">NFT Mint:</span>
                                <span className="font-mono">{report.mint.slice(0, 8)}...</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Created:</span>
                                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewDetails(report)
                                }}
                                className="flex-1"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShareReport(report)
                                }}
                                className="flex-1"
                              >
                                <Share2 className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                            </div>

                            {report.explorer && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="w-full mt-2 bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a href={report.explorer} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View on Blockchain
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Wallet Info */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Shield className="h-5 w-5 mr-2" />
              Wallet Information - WAHEGURU JI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{nftReports.length}</div>
                <p className="text-sm text-gray-600">Medical Records Secured</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-sm text-gray-600">Blockchain Verified</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">Testnet</div>
                <p className="text-sm text-gray-600">Solana Network</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Wallet Address:</span>
                <span className="font-mono">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network:</span>
                <span>Solana Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant="outline" className="text-xs text-green-600">
                  Connected
                </Badge>
              </div>
              {isTestWallet && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <Badge variant="outline" className="text-xs text-blue-600">
                    Test Patient (Mr. Singh)
                  </Badge>
                </div>
              )}
            </div>
            <Alert className="mt-4">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                All your medical records are securely stored as NFTs on the Solana blockchain, ensuring permanent access
                and verification. WAHEGURU JI protects your health data! 🙏
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Medical Report Details - WAHEGURU JI
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedReport.metadata.name}</h3>
                <p className="text-sm text-gray-700 mb-3">{selectedReport.metadata.description}</p>
                <div className="flex items-center gap-2">
                  {selectedReport.blockchainConfirmed && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Blockchain Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    NFT Report
                  </Badge>
                </div>
              </div>

              {/* Report Attributes */}
              <div>
                <h3 className="font-semibold mb-3">Report Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.metadata.attributes.map((attr: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{attr.trait_type}</p>
                      <p className="text-sm font-medium">{attr.value}</p>
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
                      <Badge variant="outline" className="text-xs">
                        {selectedReport.status}
                      </Badge>
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

              {/* Verification Section */}
              {verificationResult && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Verified className="h-4 w-4 text-green-600" />
                    Verification Result
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {verificationResult.verified ? "Verified" : "Failed"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Block Height:</span>
                      <span>{verificationResult.blockHeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified At:</span>
                      <span>{new Date(verificationResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleVerifyNFT}
                  disabled={isVerifying}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
                <Button variant="outline" onClick={() => handleExportReport(selectedReport)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report Data
                </Button>
                <Button variant="outline" onClick={() => handleShareReport(selectedReport)} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
              </div>

              {/* Explorer Link */}
              {selectedReport.explorer && (
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open(selectedReport.explorer, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Solana Explorer
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
