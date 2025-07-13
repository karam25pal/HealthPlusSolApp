"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  ExternalLink,
  Stethoscope,
  Activity,
  Shield,
  Zap,
  Eye,
  Send,
  TestTube,
  Play,
  Download,
  Copy,
  Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  createMedicalReportNFTWithPDF,
  createAppointment,
  getDoctorAppointments,
  getDoctorPatients,
  approveAppointment,
  rejectAppointment,
  getAllReportsForDoctor,
  NotificationService,
  verifyNFTOnBlockchain,
  getTransactionDetails,
} from "@/lib/solana"

interface DoctorDashboardProps {
  walletAddress: string
  doctorName: string
}

// Test data for creating sample NFT reports
const TEST_REPORTS = [
  {
    title: "Complete Blood Count (CBC) - Test Report",
    content: `COMPLETE BLOOD COUNT ANALYSIS

Patient: Mr. Singh
Date: ${new Date().toLocaleDateString()}
Doctor: Dr. WAHEGURU Singh

RESULTS:
• White Blood Cells: 7.2 K/uL (Normal: 4.0-11.0)
• Red Blood Cells: 4.8 M/uL (Normal: 4.2-5.4)
• Hemoglobin: 14.5 g/dL (Normal: 12.0-16.0)
• Hematocrit: 42.1% (Normal: 36.0-46.0)
• Platelets: 285 K/uL (Normal: 150-450)

INTERPRETATION:
All values are within normal limits. No signs of infection, anemia, or bleeding disorders.

RECOMMENDATIONS:
• Continue current health regimen
• Follow-up in 6 months
• Maintain balanced diet and regular exercise

 - Blessed with good health! 🙏`,
    remarks:
      "Excellent health parameters. Patient shows optimal blood chemistry values. Patient shows optimal blood chemistry values. Continue preventive care approach.",
    type: "Lab Report",
  },
  {
    title: "Chest X-Ray Analysis - Test Report",
    content: `CHEST X-RAY EXAMINATION

Patient: Mrs. Kaur
Date: ${new Date().toLocaleDateString()}
Doctor: Dr. WAHEGURU Singh

FINDINGS:
• Heart size: Normal
• Lung fields: Clear bilaterally
• No pleural effusion
• No pneumothorax
• Diaphragm: Normal position
• Bone structures: Intact

IMPRESSION:
Normal chest X-ray. No acute cardiopulmonary abnormalities detected.

CLINICAL CORRELATION:
Patient's respiratory symptoms likely due to seasonal allergies rather than structural lung disease.

RECOMMENDATIONS:
• Antihistamine therapy as needed
• Follow-up if symptoms persist
• Annual screening recommended

's protection over respiratory health! 🙏`,
    remarks: "Clear chest imaging. Seasonal allergy management recommended. No structural concerns identified.",
    type: "Radiology Report",
  },
  {
    title: "Diabetes Management Review - Test Report",
    content: `DIABETES MANAGEMENT ASSESSMENT

Patient: Mr. Sharma
Date: ${new Date().toLocaleDateString()}
Doctor: Dr. WAHEGURU Singh

CURRENT MEDICATIONS:
• Metformin 500mg twice daily
• Glipizide 5mg once daily

LABORATORY RESULTS:
• HbA1c: 7.2% (Target: <7.0%)
• Fasting Glucose: 142 mg/dL
• Random Glucose: 180 mg/dL
• Creatinine: 1.0 mg/dL (Normal)

ASSESSMENT:
Diabetes control is improving but not yet optimal. Kidney function remains normal.

PLAN:
• Increase Metformin to 1000mg twice daily
• Add lifestyle counseling
• Dietary consultation recommended
• Follow-up in 3 months

 guides us toward better health management! 🙏`,
    remarks:
      "Diabetes management progressing well. Medication adjustment and lifestyle modifications will optimize control.",
    type: "Follow-up Report",
  },
]

