"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { SolanaWalletProvider } from "@/components/wallet-provider"
import { EnhancedDoctorDashboard } from "@/components/doctor/enhanced-doctor-dashboard"
import { PatientNFTReports } from "@/components/patient/patient-nft-reports"
import { getUserRole, type UserRole, DEMO_WALLETS } from "@/lib/solana"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Stethoscope,
  Home,
  Thermometer,
  Wind,
  HeadphonesIcon,
  Heart,
  Pill,
  Eye,
  Star,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Building2,
  ChevronRight,
  Activity,
  FileText,
  LogOut,
  Send,
  Wallet,
  UserCheck,
  TestTube,
  Shuffle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

const symptoms = [
  { icon: Thermometer, label: "Temperature", color: "bg-red-100 text-red-600" },
  { icon: Wind, label: "Snuffle", color: "bg-gray-100 text-gray-600" },
  { icon: HeadphonesIcon, label: "Headache", color: "bg-red-100 text-red-600" },
  { icon: Heart, label: "Chest Pain", color: "bg-black text-white" },
  { icon: Pill, label: "Nausea", color: "bg-gray-100 text-gray-600" },
  { icon: Eye, label: "Vision Issues", color: "bg-red-100 text-red-600" },
  { icon: Activity, label: "Fatigue", color: "bg-gray-100 text-gray-600" },
  { icon: Wind, label: "Cough", color: "bg-black text-white" },
]

const doctors = [
  {
    id: 1,
    name: "Dr. Chris Frazier",
    specialty: "Pediatrician",
    rating: 4.8,
    avatar: "/placeholder.svg?height=60&width=60",
    phone: "+1 (555) 123-4567",
    email: "chris.frazier@clinic.com",
    about:
      "Dr. Chris Frazier is an experienced pediatrician with over 15 years of practice. Specializes in child development and preventive care.",
    location: "Sunshine Medical Center, 123 Oak St, Downtown",
    distance: "0.8 km",
    reviews: [
      { name: "Sarah Johnson", rating: 5, comment: "Excellent with children, very patient and thorough." },
      { name: "Mike Davis", rating: 4, comment: "Great doctor, explains everything clearly." },
    ],
  },
  {
    id: 2,
    name: "Dr. Viola Dunn",
    specialty: "Therapist",
    rating: 5.0,
    avatar: "/placeholder.svg?height=60&width=60",
    phone: "+1 (555) 987-6543",
    email: "viola.dunn@clinic.com",
    about:
      "Dr. Viola Dunn is an experienced specialist who is constantly working to improve her skills and provide the best care for her patients.",
    location: "Lotus Medical Center, 3016.3, Cray St, Uts, Pennsylvania",
    distance: "1.2 km",
    reviews: [
      {
        name: "Joana Perkins",
        rating: 5,
        comment: "Highly professional and competent doctor. Excellent bedside manner.",
      },
      { name: "David Smith", rating: 5, comment: "Outstanding therapist, helped me tremendously." },
    ],
  },
]

const appointments = {
  upcoming: [
    {
      id: 1,
      doctor: "Dr. Chris Frazier",
      specialty: "Pediatrician",
      date: "Today",
      time: "2:30 PM",
      type: "Clinic Visit",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Viola Dunn",
      specialty: "Therapist",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Home Visit",
      status: "pending",
    },
  ],
  completed: [
    {
      id: 3,
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiologist",
      date: "Dec 10",
      time: "3:00 PM",
      type: "Clinic Visit",
      status: "completed",
    },
  ],
  canceled: [
    {
      id: 4,
      doctor: "Dr. Mike Johnson",
      specialty: "Dermatologist",
      date: "Dec 8",
      time: "11:00 AM",
      type: "Clinic Visit",
      status: "canceled",
    },
  ],
}

const medicalStores = [
  { name: "HealthPlus Pharmacy", distance: "0.3 km", open: true },
  { name: "MediCare Store", distance: "0.7 km", open: true },
  { name: "Wellness Pharmacy", distance: "1.1 km", open: false },
]

const medicalConcerns = [
  { title: "Winter Flu Prevention", description: "Tips to stay healthy during flu season", priority: "high" },
  { title: "Blood Pressure Monitoring", description: "Regular checkups recommended", priority: "medium" },
  { title: "Vitamin D Deficiency", description: "Common in winter months", priority: "low" },
  { title: "Mental Health Check", description: "Annual wellness screening", priority: "medium" },
]

const nhsNews = [
  {
    title: "New COVID-19 Variant Detected",
    summary: "Health officials monitoring new strain with enhanced surveillance",
    time: "2 hours ago",
    category: "Alert",
  },
  {
    title: "Winter Vaccination Campaign",
    summary: "Free flu shots available at all NHS centers through March",
    time: "5 hours ago",
    category: "Health",
  },
  {
    title: "Mental Health Support Expansion",
    summary: "New counseling services launched in 50 additional locations",
    time: "1 day ago",
    category: "Services",
  },
]

