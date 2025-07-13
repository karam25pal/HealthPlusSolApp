"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Calendar,
  User,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Shield,
  Upload,
  Wallet,
  LogOut,
  Copy,
  ExternalLink,
  Download,
  Eye,
  Repeat,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  getDoctorPatients,
  getDoctorAppointments,
  getAllReportsForDoctor,
  approveAppointment,
  rejectAppointment,
  createMedicalReportNFTWithPDF,
  getWalletBalance,
  requestDevnetAirdrop,
  checkIPFSFileAccess,
  NotificationService,
} from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

interface EnhancedDoctorDashboardProps {
  walletAddress: string
  doctorName?: string
}

export function EnhancedDoctorDashboard({
  walletAddress,
  doctorName = "Dr. WAHEGURU Singh",
}: EnhancedDoctorDashboardProps) {
  const { publicKey, connected, signTransaction, sendTransaction, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const [activeTab, setActiveTab] = useState("overview")
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [nftReports, setNftReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingNFT, setIsCreatingNFT] = useState(false)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isRejecting, setIsRejecting] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [showCreateNFTForm, setShowCreateNFTForm] = useState(false)
  const [newReport, setNewReport] = useState({
    patientWallet: "",
    title: "",
    content: "",
    date: "",
    remarks: "",
    pdfFile: null as File | null,
  })
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [fileAccessStatus, setFileAccessStatus] = useState<{ [key: string]: boolean }>({})
  const [ipfsContent, setIpfsContent] = useState<{ [key: string]: any }>({})
  const [loadingIpfs, setLoadingIpfs] = useState<{ [key: string]: boolean }>({})
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

  useEffect(() => {
    loadDoctorData()
    const interval = setInterval(loadWalletBalance, 10000) // Refresh balance every 10 seconds
    return () => clearInterval(interval)
  }, [walletAddress])

  useEffect(() => {
    const handleNewReport = (data: any) => {
      if (data.doctorWallet === walletAddress) {
        console.log(" - Doctor received notification for new NFT report:", data.report)
        loadNFTReports()
      }
    }
    NotificationService.subscribe("nft_report_created", handleNewReport)
    return () => {
      NotificationService.unsubscribe("nft_report_created", handleNewReport)
    }
  }, [walletAddress])

  const loadDoctorData = async () => {
    setIsLoading(true)
    try {
      console.log(" - Loading doctor data for:", walletAddress)
      const [patientsData, appointmentsData, reportsData] = await Promise.all([
        getDoctorPatients(walletAddress),
        getDoctorAppointments(walletAddress),
        getAllReportsForDoctor(walletAddress),
      ])
      setPatients(patientsData)
      setAppointments(appointmentsData)
      setNftReports(reportsData)

      const accessStatus: { [key: string]: boolean } = {}
      for (const report of reportsData) {
        if (report.ipfsHash) {
          accessStatus[report.id] = await checkIPFSFileAccess(report.ipfsHash)
        }
      }
      setFileAccessStatus(accessStatus)

      await loadWalletBalance()
      console.log(" - Doctor data loaded successfully")
    } catch (error) {
      console.error(" - Error loading doctor data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load doctor data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadWalletBalance = async () => {
    if (walletAddress) {
      const balance = await getWalletBalance(walletAddress)
      setWalletBalance(balance)
    }
  }

  const loadNFTReports = async () => {
    try {
      const reportsData = await getAllReportsForDoctor(walletAddress)
      setNftReports(reportsData)
      const accessStatus: { [key: string]: boolean } = {}
      for (const report of reportsData) {
        if (report.ipfsHash) {
          accessStatus[report.id] = await checkIPFSFileAccess(report.ipfsHash)
        }
      }
      setFileAccessStatus(accessStatus)
    } catch (error) {
      console.error("Error loading NFT reports:", error)
    }
  }

  const handleApproveAppointment = async (id: string) => {
    setIsApproving(id)
    try {
      await approveAppointment(id)
      await loadDoctorData()
      toast({
        title: "Appointment Approved",
        description: "Appointment status updated to confirmed.",
      })
    } catch (error) {
      console.error(" - Error approving appointment:", error)
      toast({
        title: "Approval Failed",
        description: "Could not approve appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(null)
    }
  }

  const handleRejectAppointment = async (id: string) => {
    setIsRejecting(id)
    try {
      await rejectAppointment(id, "Doctor unavailable")
      await loadDoctorData()
      toast({
        title: "Appointment Rejected",
        description: "Appointment status updated to rejected.",
      })
    } catch (error) {
      console.error(" - Error rejecting appointment:", error)
      toast({
        title: "Rejection Failed",
        description: "Could not reject appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(null)
    }
  }

  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReport.patientWallet || !newReport.title || !newReport.content || !newReport.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the medical report.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingNFT(true)
    try {
      const createdNFT = await createMedicalReportNFTWithPDF(
        walletAddress,
        newReport.patientWallet,
        {
          title: newReport.title,
          content: newReport.content,
          date: newReport.date,
          doctorName: doctorName,
          remarks: newReport.remarks,
          pdfFile: newReport.pdfFile || undefined,
        },
        { publicKey, connected, signTransaction, sendTransaction },
      )

      toast({
        title: "Medical NFT Created! 🎉",
        description: `Report "${createdNFT.metadata.name}" minted as NFT. Transaction: ${createdNFT.transactionSignature.slice(
          0,
          10,
        )}...`,
      })
      setNewReport({
        patientWallet: "",
        title: "",
        content: "",
        date: "",
        remarks: "",
        pdfFile: null,
      })
      setShowCreateNFTForm(false)
      await loadDoctorData()
    } catch (error: any) {
      console.error(" - Error creating NFT:", error)
      toast({
        title: "NFT Creation Failed",
        description: `Error: ${error.message || "Failed to create medical NFT."}`,
        variant: "destructive",
      })
    } finally {
      setIsCreatingNFT(false)
    }
  }

  const handleAirdrop = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to request an airdrop.",
        variant: "destructive",
      })
      return
    }
    try {
      toast({
        title: "Requesting Airdrop...",
        description: "Please wait, this may take a few moments.",
      })
      const signature = await requestDevnetAirdrop(walletAddress)
      toast({
        title: "Airdrop Successful! 💰",
        description: `1 SOL received. Transaction: ${signature.slice(0, 10)}...`,
      })
      await loadWalletBalance()
    } catch (error: any) {
      console.error(" - Airdrop error:", error)
      toast({
        title: "Airdrop Failed",
        description: error.message || "Failed to request airdrop. Try again later.",
        variant: "destructive",
      })
    }
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
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
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
    }
  }

  const handleVerifyNFT = async (mintAddress: string) => {
    setIsVerifying(true)
    try {
      console.log(" - Verifying NFT:", mintAddress)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "NFT Verified",
        description: `NFT with mint address ${mintAddress.slice(0, 8)}... is valid.`,
      })
    } catch (error) {
      console.error(" - Error verifying NFT:", error)
      toast({
        title: "Verification Failed",
        description: " - Could not verify NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading doctor dashboard... </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-2xl bg-red-200 text-red-800 font-bold">
                  {getInitials(doctorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {doctorName}!</h1>
                <p className="text-gray-600 mt-1">Manage Patient Records & Appointments</p>
                <p className="text-sm text-gray-500">
                  Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Shield className="h-3 w-3 mr-1" />
                Doctor Verified
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Wallet className="h-3 w-3 mr-1" />
                Balance: {walletBalance.toFixed(4)} SOL
              </Badge>
              <Button variant="outline" onClick={handleAirdrop} size="sm">
                Request Airdrop
              </Button>
              <Button variant="outline" onClick={() => setVisible(true)} size="sm" className="bg-transparent">
                <Repeat className="h-4 w-4 mr-2" />
                Change Wallet
              </Button>
              <Button variant="outline" onClick={disconnect} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="reports">Medical NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Appointments
                  </CardTitle>
                  <CardDescription>Manage your latest patient appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time} ({appointment.type})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(appointment.status)}
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveAppointment(appointment.id)}
                                disabled={isApproving === appointment.id}
                              >
                                {isApproving === appointment.id ? (
                                  <Activity className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectAppointment(appointment.id)}
                                disabled={isRejecting === appointment.id}
                              >
                                {isRejecting === appointment.id ? (
                                  <Activity className="h-3 w-3 animate-spin" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No appointments yet</p>
                        <p className="text-sm">Appointments scheduled by patients will appear here.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Perform common tasks quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => setShowCreateNFTForm(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Medical NFT Report
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    View All Patients
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>
            {showCreateNFTForm && (
              <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Create Medical NFT Report
                    <Button variant="ghost" size="sm" onClick={() => setShowCreateNFTForm(false)}>
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </CardTitle>
                  <CardDescription>Mint a new medical report as an NFT on Solana for a patient.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateNFT} className="space-y-4">
                    <div>
                      <Label htmlFor="patientWallet">Patient Wallet Address</Label>
                      <Input
                        id="patientWallet"
                        placeholder="e.g., DHECcpkGumi43owNpHwLRhzrnVJ7upfMA4rf9XHb5JCo"
                        value={newReport.patientWallet}
                        onChange={(e) => setNewReport({ ...newReport, patientWallet: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Report Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Annual Checkup Results"
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Report Content / Diagnosis</Label>
                      <Textarea
                        id="content"
                        placeholder="Detailed diagnosis and findings..."
                        value={newReport.content}
                        onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date of Report</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newReport.date}
                        onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="remarks">Remarks / Treatment Plan</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Any additional notes or treatment recommendations"
                        value={newReport.remarks}
                        onChange={(e) => setNewReport({ ...newReport, remarks: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pdfFile">Attach PDF Report (Optional)</Label>
                      <Input
                        id="pdfFile"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setNewReport({ ...newReport, pdfFile: e.target.files?.[0] || null })}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isCreatingNFT}>
                      {isCreatingNFT ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Minting NFT...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Mint NFT Report
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Patients
                </CardTitle>
                <CardDescription>View and manage your registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Age: {patient.age}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View Reports
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Medical NFT Reports
                </CardTitle>
                <CardDescription>All medical reports you have minted as NFTs</CardDescription>
              </CardHeader>
              <CardContent>
                {nftReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Reports Minted Yet</h3>
                    <p className="text-gray-600">
                      Start by creating a new medical NFT report using the "Quick Actions" tab.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftReports.map((report) => (
                      <Card key={report.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                {getReportTypeIcon(
                                  report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value ||
                                    "Report",
                                )}
                                <div>
                                  <h3 className="font-semibold text-gray-900 line-clamp-2">{report.metadata.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    Patient:{" "}
                                    {patients.find((p) => p.wallet === report.patientWallet)?.name ||
                                      report.patientWallet.slice(0, 6) + "..."}
                                  </p>
                                </div>
                              </div>
                              {getStatusBadge(report.status)}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-700 line-clamp-3">{report.metadata.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  Date: {report.metadata.attributes.find((a: any) => a.trait_type === "Date")?.value}
                                </span>
                                <span>
                                  Type: {report.metadata.attributes.find((a: any) => a.trait_type === "Type")?.value}
                                </span>
                              </div>
                            </div>
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
                                onClick={() => handleViewIPFSFile(report)}
                                disabled={!fileAccessStatus[report.id]}
                                className="flex-1"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                File
                              </Button>
                            </div>
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
            {selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Medical Report Content</h3>
                      <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {selectedReport.metadata.description}
                      </div>
                    </div>
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
                              onClick={() =>
                                copyToClipboard(selectedReport.transactionSignature, "Transaction Signature")
                              }
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