export function EnhancedDoctorDashboard({ walletAddress, doctorName }: DoctorDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // NFT Report Creation State
  const [isCreatingNFT, setIsCreatingNFT] = useState(false)
  const [nftProgress, setNftProgress] = useState(0)
  const [nftStatus, setNftStatus] = useState("")
  const [reportForm, setReportForm] = useState({
    patientWallet: "",
    title: "",
    content: "",
    remarks: "",
    pdfFile: null as File | null,
  })

  // Test NFT Creation State
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [selectedTestReport, setSelectedTestReport] = useState(0)

  // Appointment Creation State
  const [appointmentForm, setAppointmentForm] = useState({
    patientWallet: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [walletAddress])

  // Set up real-time notifications
  useEffect(() => {
    const handleReportCreated = (data: any) => {
      console.log(" - New report created notification:", data)
      loadReports()

      // Add to test results if this was a test
      if (data.report.metadata.name.includes("Test Report")) {
        setTestResults((prev) => [
          ...prev,
          {
            ...data.report,
            timestamp: new Date().toISOString(),
            verified: true,
          },
        ])
      }

      toast({
        title: "NFT Report Created Successfully! 🎉",
        description: `Medical report NFT created for ${data.report.metadata.attributes.find((a: any) => a.trait_type === "Patient")?.value}`,
      })
    }

    NotificationService.subscribe("nft_report_created", handleReportCreated)

    return () => {
      NotificationService.unsubscribe("nft_report_created", handleReportCreated)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log(" - Loading dashboard data for doctor:", walletAddress)

      const [patientsData, appointmentsData, reportsData] = await Promise.all([
        getDoctorPatients(walletAddress),
        getDoctorAppointments(walletAddress),
        getAllReportsForDoctor(walletAddress),
      ])

      setPatients(patientsData)
      setAppointments(appointmentsData)
      setReports(reportsData)

      console.log(" - Dashboard data loaded successfully")
    } catch (error) {
      console.error(" - Error loading dashboard data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadReports = async () => {
    try {
      const reportsData = await getAllReportsForDoctor(walletAddress)
      setReports(reportsData)
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }

  const handleCreateNFTReport = async () => {
    if (!reportForm.patientWallet || !reportForm.title || !reportForm.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingNFT(true)
      setNftProgress(0)
      setNftStatus("Initializing NFT creation...")

      // Progress simulation with detailed steps
      const progressSteps = [
        { progress: 10, status: "Validating report data..." },
        { progress: 25, status: "Uploading PDF to IPFS..." },
        { progress: 40, status: "Creating NFT metadata..." },
        { progress: 60, status: "Minting NFT on Solana blockchain..." },
        { progress: 80, status: "Transferring to patient wallet..." },
        { progress: 95, status: "Verifying blockchain transaction..." },
        { progress: 100, status: "NFT Report created successfully!" },
      ]

      for (const step of progressSteps) {
        setNftProgress(step.progress)
        setNftStatus(step.status)
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }

      const nftReport = await createMedicalReportNFTWithPDF(walletAddress, reportForm.patientWallet, {
        title: reportForm.title,
        content: reportForm.content,
        date: new Date().toISOString().split("T")[0],
        doctorName: doctorName,
        remarks: reportForm.remarks,
        pdfFile: reportForm.pdfFile || undefined,
      })

      console.log(" - NFT Report created:", nftReport)

      toast({
        title: "NFT Report Created Successfully! 🎉",
        description: `Medical report NFT has been created and sent to patient. Transaction: ${nftReport.transactionSignature?.slice(0, 8)}...`,
      })

      // Reset form
      setReportForm({
        patientWallet: "",
        title: "",
        content: "",
        remarks: "",
        pdfFile: null,
      })

      // Reload reports
      await loadReports()
    } catch (error) {
      console.error(" - Error creating NFT report:", error)
      toast({
        title: "Error Creating NFT Report",
        description: error.message || "Failed to create NFT report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingNFT(false)
      setNftProgress(0)
      setNftStatus("")
    }
  }

  const handleRunTestWorkflow = async () => {
    if (patients.length === 0) {
      toast({
        title: "No Patients Available",
        description: "Please ensure patients are loaded before running test.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsRunningTest(true)
      setTestResults([])

      toast({
        title: "Starting Test Workflow 🧪",
        description: "Creating test medical NFT reports to verify complete workflow...",
      })

      const testReport = TEST_REPORTS[selectedTestReport]
      const testPatient = patients[0] // Use first patient for test

      console.log(" - Starting test NFT creation workflow")
      console.log("Test Report:", testReport.title)
      console.log("Test Patient:", testPatient.name)

      // Create test NFT report
      const nftReport = await createMedicalReportNFTWithPDF(walletAddress, testPatient.wallet, {
        title: testReport.title,
        content: testReport.content,
        date: new Date().toISOString().split("T")[0],
        doctorName: doctorName,
        remarks: testReport.remarks,
      })

      // Verify the NFT on blockchain
      const isVerified = await verifyNFTOnBlockchain(nftReport.mint)

      // Get transaction details
      const txDetails = await getTransactionDetails(nftReport.transactionSignature)

      const testResult = {
        ...nftReport,
        verified: isVerified,
        transactionDetails: txDetails,
        testType: testReport.type,
        timestamp: new Date().toISOString(),
        patientName: testPatient.name,
      }

      setTestResults([testResult])

      toast({
        title: "Test Workflow Completed Successfully! ✅",
        description: `NFT created, verified, and transferred to ${testPatient.name}`,
      })

      console.log(" - Test workflow completed successfully!")
      console.log("Test Results:", testResult)
    } catch (error) {
      console.error(" - Test workflow failed:", error)
      toast({
        title: "Test Workflow Failed ❌",
        description: error.message || "Test workflow encountered an error.",
        variant: "destructive",
      })
    } finally {
      setIsRunningTest(false)
    }
  }

  const handleCreateAppointment = async () => {
    if (!appointmentForm.patientWallet || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const appointment = await createAppointment({
        doctorWallet: walletAddress,
        patientWallet: appointmentForm.patientWallet,
        date: appointmentForm.date,
        time: appointmentForm.time,
        type: appointmentForm.type,
        notes: appointmentForm.notes,
      })

      toast({
        title: "Appointment Created",
        description: `Appointment scheduled for ${appointmentForm.date} at ${appointmentForm.time}`,
      })

      // Reset form
      setAppointmentForm({
        patientWallet: "",
        date: "",
        time: "",
        type: "",
        notes: "",
      })

      // Reload appointments
      const appointmentsData = await getDoctorAppointments(walletAddress)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error Creating Appointment",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await approveAppointment(appointmentId)
      toast({
        title: "Appointment Approved",
        description: "The appointment has been confirmed.",
      })

      const appointmentsData = await getDoctorAppointments(walletAddress)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error approving appointment:", error)
      toast({
        title: "Error",
        description: "Failed to approve appointment.",
        variant: "destructive",
      })
    }
  }

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      await rejectAppointment(appointmentId, "Doctor unavailable")
      toast({
        title: "Appointment Rejected",
        description: "The appointment has been rejected.",
      })

      const appointmentsData = await getDoctorAppointments(walletAddress)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error rejecting appointment:", error)
      toast({
        title: "Error",
        description: "Failed to reject appointment.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setReportForm({ ...reportForm, pdfFile: file })
      toast({
        title: "File Selected",
        description: `${file.name} selected for upload.`,
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      confirmed: { color: "bg-green-500", text: "Confirmed" },
      rejected: { color: "bg-red-500", text: "Rejected" },
      minted: { color: "bg-blue-500", text: "Minted" },
      transferred: { color: "bg-purple-500", text: "Sent" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-500",
      text: status,
    }

    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard... </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dr. {doctorName} Dashboard</h1>
              <p className="text-gray-600 mt-1">WAHEGURU Health System - Solana Blockchain</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Blockchain Verified
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Solana Devnet
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
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
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">NFT Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TestTube className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Test Results</p>
                  <p className="text-2xl font-bold text-gray-900">{testResults.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-workflow">🧪 Test Workflow</TabsTrigger>
            <TabsTrigger value="create-report">Create NFT Report</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          {/* Test Workflow Tab */}
          <TabsContent value="test-workflow" className="space-y-6">
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <TestTube className="h-6 w-6 mr-2" />
                  NFT Medical Report Test Workflow
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Test the complete blockchain workflow: Create → Mint → Transfer → Verify medical NFT reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="test-report-select">Select Test Report Type</Label>
                      <Select
                        value={selectedTestReport.toString()}
                        onValueChange={(value) => setSelectedTestReport(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose test report" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEST_REPORTS.map((report, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {report.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Test Report Preview:</strong>
                        <br />
                        {TEST_REPORTS[selectedTestReport].title}
                        <br />
                        <span className="text-sm text-gray-600">Type: {TEST_REPORTS[selectedTestReport].type}</span>
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleRunTestWorkflow}
                      disabled={isRunningTest || patients.length === 0}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                    >
                      {isRunningTest ? (
                        <>
                          <Activity className="h-5 w-5 mr-2 animate-spin" />
                          Running Test Workflow...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Run Complete Test Workflow
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Test Workflow Steps:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <span>Create medical report with test data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <span>Upload metadata to IPFS</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <span>Mint NFT on Solana blockchain</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <span>Transfer NFT to patient wallet</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          5
                        </div>
                        <span>Verify NFT on blockchain</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          6
                        </div>
                        <span>Generate test results report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="text-lg font-semibold text-green-800 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Test Results - Workflow Completed Successfully!
                    </h3>

                    {testResults.map((result, index) => (
                      <Card key={index} className="border-2 border-green-200 bg-green-50">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-green-800">NFT Report Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Report Title:</span>
                                  <span className="text-right">{result.metadata.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Patient:</span>
                                  <span className="text-right">{result.patientName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">NFT Mint:</span>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-right font-mono text-xs">{result.mint.slice(0, 8)}...</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(result.mint, "NFT Mint Address")}
                                      className="h-4 w-4 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Transaction:</span>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-right font-mono text-xs">
                                      {result.transactionSignature.slice(0, 8)}...
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        copyToClipboard(result.transactionSignature, "Transaction Signature")
                                      }
                                      className="h-4 w-4 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Status:</span>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(result.status)}
                                    {result.verified && (
                                      <Badge className="bg-green-600 text-white">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-semibold text-green-800">Blockchain Verification</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Network:</span>
                                  <span className="text-right">Solana Devnet</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Block Time:</span>
                                  <span className="text-right">{new Date(result.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Confirmation:</span>
                                  <span className="text-right text-green-600 font-medium">Confirmed</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">IPFS Hash:</span>
                                  <span className="text-right font-mono text-xs">
                                    {result.metadataHash?.slice(0, 12)}...
                                  </span>
                                </div>
                              </div>

                              <div className="flex space-x-2 mt-4">
                                <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                                  <a href={result.explorer} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View on Explorer
                                  </a>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "Test Results")}
                                  className="flex-1"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Export Data
                                </Button>
                              </div>
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent NFT Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{report.metadata.name}</p>
                          <p className="text-sm text-gray-600">
                            {report.metadata.attributes.find((a: any) => a.trait_type === "Patient")?.value}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(report.status)}
                          {report.explorer && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={report.explorer} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments
                      .filter((apt) => apt.status === "pending")
                      .slice(0, 3)
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleApproveAppointment(appointment.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectAppointment(appointment.id)}>
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create NFT Report Tab */}
          <TabsContent value="create-report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Create Medical NFT Report
                </CardTitle>
                <CardDescription>
                  Create a secure, blockchain-verified medical report NFT for your patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isCreatingNFT && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>{nftStatus}</p>
                        <Progress value={nftProgress} className="w-full" />
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="patient-select">Select Patient</Label>
                      <Select
                        value={reportForm.patientWallet}
                        onValueChange={(value) => setReportForm({ ...reportForm, patientWallet: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.wallet} value={patient.wallet}>
                              {patient.name} - {patient.condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input
                        id="report-title"
                        placeholder="e.g., Blood Test Results"
                        value={reportForm.title}
                        onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="report-content">Medical Report Content</Label>
                      <Textarea
                        id="report-content"
                        placeholder="Enter detailed medical report content..."
                        rows={6}
                        value={reportForm.content}
                        onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="remarks">Doctor's Remarks</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Additional remarks or recommendations..."
                        rows={4}
                        value={reportForm.remarks}
                        onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pdf-upload">Upload PDF Report (Optional)</Label>
                      <div className="mt-2">
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {reportForm.pdfFile && (
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {reportForm.pdfFile.name} selected
                          </p>
                        )}
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        This report will be minted as an NFT on Solana blockchain and automatically transferred to the
                        patient's wallet for permanent, secure storage.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setReportForm({
                        patientWallet: "",
                        title: "",
                        content: "",
                        remarks: "",
                        pdfFile: null,
                      })
                    }
                  >
                    Clear Form
                  </Button>
                  <Button
                    onClick={handleCreateNFTReport}
                    disabled={isCreatingNFT}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreatingNFT ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Creating NFT...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Create & Send NFT Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Appointment */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Appointment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={appointmentForm.patientWallet}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, patientWallet: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.wallet} value={patient.wallet}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  />

                  <Input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  />

                  <Select
                    value={appointmentForm.type}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Appointment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine Checkup</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Notes..."
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  />

                  <Button onClick={handleCreateAppointment} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Appointments List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{appointment.patientName}</TableCell>
                            <TableCell>
                              {appointment.date} at {appointment.time}
                            </TableCell>
                            <TableCell>{appointment.type}</TableCell>
                            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                            <TableCell>
                              {appointment.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => handleApproveAppointment(appointment.id)}>
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectAppointment(appointment.id)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Manage your patients and their medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-600">Age: {patient.age}</p>
                            <p className="text-sm text-gray-600">{patient.condition}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-gray-500">Wallet: {patient.wallet.slice(0, 8)}...</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              View Records
                            </Button>
                            <Button size="sm" className="flex-1">
                              <FileText className="h-3 w-3 mr-1" />
                              New Report
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
