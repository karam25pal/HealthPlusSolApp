"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Stethoscope,
  Calendar,
  MessageSquare,
  FileText,
  Send,
  User,
  Clock,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { createMedicalReportNFT } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"

interface DoctorDashboardProps {
  walletAddress: string
  onLogout: () => void
}

const mockPatients = [
  {
    id: 1,
    name: "Mr. Singh",
    wallet: "PatientWallet123456789012345678901234",
    age: 45,
    lastVisit: "2024-12-10",
    condition: "Hypertension",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Mrs. Kaur",
    wallet: "PatientWallet987654321098765432109876",
    age: 38,
    lastVisit: "2024-12-08",
    condition: "Diabetes",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mr. Sharma",
    wallet: "PatientWallet456789012345678901234567",
    age: 52,
    lastVisit: "2024-12-05",
    condition: "Arthritis",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockAppointments = [
  {
    id: 1,
    patient: "Mr. Singh",
    time: "10:00 AM",
    date: "Today",
    type: "Follow-up",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Mrs. Kaur",
    time: "2:30 PM",
    date: "Today",
    type: "Consultation",
    status: "pending",
  },
  {
    id: 3,
    patient: "Mr. Sharma",
    time: "11:00 AM",
    date: "Tomorrow",
    type: "Check-up",
    status: "confirmed",
  },
]

const mockMessages = [
  {
    id: 1,
    patient: "Mr. Singh",
    message: "Doctor, I'm experiencing some side effects from the new medication.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    patient: "Mrs. Kaur",
    message: "Thank you for the report. When should I schedule my next visit?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    patient: "Mr. Sharma",
    message: "The pain has reduced significantly. Thank you!",
    time: "1 day ago",
    unread: false,
  },
]

export function DoctorDashboard({ walletAddress, onLogout }: DoctorDashboardProps) {
  const { publicKey } = useWallet()
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null)
  const [reportForm, setReportForm] = useState({
    title: "",
    content: "",
    type: "General",
  })
  const [isCreatingNFT, setIsCreatingNFT] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleCreateReport = async () => {
    if (!selectedPatient || !publicKey) return

    setIsCreatingNFT(true)
    try {
      const nft = await createMedicalReportNFT(publicKey.toString(), selectedPatient.wallet, {
        title: reportForm.title,
        content: reportForm.content,
        date: new Date().toISOString().split("T")[0],
        doctorName: "Dr. Chris Frazier", // In real app, get from user profile
      })

      console.log("NFT Report created:", nft)

      // Reset form and close dialog
      setReportForm({ title: "", content: "", type: "General" })
      setReportDialogOpen(false)
      setSelectedPatient(null)

      // Show success message (you can implement toast notifications)
      alert(`Medical report NFT created and sent to ${selectedPatient.name}!`)
    } catch (error) {
      console.error("Error creating NFT report:", error)
      alert("Error creating report. Please try again.")
    } finally {
      setIsCreatingNFT(false)
    }
  }

  const openReportDialog = (patient: (typeof mockPatients)[0]) => {
    setSelectedPatient(patient)
    setReportDialogOpen(true)
  }

  const unreadMessages = mockMessages.filter((msg) => msg.unread).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-black to-red-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Health Plus</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  Doctor
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>CF</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Dr. Chris Frazier</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">Dr. Chris Frazier</p>
                    <p className="text-xs text-gray-500">Pediatrician</p>
                    <p className="text-xs text-gray-400 truncate">{walletAddress.slice(0, 20)}...</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 relative">
              <MessageSquare className="h-4 w-4" />
              Messages
              {unreadMessages > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockAppointments.filter((apt) => apt.date === "Today").length}
                  </div>
                  <p className="text-xs text-muted-foreground">2 confirmed, 1 pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockPatients.length}</div>
                  <p className="text-xs text-muted-foreground">Active patients</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unreadMessages}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.type} - {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Patients</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {mockPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-gray-500">
                            Age: {patient.age} • Last visit: {patient.lastVisit}
                          </p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openReportDialog(patient)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Send Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Messages</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg ${message.unread ? "bg-red-50 border-red-200" : "bg-gray-50"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{message.patient}</span>
                            {message.unread && (
                              <Badge variant="destructive" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                          <p className="text-xs text-gray-500">{message.time}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Create Medical Report NFT
            </DialogTitle>
            {selectedPatient && (
              <p className="text-sm text-gray-600">
                Creating report for: <span className="font-medium">{selectedPatient.name}</span>
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="report-type">Report Type</Label>
              <select
                id="report-type"
                className="w-full mt-1 p-2 border rounded-md"
                value={reportForm.type}
                onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Imaging">Imaging</option>
                <option value="Prescription">Prescription</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
            <div>
              <Label htmlFor="report-content">Report Content</Label>
              <Textarea
                id="report-content"
                placeholder="Enter detailed report content..."
                rows={6}
                value={reportForm.content}
                onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>NFT Report:</strong> This report will be minted as an NFT and sent directly to the patient's
                wallet, ensuring secure and verifiable medical records.
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateReport}
                disabled={!reportForm.title || !reportForm.content || isCreatingNFT}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isCreatingNFT ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating NFT...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create & Send NFT Report
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
