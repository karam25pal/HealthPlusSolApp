"use client"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PatientNFTReports } from "@/components/patient/patient-nft-reports"
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
  AlertTriangle,
  Globe,
  ChevronRight,
  Activity,
  MessageSquare,
  FileText,
  Settings,
  User,
  HelpCircle,
  AlertCircle,
  Bell,
  ChevronDown,
  LogOut,
  CreditCard,
  Send,
  Wallet,
} from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    category: "Breaking",
  },
  {
    title: "Mental Health Services Expansion",
    summary: "NHS announces increased funding for mental health support programs",
    time: "5 hours ago",
    category: "Healthcare",
  },
  {
    title: "Flu Vaccination Campaign Success",
    summary: "Record numbers receive flu vaccines this winter season",
    time: "1 day ago",
    category: "Prevention",
  },
  {
    title: "Digital Health Records Update",
    summary: "New patient portal features now available nationwide",
    time: "2 days ago",
    category: "Technology",
  },
]

const chatMessages = [
  {
    id: 1,
    sender: "AI Health Assistant",
    message:
      "Good morning Mr. Singh! Your blood pressure readings from last week show improvement. Keep up the great work with your medication routine.",
    time: "9:30 AM",
    type: "ai",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    sender: "Dr. Chris Frazier",
    message: "Hello Mr. Singh, your test results are ready. Please schedule a follow-up appointment to discuss them.",
    time: "Yesterday",
    type: "doctor",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    sender: "City General Hospital",
    message: "Reminder: Your annual health checkup is due next month. Would you like to schedule an appointment?",
    time: "2 days ago",
    type: "clinic",
    unread: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    sender: "AI Health Assistant",
    message:
      "New research suggests that your current exercise routine could be optimized. Would you like personalized recommendations?",
    time: "3 days ago",
    type: "ai",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function PatientDashboard() {
  const { connected, publicKey, disconnect } = useWallet()
  const [clinicVisitOpen, setClinicVisitOpen] = useState(false)
  const [homeVisitOpen, setHomeVisitOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [activeNavItem, setActiveNavItem] = useState("home")
  const [chatOpen, setChatOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const scheduleRef = useRef<HTMLDivElement>(null)

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom.label) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % nhsNews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = (navId: string) => {
    setActiveNavItem(navId)
    if (navId === "messages") {
      setChatOpen(true)
    } else if (navId === "schedule") {
      scheduleRef.current?.scrollIntoView({ behavior: "smooth" })
    } else if (navId === "reports") {
      const reportsSection = document.getElementById("nft-reports-section")
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleLogout = () => {
    disconnect()
    toast({
      title: "Disconnected - WAHEGURU JI",
      description: "Wallet disconnected successfully",
    })
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileText },
  ]

  const unreadCount = chatMessages.filter((msg) => msg.unread).length
  const patientName = "Mr. Singh"
  const effectiveWalletAddress = connected && publicKey ? publicKey.toString() : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-black to-red-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-black to-red-600 bg-clip-text text-transparent">
                Health Plus
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!connected ? (
                <WalletMultiButton className="!bg-gradient-to-r !from-gray-900 !to-black !text-green-400 !border !border-green-700 hover:!from-black hover:!to-gray-800 hover:!text-white !transition-all" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-red-50 transition-all duration-200 hover:scale-105"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-red-100">
                        <AvatarImage src="/patient-avatar.png" />
                        <AvatarFallback>
                          {effectiveWalletAddress ? effectiveWalletAddress.slice(0, 2).toUpperCase() : "MS"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <span className="font-medium text-sm block">
                          {effectiveWalletAddress
                            ? `${effectiveWalletAddress.slice(0, 4)}...${effectiveWalletAddress.slice(-4)}`
                            : patientName}
                        </span>
                        {effectiveWalletAddress && <span className="text-xs text-gray-500">Patient View</span>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Wallet Connected</p>
                        <p className="text-xs text-gray-500 truncate">{effectiveWalletAddress || "Not connected"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Your Account
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Your Reports
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Services
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-red-50 transition-colors cursor-pointer">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Medical Emergency
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing & Plans
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="hover:bg-red-50 transition-colors cursor-pointer text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-md mx-auto p-4 space-y-6 pb-20">
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">👋</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Good morning, {patientName}!</h1>
              <p className="text-sm text-gray-500">How are you feeling today?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="hover:bg-red-50 transition-colors">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar className="h-12 w-12 ring-2 ring-red-100 ring-offset-2 hover:ring-red-200 transition-all duration-300">
              <AvatarImage src="/patient-avatar.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {!connected && (
          <Card className="bg-gradient-to-r from-green-50 to-gray-50 border-2 border-green-200">
            <CardContent className="p-6 text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Connect Your Solana Wallet - WAHEGURU JI</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect your wallet to access NFT medical reports, secure appointments, and blockchain-verified health
                records.
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-gray-900 !to-black !text-green-400 !border !border-green-700 hover:!from-black hover:!to-gray-800 hover:!text-white !transition-all" />
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="bg-gradient-to-br from-black to-gray-800 text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={() => setClinicVisitOpen(true)}
          >
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-8 w-8 mx-auto mb-3 animate-pulse" />
              <h3 className="font-semibold mb-1">Clinic visit</h3>
              <p className="text-sm opacity-90">Make an appointment</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-red-600 to-red-700 text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={() => setHomeVisitOpen(true)}
          >
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-3 animate-pulse" />
              <h3 className="font-semibold mb-1">Home visit</h3>
              <p className="text-sm opacity-90">Call the doctor home</p>
            </CardContent>
          </Card>
        </div>
        {effectiveWalletAddress && <PatientNFTReports walletAddress={effectiveWalletAddress} />}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">What are your symptoms?</h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
              {symptoms.map((symptom, index) => (
                <Button
                  key={index}
                  variant={selectedSymptoms.includes(symptom.label) ? "default" : "outline"}
                  className={`flex-shrink-0 rounded-full snap-start transition-all duration-300 hover:scale-110 hover:shadow-md ${
                    selectedSymptoms.includes(symptom.label)
                      ? "bg-red-600 hover:bg-red-700 shadow-lg text-white"
                      : `${symptom.color} border-0 hover:bg-opacity-80`
                  }`}
                  onClick={() => toggleSymptom(symptom.label)}
                >
                  <symptom.icon className="h-4 w-4 mr-2" />
                  {symptom.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Popular doctors</h2>
          <div className="grid grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <CardContent className="p-4 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-gray-100 hover:ring-red-200 transition-all duration-300">
                    <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-sm mb-1">{doctor.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{doctor.specialty}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{doctor.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div
          ref={scheduleRef}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            Schedule
          </h2>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upcoming" className="text-xs hover:bg-red-50 transition-colors">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs hover:bg-gray-50 transition-colors">
                Completed
              </TabsTrigger>
              <TabsTrigger value="canceled" className="text-xs hover:bg-red-50 transition-colors">
                Canceled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-3">
              {appointments.upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">{apt.doctor}</p>
                      <p className="text-xs text-gray-500">
                        {apt.date} • {apt.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {apt.type}
                  </Badge>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="completed" className="space-y-3">
              {appointments.completed.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{apt.doctor}</p>
                      <p className="text-xs text-gray-500">
                        {apt.date} • {apt.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    {apt.type}
                  </Badge>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="canceled" className="space-y-3">
              {appointments.canceled.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium text-sm">{apt.doctor}</p>
                      <p className="text-xs text-gray-500">
                        {apt.date} • {apt.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-red-100">
                    {apt.type}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-red-600" />
                Nearest Doctors
              </h3>
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 hover:scale-110 transition-transform duration-200">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.specialty}</p>
                      </div>
                    </div>
                    <span className="text-xs text-red-600 font-medium">{doctor.distance}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4 text-gray-600" />
                Medical Stores
              </h3>
              <div className="space-y-2">
                {medicalStores.map((store, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-medium">{store.name}</p>
                      <p className="text-xs text-gray-500">{store.distance}</p>
                    </div>
                    <Badge
                      variant={store.open ? "default" : "secondary"}
                      className={`text-xs hover:scale-105 transition-transform ${
                        store.open ? "bg-gray-800 text-white" : ""
                      }`}
                    >
                      {store.open ? "Open" : "Closed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Suggested Medical Concerns
          </h2>
          <div className="space-y-3">
            {medicalConcerns.map((concern, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{concern.title}</p>
                  <p className="text-xs text-gray-500">{concern.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      concern.priority === "high"
                        ? "destructive"
                        : concern.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className={`text-xs hover:scale-105 transition-transform ${
                      concern.priority === "medium" ? "bg-gray-800 text-white" : ""
                    }`}
                  >
                    {concern.priority}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-600" />
            Latest Health News
          </h2>
          <div className="relative h-32">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentNewsIndex * 100}%)` }}
            >
              {nhsNews.map((news, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg hover:from-gray-100 hover:to-red-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs hover:scale-105 transition-transform">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{news.time}</span>
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{news.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{news.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {nhsNews.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                  index === currentNewsIndex ? "bg-red-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentNewsIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-2 hover:bg-red-50 transition-all duration-200 hover:scale-110 relative ${
                  activeNavItem === item.id ? "text-red-600 bg-red-50" : "text-gray-600"
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.id === "messages" && unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </nav>
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              Messages
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                  message.unread ? "bg-red-50 border-l-4 border-red-600" : "bg-gray-50"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {message.type === "ai"
                      ? "AI"
                      : message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                  {message.type === "ai" && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      AI Assistant
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-2 border-t">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={clinicVisitOpen} onOpenChange={setClinicVisitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Clinic Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor-select">Select Doctor</Label>
              <select
                id="doctor-select"
                className="w-full mt-1 p-2 border rounded-md hover:border-red-300 transition-colors"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="appointment-date">Preferred Date</Label>
              <Input id="appointment-date" type="date" className="mt-1 hover:border-red-300 transition-colors" />
            </div>
            <div>
              <Label htmlFor="appointment-time">Preferred Time</Label>
              <Input id="appointment-time" type="time" className="mt-1 hover:border-red-300 transition-colors" />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Describe your symptoms or reason for visit"
                className="mt-1 hover:border-red-300 transition-colors"
              />
            </div>
            <Button className="w-full bg-black hover:bg-gray-800 hover:scale-105 transition-all duration-200">
              Book Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={homeVisitOpen} onOpenChange={setHomeVisitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Home Visit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="home-doctor-select">Select Doctor</Label>
              <select
                id="home-doctor-select"
                className="w-full mt-1 p-2 border rounded-md hover:border-red-300 transition-colors"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="home-address">Home Address</Label>
              <Textarea
                id="home-address"
                placeholder="Enter your complete address"
                className="mt-1 hover:border-red-300 transition-colors"
              />
            </div>
            <div>
              <Label htmlFor="home-date">Preferred Date</Label>
              <Input id="home-date" type="date" className="mt-1 hover:border-red-300 transition-colors" />
            </div>
            <div>
              <Label htmlFor="home-time">Preferred Time</Label>
              <Input id="home-time" type="time" className="mt-1 hover:border-red-300 transition-colors" />
            </div>
            <div>
              <Label htmlFor="home-reason">Reason for Home Visit</Label>
              <Textarea
                id="home-reason"
                placeholder="Describe your condition and why you need a home visit"
                className="mt-1 hover:border-red-300 transition-colors"
              />
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Level</Label>
              <select
                id="emergency"
                className="w-full mt-1 p-2 border rounded-md hover:border-red-300 transition-colors"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200">
              Request Home Visit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedDoctor && (
            <>
              <DialogHeader className="text-center pb-4">
                <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-red-100 hover:ring-red-200 transition-all duration-300">
                  <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedDoctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <DialogTitle className="text-xl">{selectedDoctor.name}</DialogTitle>
                <p className="text-gray-500">{selectedDoctor.specialty}</p>
              </DialogHeader>
              <div className="flex gap-3 justify-center mb-6">
                <Button
                  size="sm"
                  className="rounded-full bg-red-600 hover:bg-red-700 hover:scale-110 transition-all duration-200"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full bg-transparent hover:scale-110 transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full bg-transparent hover:scale-110 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About doctor</h3>
                <p className="text-sm text-gray-600">{selectedDoctor.about}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition-colors">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedDoctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition-colors">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span>{selectedDoctor.email}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedDoctor.rating}</span>
                    <span className="text-sm text-gray-500">({selectedDoctor.reviews.length})</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedDoctor.reviews.map((review, index) => (
                    <div key={index} className="border-l-2 border-gray-100 pl-3 hover:border-red-200 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{review.name}</span>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="flex items-start gap-2 hover:bg-gray-50 p-2 rounded transition-colors">
                  <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Clinic Address</p>
                    <p className="text-xs text-gray-600">{selectedDoctor.location}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200">
                Book Appointment
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
