"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  Calendar,
  Users,
  Activity,
  Plus,
  Send,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Heart,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Sparkles,
  RefreshCw,
  CheckCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  createMedicalReportNFTWithPDF,
  getDoctorAppointments,
  createAppointment,
  TEST_PATIENT_WALLET,
  getAllNFTReports,
} from "@/lib/solana"

interface EnhancedDoctorDashboardProps {
  walletAddress: string
  onLogout: () => void
}

export function EnhancedDoctorDashboard({ walletAddress, onLogout }: EnhancedDoctorDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [createdReports, setCreatedReports] = useState<any[]>([])

  // Report form state
  const [reportForm, setReportForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
    pdfFile: null as File | null,
  })

  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    type: "Consultation",
    notes: "",
  })

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [walletAddress])

  // Load created reports
  useEffect(() => {
    loadCreatedReports()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log("WAHEGURU JI - Loading doctor dashboard data")

      // Load appointments
      const appointmentsData = await getDoctorAppointments(walletAddress)
      setAppointments(appointmentsData)

      // Mock patients data with Mr. Singh's correct wallet - WAHEGURU JI
      const mockPatients = [
        {
          id: "patient_1",
          name: "Mr. Singh (WAHEGURU JI)",
          walletAddress: TEST_PATIENT_WALLET,
          age: 45,
          phone: "+1 (555) WAHEGURU",
          email: "mrsingh@waheguru.ji",
          condition: "Hypertension",
          lastVisit: "2024-12-10",
          status: "Active",
          avatar: "/placeholder.svg?height=64&width=64",
          address: "123 Gurudwara Street, Punjab City",
          bloodType: "O+",
          allergies: "None",
          medications: ["Lisinopril 10mg", "Metformin 500mg"],
          emergencyContact: "Mrs. Singh - +1 (555) 123-4567",
        },
        {
          id: "patient_2",
          name: "Mrs. Kaur (WAHEGURU JI)",
          walletAddress: "PatientWallet987654321098765432109876",
          age: 38,
          phone: "+1 (555) 234-5678",
          email: "mrskaur@waheguru.ji",
          condition: "Diabetes Type 2",
          lastVisit: "2024-12-08",
          status: "Active",
          avatar: "/placeholder.svg?height=64&width=64",
          address: "456 Sikh Temple Road, Khalsa City",
          bloodType: "A+",
          allergies: "Penicillin",
          medications: ["Metformin 1000mg", "Glipizide 5mg"],
          emergencyContact: "Mr. Kaur - +1 (555) 234-5679",
        },
        {
          id: "patient_3",
          name: "Mr. Sharma (WAHEGURU JI)",
          walletAddress: "PatientWallet456789012345678901234567",
          age: 52,
          phone: "+1 (555) 345-6789",
          email: "mrsharma@waheguru.ji",
          condition: "Post-Surgery Recovery",
          lastVisit: "2024-12-12",
          status: "Recovery",
          avatar: "/placeholder.svg?height=64&width=64",
          address: "789 Health Avenue, Medical District",
          bloodType: "B+",
          allergies: "Latex",
          medications: ["Ibuprofen 400mg", "Omeprazole 20mg"],
          emergencyContact: "Mrs. Sharma - +1 (555) 345-6790",
        },
      ]

      setPatients(mockPatients)
      console.log("WAHEGURU JI - Dashboard data loaded successfully")
    } catch (error) {
      console.error("WAHEGURU JI - Error loading dashboard data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCreatedReports = () => {
    try {
      const allReports = getAllNFTReports()
      const doctorReports = allReports.filter((report) => report.doctorWallet === walletAddress)
      setCreatedReports(doctorReports)
      console.log("WAHEGURU JI - Loaded created reports:", doctorReports.length)
    } catch (error) {
      console.error("WAHEGURU JI - Error loading created reports:", error)
    }
  }

  const handleCreateReport = async () => {
    if (!selectedPatient || !reportForm.title || !reportForm.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingReport(true)
    try {
      console.log("WAHEGURU JI - Creating NFT report for patient:", selectedPatient.walletAddress)

      const reportData = {
        title: reportForm.title,
        content: reportForm.content,
        date: reportForm.date,
        doctorName: "Dr. WAHEGURU Singh",
        remarks: reportForm.remarks || "Medical report created with WAHEGURU JI's blessings",
        pdfFile: reportForm.pdfFile,
      }

      const nftReport = await createMedicalReportNFTWithPDF(walletAddress, selectedPatient.walletAddress, reportData)

      console.log("WAHEGURU JI - NFT Report created successfully:", nftReport)

      // Refresh created reports
      loadCreatedReports()

      toast({
        title: "Report Created Successfully! 🎉 WAHEGURU JI",
        description: `Medical NFT report sent to ${selectedPatient.name}'s wallet: ${selectedPatient.walletAddress.slice(0, 8)}...`,
      })

      // Reset form and close dialog
      setReportForm({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        remarks: "",
        pdfFile: null,
      })
      setReportDialogOpen(false)
      setSelectedPatient(null)
    } catch (error) {
      console.error("WAHEGURU JI - Error creating report:", error)
      toast({
        title: "Error Creating Report",
        description: "Failed to create medical report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingReport(false)
    }
  }

  const handleCreateAppointment = async () => {
    if (!selectedPatient || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingAppointment(true)
    try {
      const appointmentData = {
        doctorWallet: walletAddress,
        patientWallet: selectedPatient.walletAddress,
        date: appointmentForm.date,
        time: appointmentForm.time,
        type: appointmentForm.type,
        notes: appointmentForm.notes,
      }

      const newAppointment = await createAppointment(appointmentData)

      toast({
        title: "Appointment Created! WAHEGURU JI",
        description: `Appointment scheduled with ${selectedPatient.name} for ${appointmentForm.date} at ${appointmentForm.time}`,
      })

      // Refresh appointments
      const updatedAppointments = await getDoctorAppointments(walletAddress)
      setAppointments(updatedAppointments)

      // Reset form and close dialog
      setAppointmentForm({
        date: "",
        time: "",
        type: "Consultation",
        notes: "",
      })
      setAppointmentDialogOpen(false)
      setSelectedPatient(null)
    } catch (error) {
      console.error("WAHEGURU JI - Error creating appointment:", error)
      toast({
        title: "Error Creating Appointment",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAppointment(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf" && file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setReportForm({ ...reportForm, pdfFile: file })
        toast({
          title: "File Uploaded - WAHEGURU JI",
          description: `PDF file "${file.name}" uploaded successfully.`,
        })
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file smaller than 10MB.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRefreshReports = () => {
    loadCreatedReports()
    toast({
      title: "Reports Refreshed - WAHEGURU JI",
      description: "Created reports list has been updated.",
    })
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && patient.status.toLowerCase() === filterStatus.toLowerCase()
  })

  const filteredAppointments = appointments.filter((appointment) => {
    return appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "recovery":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading doctor dashboard... WAHEGURU JI</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Health Plus
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  Doctor Portal
                </Badge>
              </div>
            </div>

            {/* Doctor Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-red-50 transition-all duration-200 hover:scale-105"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-red-100">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="font-medium text-sm block">Dr. WAHEGURU Singh</span>
                    <span className="text-xs text-gray-500">General Practitioner</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">Dr. WAHEGURU Singh</p>
                    <p className="text-xs text-gray-500">General Practitioner</p>
                    <p className="text-xs text-gray-400 truncate">{walletAddress.slice(0, 20)}...</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. WAHEGURU Singh!</h1>
              <p className="text-gray-600 mt-1">Manage your patients and create blockchain medical records</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Shield className="h-3 w-3 mr-1" />
                Blockchain Secured
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                NFT Enabled
              </Badge>
              <Button
                onClick={handleRefreshReports}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">NFT Reports Created</p>
                  <p className="text-2xl font-bold text-gray-900">{createdReports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter((p) => p.status === "Active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reports">Created Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Patients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Patients
                  </CardTitle>
                  <CardDescription>Your most recent patient interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patients.slice(0, 3).map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-600">{patient.condition}</p>
                            <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setReportDialogOpen(true)
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Create Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled appointments for today</CardDescription>
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
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-xs text-gray-500">{appointment.type}</p>
                          </div>
                        </div>
                        <Badge className={getAppointmentStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-red-800">Quick Actions - WAHEGURU JI</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                    onClick={() => setReportDialogOpen(true)}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Create NFT Report
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center hover:bg-green-50 bg-transparent"
                    onClick={() => setAppointmentDialogOpen(true)}
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 bg-transparent"
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    View Patients
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center hover:bg-orange-50 bg-transparent"
                    onClick={() => setActiveTab("reports")}
                  >
                    <Activity className="h-6 w-6 mb-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Patient Management
                    </CardTitle>
                    <CardDescription>Manage your patients and create medical reports</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search patients..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Patients</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("recovery")}>Recovery</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("critical")}>Critical</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <p className="text-sm text-gray-600">Age: {patient.age}</p>
                            <Badge className={`${getStatusColor(patient.status)} mt-1`}>{patient.status}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {patient.email}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            {patient.condition}
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            <span className="font-mono text-xs">
                              {patient.walletAddress.slice(0, 8)}...{patient.walletAddress.slice(-8)}
                            </span>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setReportDialogOpen(true)
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Create NFT Report
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setAppointmentDialogOpen(true)
                            }}
                            className="flex-1"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "No patients match your search criteria." : "No patients registered yet."}
                    </p>
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
                  Appointment Management
                </CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <Card key={appointment.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              <p className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </p>
                              <p className="text-sm text-gray-500">{appointment.type}</p>
                              {appointment.notes && (
                                <p className="text-sm text-gray-500 mt-1">Notes: {appointment.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getAppointmentStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                      <p className="text-gray-600">No appointments scheduled yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Created Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Created NFT Reports
                    </CardTitle>
                    <CardDescription>Medical reports you have created and sent to patients</CardDescription>
                  </div>
                  <Button onClick={handleRefreshReports} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {createdReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Created Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start creating NFT medical reports for your patients to see them here.
                    </p>
                    <Button onClick={() => setReportDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Report
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdReports.map((report) => {
                      const patientAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Patient")
                      const dateAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Date")
                      const typeAttr = report.metadata.attributes.find((a: any) => a.trait_type === "Type")

                      return (
                        <Card key={report.id} className="hover:shadow-lg transition-shadow border-2 border-green-100">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-sm mb-1">{report.metadata.name}</h3>
                                <p className="text-xs text-gray-500">
                                  Patient: {patientAttr?.value || "Unknown"} • {dateAttr?.value || "No date"}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {typeAttr?.value || "Report"}
                              </Badge>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 mb-4">{report.metadata.description}</p>

                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">NFT Mint:</span>
                                <span className="font-mono">{report.mint.slice(0, 8)}...</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Patient Wallet:</span>
                                <span className="font-mono">{report.patientWallet.slice(0, 8)}...</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {report.status}
                                </Badge>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                                <a href={report.explorer} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </a>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => {
                                  const patient = patients.find((p) => p.walletAddress === report.patientWallet)
                                  if (patient) {
                                    setSelectedPatient(patient)
                                    setReportDialogOpen(true)
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                New Report
                              </Button>
                            </div>
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
      </div>

      {/* Create Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Create Medical NFT Report - WAHEGURU JI
            </DialogTitle>
            <DialogDescription>
              Create a blockchain-verified medical report that will be sent as an NFT to the patient's wallet.
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedPatient.name}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {selectedPatient.age}
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span> {selectedPatient.condition}
                  </div>
                  <div>
                    <span className="font-medium">Wallet:</span>{" "}
                    <span className="font-mono text-xs">
                      {selectedPatient.walletAddress.slice(0, 8)}...{selectedPatient.walletAddress.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-title">Report Title *</Label>
                  <Input
                    id="report-title"
                    placeholder="e.g., Blood Test Results, X-Ray Report"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="report-content">Medical Report Content *</Label>
                  <Textarea
                    id="report-content"
                    placeholder="Enter detailed medical report content..."
                    rows={6}
                    value={reportForm.content}
                    onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report-date">Report Date</Label>
                    <Input
                      id="report-date"
                      type="date"
                      value={reportForm.date}
                      onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-remarks">Additional Remarks</Label>
                    <Input
                      id="report-remarks"
                      placeholder="Optional remarks"
                      value={reportForm.remarks}
                      onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pdf-upload">Upload PDF Report (Optional)</Label>
                  <div className="mt-2">
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    {reportForm.pdfFile && (
                      <p className="text-sm text-green-600 mt-2">✓ File uploaded: {reportForm.pdfFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Alert */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This report will be created as an NFT on the Solana blockchain and sent directly to the patient's
                  wallet: <span className="font-mono">{selectedPatient.walletAddress}</span>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleCreateReport}
                  disabled={isCreatingReport || !reportForm.title || !reportForm.content}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isCreatingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating NFT Report...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Create & Send NFT Report
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setReportDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Appointment
            </DialogTitle>
            <DialogDescription>Schedule a new appointment with the selected patient.</DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium">{selectedPatient.name}</p>
                <p className="text-sm text-gray-600">{selectedPatient.condition}</p>
              </div>

              {/* Appointment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appointment-date">Date *</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="appointment-time">Time *</Label>
                  <Input
                    id="appointment-time"
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="appointment-type">Type</Label>
                  <select
                    id="appointment-type"
                    className="w-full p-2 border rounded-md"
                    value={appointmentForm.type}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="appointment-notes">Notes</Label>
                  <Textarea
                    id="appointment-notes"
                    placeholder="Additional notes..."
                    rows={3}
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleCreateAppointment}
                  disabled={isCreatingAppointment || !appointmentForm.date || !appointmentForm.time}
                  className="flex-1"
                >
                  {isCreatingAppointment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Appointment
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