// Demo Wallet Switcher Component
function DemoWalletSwitcher({ onWalletSelect }: { onWalletSelect: (wallet: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Demo Wallets - </h3>
      <div className="grid gap-3">
        {DEMO_WALLETS.map((wallet, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
            onClick={() => onWalletSelect(wallet.address)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{wallet.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{wallet.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={wallet.role === "doctor" ? "destructive" : "default"} className="mb-1">
                    {wallet.role === "doctor" ? "Doctor" : "Patient"}
                  </Badge>
                  <p className="text-xs text-gray-400 font-mono">{wallet.address.slice(0, 8)}...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// View Switcher Component
function ViewSwitcher({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Button
        variant={currentView === "demo" ? "default" : "outline"}
        onClick={() => onViewChange("demo")}
        className="flex items-center space-x-2"
      >
        <Shuffle className="h-4 w-4" />
        <span>Demo Wallets</span>
      </Button>
      <Button
        variant={currentView === "connect" ? "default" : "outline"}
        onClick={() => onViewChange("connect")}
        className="flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
      <Button
        variant={currentView === "landing" ? "default" : "outline"}
        onClick={() => onViewChange("landing")}
        className="flex items-center space-x-2"
      >
        <Home className="h-4 w-4" />
        <span>Landing Page</span>
      </Button>
    </div>
  )
}

function AppContent() {
  const { publicKey, disconnect } = useWallet()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState("demo") // demo, connect, landing
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    type: "Clinic Visit",
    notes: "",
  })
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
  })

  const walletAddress = selectedWallet || publicKey?.toBase58() || ""

  // Check user role when wallet connects
  useEffect(() => {
    if (walletAddress) {
      checkUserRole(walletAddress)
    } else {
      setUserRole(null)
    }
  }, [walletAddress])

  const checkUserRole = async (address: string) => {
    setIsLoading(true)
    try {
      const role = await getUserRole(address)
      setUserRole(role)
      console.log(" - User role determined:", role, "for wallet:", address)
    } catch (error) {
      console.error(" - Error checking user role:", error)
      toast({
        title: "Error",
        description: "Failed to determine user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (selectedWallet) {
      setSelectedWallet(null)
    } else {
      disconnect()
    }
    setUserRole(null)
    toast({
      title: "Logged Out - ",
      description: "You have been successfully logged out.",
    })
  }

  const handleDemoWalletSelect = (walletAddress: string) => {
    setSelectedWallet(walletAddress)
    setCurrentView("connect") // Switch to connect view after selecting demo wallet
    toast({
      title: "Demo Wallet Selected - ",
      description: `Connected to demo wallet: ${walletAddress.slice(0, 8)}...`,
    })
  }

  const handleBookAppointment = () => {
    if (!selectedDoctor || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Appointment Booked! ",
      description: `Appointment with ${selectedDoctor.name} scheduled for ${appointmentForm.date} at ${appointmentForm.time}`,
    })

    setAppointmentDialogOpen(false)
    setAppointmentForm({ date: "", time: "", type: "Clinic Visit", notes: "" })
  }

  const handleSendMessage = () => {
    if (!selectedDoctor || !messageForm.subject || !messageForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent! ",
      description: `Your message has been sent to ${selectedDoctor.name}`,
    })

    setMessageDialogOpen(false)
    setMessageForm({ subject: "", message: "" })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading... </p>
        </div>
      </div>
    )
  }

  // Show role-specific dashboard if user is connected and role is determined
  if (walletAddress && userRole) {
    if (userRole === "doctor") {
      return <EnhancedDoctorDashboard walletAddress={walletAddress} onLogout={handleLogout} />
    } else {
      return <PatientNFTReports walletAddress={walletAddress} onLogout={handleLogout} />
    }
  }

  // Show connection interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Health Plus
                </h1>
                <p className="text-xs text-gray-500">Blockchain Medical Records - </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <TestTube className="h-3 w-3 mr-1" />
                Testnet
              </Badge>
              {walletAddress && (
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* View Switcher */}
        <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />

        {currentView === "demo" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <DemoWalletSwitcher onWalletSelect={handleDemoWalletSelect} />
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "connect" && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Health Plus</h2>
                  <p className="text-gray-600 mb-6">
                    Secure, blockchain-powered medical records. Connect your wallet to access your personalized
                    healthcare dashboard.
                  </p>
                </div>

                {selectedWallet ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Demo Wallet Connected:</p>
                      <p className="font-mono text-sm">{selectedWallet}</p>
                      <Badge variant="outline" className="mt-2">
                        {DEMO_WALLETS.find((w) => w.address === selectedWallet)?.role || "Unknown"}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => checkUserRole(selectedWallet)}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Checking Role...
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Enter Dashboard
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-green-600 hover:!from-blue-700 hover:!to-green-700 !rounded-lg !font-medium !px-6 !py-3 !text-white !border-0 !transition-all !duration-200 !transform hover:!scale-105" />
                    <p className="text-sm text-gray-500">
                      Or use a{" "}
                      <button
                        onClick={() => setCurrentView("demo")}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        demo wallet
                      </button>{" "}
                      to explore the platform
                    </p>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="font-medium">Secure Records</p>
                    <p className="text-gray-500">Blockchain-verified medical data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-medium">Role-Based Access</p>
                    <p className="text-gray-500">Doctor and patient portals</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TestTube className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="font-medium">Testnet Ready</p>
                    <p className="text-gray-500">Safe testing environment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "landing" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Your Health,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Connect with healthcare professionals, manage appointments, and access your medical records securely on
                the blockchain.  blesses your health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  onClick={() => setCurrentView("connect")}
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 bg-transparent"
                  onClick={() => setCurrentView("demo")}
                >
                  Try Demo
                  <TestTube className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Symptom Checker */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How are you feeling today?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {symptoms.map((symptom, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200 ${symptom.color}`}
                    >
                      <symptom.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{symptom.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Doctors */}
              <div className="lg:col-span-2 space-y-6">
                {/* Available Doctors */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Available Doctors</h2>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {doctors.map((doctor) => (
                        <Card
                          key={doctor.id}
                          className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                          onClick={() => {
                            setSelectedDoctor(doctor)
                            setDoctorDialogOpen(true)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                <p className="text-gray-600">{doctor.specialty}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {doctor.distance}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Book
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Appointments */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Appointments</h2>
                    <Tabs defaultValue="upcoming" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="canceled">Canceled</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upcoming" className="space-y-4 mt-4">
                        {appointments.upcoming.map((appointment) => (
                          <Card key={appointment.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{appointment.doctor}</h3>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                  <p className="text-sm text-gray-500">
                                    {appointment.date} at {appointment.time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    className={
                                      appointment.status === "confirmed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {appointment.status}
                                  </Badge>
                                  <p className="text-sm text-gray-500 mt-1">{appointment.type}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                      <TabsContent value="completed" className="space-y-4 mt-4">
                        {appointments.completed.map((appointment) => (
                          <Card key={appointment.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{appointment.doctor}</h3>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                  <p className="text-sm text-gray-500">
                                    {appointment.date} at {appointment.time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-gray-100 text-gray-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {appointment.status}
                                  </Badge>
                                  <p className="text-sm text-gray-500 mt-1">{appointment.type}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                      <TabsContent value="canceled" className="space-y-4 mt-4">
                        {appointments.canceled.map((appointment) => (
                          <Card key={appointment.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-500">{appointment.doctor}</h3>
                                  <p className="text-sm text-gray-400">{appointment.specialty}</p>
                                  <p className="text-sm text-gray-400">
                                    {appointment.date} at {appointment.time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    {appointment.status}
                                  </Badge>
                                  <p className="text-sm text-gray-400 mt-1">{appointment.type}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Medical Stores */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Medical Stores</h3>
                    <div className="space-y-3">
                      {medicalStores.map((store, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{store.name}</p>
                            <p className="text-xs text-gray-500">{store.distance}</p>
                          </div>
                          <Badge className={store.open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {store.open ? "Open" : "Closed"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Concerns */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Reminders</h3>
                    <div className="space-y-3">
                      {medicalConcerns.map((concern, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{concern.title}</h4>
                            <Badge
                              className={
                                concern.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : concern.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {concern.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{concern.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* NHS News */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health News</h3>
                    <div className="space-y-4">
                      {nhsNews.map((news, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{news.summary}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {news.category}
                            </Badge>
                            <span className="text-xs text-gray-400">{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Detail Dialog */}
      <Dialog open={doctorDialogOpen} onOpenChange={setDoctorDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Doctor Profile
            </DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Header */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} alt={selectedDoctor.name} />
                  <AvatarFallback className="text-xl">{selectedDoctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                  <p className="text-gray-600 text-lg">{selectedDoctor.specialty}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{selectedDoctor.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedDoctor.distance}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedDoctor.phone}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedDoctor.email}
                  </div>
                  <div className="flex items-start">
                    <Building2 className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <span>{selectedDoctor.location}</span>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600 text-sm">{selectedDoctor.about}</p>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-semibold mb-3">Patient Reviews</h3>
                <div className="space-y-3">
                  {selectedDoctor.reviews.map((review: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{review.name}</span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={() => {
                    setDoctorDialogOpen(false)
                    setAppointmentDialogOpen(true)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDoctorDialogOpen(false)
                    setMessageDialogOpen(true)
                  }}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Book Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-4">
              {/* Doctor Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium">{selectedDoctor.name}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
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
                    <option value="Clinic Visit">Clinic Visit</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="appointment-notes">Notes</Label>
                  <Textarea
                    id="appointment-notes"
                    placeholder="Additional notes or symptoms..."
                    rows={3}
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button onClick={handleBookAppointment} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Send Message
            </DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-4">
              {/* Doctor Info */}
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium">{selectedDoctor.name}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
              </div>

              {/* Message Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message-subject">Subject *</Label>
                  <Input
                    id="message-subject"
                    placeholder="Message subject"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="message-content">Message *</Label>
                  <Textarea
                    id="message-content"
                    placeholder="Type your message here..."
                    rows={5}
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button onClick={handleSendMessage} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="flex-1">
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

export default function App() {
  return (
    <SolanaWalletProvider>
      <AppContent />
    </SolanaWalletProvider>
  )
}
