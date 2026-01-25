"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Download,
  Check,
  XIcon,
  Clock,
  Save,
  MessageCircle,
  Trash2,
  Plus,
  Globe,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ImagePreview } from "./image-preview"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const glassCard = "bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-xl"

interface Member {
  id: string
  full_name: string
  email: string
  phone_number: string
  car_variant: string
  year_car: string
  license_plate: string
  city: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  deleted_at?: string | null
  photo_url?: string
}

interface CMSAbout {
  id: string
  title: string
  description: string
  button_text: string
}

interface CMSBenefit {
  id: string
  title: string
  description: string
  icon_type: string
  sort_order: number
}

interface CMSSocial {
  id: string
  platform: string
  url: string
  icon_type: string
}

interface ContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  message: string
  created_at: string
}

interface Event {
  id: string
  title: string
  description: string
  icon: string
  created_at: string
}

interface ContactSection {
  id: string
  title: string
  description: string
  phone: string
  email: string
}

interface MembershipSection {
  id: string
  title: string
  description: string
  stats: Array<{ label: string; value: string }>
}

interface Logo {
  id: string
  text: string
  subtext: string
  image_url?: string
}

interface Hero {
  id: string
  title: string
  description: string
  button_text: string
  background_image_url?: string
}

interface Footer {
  id: string
  company_name: string
  description: string
  phone: string
  email: string
  address: string
  copyright_year: number
  copyright_text: string
}

// Add GalleryItem interface
interface GalleryItem {
  id: string
  image_url: string
  title: string
  description: string
  sort_order: number
  created_at: string
}

const translations = {
  en: {
    dashboard: "Dashboard",
    members: "Members",
    messages: "Messages",
    gallery: "Gallery",
    content: "Content",
    settings: "Settings",
    logout: "Logout",
    dashboardOverview: "Dashboard Overview",
    startDate: "Start Date",
    endDate: "End Date",
    clearFilters: "Clear Filters",
    totalMembers: "Total Members",
    pendingApprovals: "Pending Approvals",
    approvedMembers: "Approved Members",
    totalEvents: "Total Events",
    recentRegistrations: "Recent Registrations",
    imageGallery: "Image Gallery",
    dragDrop: "Drag & drop images here",
    selectImages: "Select Images",
    existingImages: "Existing Images",
    contactMessages: "Contact Messages",
    noMessages: "No messages yet",
    name: "Name",
    email: "Email",
    message: "Message",
    date: "Date",
    memberManagement: "Member Management",
    exportCSV: "Export to CSV",
    searchPlaceholder: "Search by name, email, or license plate...",
    allStatus: "All Status",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    phone: "Phone",
    carVariant: "Car Variant",
    year: "Year",
    licensePlate: "License Plate",
    city: "City",
    registered: "Registered",
    status: "Status",
    actions: "Actions",
    photo: "Photo",
    showing: "Showing",
    of: "of",
  },
  id: {
    dashboard: "Dasbor",
    members: "Anggota",
    messages: "Pesan",
    gallery: "Galeri",
    content: "Konten",
    settings: "Pengaturan",
    logout: "Keluar",
    dashboardOverview: "Ringkasan Dasbor",
    startDate: "Tanggal Mulai",
    endDate: "Tanggal Akhir",
    clearFilters: "Hapus Filter",
    totalMembers: "Total Anggota",
    pendingApprovals: "Persetujuan Tertunda",
    approvedMembers: "Anggota yang Disetujui",
    totalEvents: "Total Acara",
    recentRegistrations: "Pendaftaran Terbaru",
    imageGallery: "Galeri Gambar",
    dragDrop: "Seret & lepas gambar di sini",
    selectImages: "Pilih Gambar",
    existingImages: "Gambar yang Ada",
    contactMessages: "Pesan Kontak",
    noMessages: "Belum ada pesan",
    name: "Nama",
    email: "Email",
    message: "Pesan",
    date: "Tanggal",
    memberManagement: "Manajemen Anggota",
    exportCSV: "Ekspor ke CSV",
    searchPlaceholder: "Cari berdasarkan nama, email, atau plat nomor...",
    allStatus: "Semua Status",
    pending: "Tertunda",
    approved: "Disetujui",
    rejected: "Ditolak",
    phone: "Telepon",
    carVariant: "Varian Mobil",
    year: "Tahun",
    licensePlate: "Plat Nomor",
    city: "Kota",
    registered: "Terdaftar",
    status: "Status",
    actions: "Tindakan",
    photo: "Foto",
    showing: "Menampilkan",
    of: "dari",
  },
}

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingApprovals: 0,
    approvedMembers: 0,
    totalEvents: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [messageStartDate, setMessageStartDate] = useState("")
  const [messageEndDate, setMessageEndDate] = useState("")

  const [about, setAbout] = useState<CMSAbout>({ id: "", title: "", description: "", button_text: "" })
  const [benefits, setBenefits] = useState<CMSBenefit[]>([])
  const [socialMedia, setSocialMedia] = useState<CMSSocial[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [contact, setContact] = useState<ContactSection>({ id: "", title: "", description: "", phone: "", email: "" })
  const [membership, setMembership] = useState<MembershipSection>({ id: "", title: "", description: "", stats: [] })
  const [logo, setLogo] = useState<Logo>({ id: "", text: "", subtext: "", image_url: "" })
  const [hero, setHero] = useState<Hero>({ id: "", title: "", description: "", button_text: "" })
  const [footer, setFooter] = useState<Footer>({
    id: "",
    company_name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    copyright_year: new Date().getFullYear(),
    copyright_text: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: "", description: "", icon: "" })
  const [showNewEventForm, setShowNewEventForm] = useState(false)

  // Add gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  // Add language state and authentication state
  const [language, setLanguage] = useState<"en" | "id">("en")
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const t = (key: keyof (typeof translations)["en"]) => translations[language][key]

  useEffect(() => {
    checkAuth()
    fetchAllData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/middleware", { method: "POST" })
      if (response.status === 401) {
        setIsAuthenticated(false)
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("[Admin] Auth check error:", error)
      // Optionally redirect to login if auth check fails
      // window.location.href = "/login";
    }
  }

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([fetchStats(), fetchMembers(), fetchCMSData()])
    } catch (error) {
      console.error("[Admin] Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCMSData = async () => {
    try {
      console.log("[Admin] Fetching CMS data...")
      const results = await Promise.allSettled([
        fetch("/api/cms/about").then((r) => r.json()),
        fetch("/api/cms/benefits").then((r) => r.json()),
        fetch("/api/cms/social-media").then((r) => r.json()),
        fetch("/api/contact").then((r) => r.json()),
        fetch("/api/cms/events").then((r) => r.json()),
        fetch("/api/cms/contact").then((r) => r.json()),
        fetch("/api/cms/membership").then((r) => r.json()),
        fetch("/api/cms/logo").then((r) => r.json()),
        fetch("/api/cms/hero").then((r) => r.json()),
        fetch("/api/cms/footer").then((r) => r.json()),
        fetch("/api/cms/gallery").then((r) => r.json()),
      ])

      const [
        aboutRes,
        benefitsRes,
        socialRes,
        messagesRes,
        eventsRes,
        contactRes,
        membershipRes,
        logoRes,
        heroRes,
        footerRes,
        galleryRes, // Added gallery response
      ] = results

      if (aboutRes.status === "fulfilled") {
        setAbout(aboutRes.value || { id: "", title: "About Us", description: "", button_text: "Learn More" })
      }
      if (benefitsRes.status === "fulfilled") {
        setBenefits(benefitsRes.value?.data || [])
      }
      if (socialRes.status === "fulfilled") {
        setSocialMedia(socialRes.value?.data || [])
      }
      if (messagesRes.status === "fulfilled") {
        setContactMessages(messagesRes.value?.data || [])
      }
      if (eventsRes.status === "fulfilled") {
        setEvents(eventsRes.value?.data || [])
      }
      if (contactRes.status === "fulfilled") {
        setContact(contactRes.value || { id: "", title: "Contact Us", description: "", phone: "", email: "" })
      }
      if (membershipRes.status === "fulfilled") {
        setMembership(membershipRes.value || { id: "", title: "Membership", description: "", stats: [] })
      }
      if (logoRes.status === "fulfilled") {
        setLogo(logoRes.value || { id: "", text: "MBW", subtext: "Motorsport", image_url: "" })
      }
      if (heroRes.status === "fulfilled") {
        const heroData = heroRes.value || {
          id: "default",
          title: "Your Journey Starts Here",
          description: "",
          button_text: "Continue Registration →",
        }
        setHero(heroData)
      }
      if (footerRes.status === "fulfilled") {
        setFooter(
          footerRes.value || {
            id: "",
            company_name: "Mercedes-Benz W205CI Club Indonesia",
            description: "Your Ultimate Community for W205CI Enthusiasts",
            phone: "+62 123 456 7890",
            email: "contact@mbw205ci.id",
            address: "Indonesia",
            copyright_year: new Date().getFullYear(),
            copyright_text: "Mercedes-Benz W205CI Club Indonesia. All rights reserved.",
          },
        )
      }

      if (galleryRes.status === "fulfilled") {
        setGallery(galleryRes.value?.data || [])
      }

      console.log("[Admin] CMS data fetched successfully")
    } catch (error) {
      console.error("[Admin] Error fetching CMS data:", error)
      setAbout({ id: "default", title: "About Us", description: "", button_text: "Learn More" })
      setBenefits([])
      setSocialMedia([])
      setContactMessages([])
      setEvents([])
      setContact({ id: "default", title: "Contact Us", description: "", phone: "", email: "" })
      setMembership({ id: "default", title: "Membership", description: "", stats: [] })
      setLogo({ id: "default", text: "MBW", subtext: "Motorsport", image_url: "" })
      setHero({
        id: "default",
        title: "Your Journey Starts Here",
        description: "",
        button_text: "Continue Registration →",
      })
      setFooter({
        id: "default",
        company_name: "Mercedes-Benz W205CI Club Indonesia",
        description: "Your Ultimate Community for W205CI Enthusiasts",
        phone: "+62 123 456 7890",
        email: "contact@mbw205ci.id",
        address: "Indonesia",
        copyright_year: new Date().getFullYear(),
        copyright_text: "Mercedes-Benz W205CI Club Indonesia. All rights reserved.",
      })
      // Set default for gallery
      setGallery([])
    }
  }

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      const response = await fetch(`/api/admin/stats?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("[Admin] Error fetching stats:", error)
    }
  }

  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      const response = await fetch(`/api/admin/members?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data.data || [])
      }
    } catch (error) {
      console.error("[Admin] Error fetching members:", error)
    }
  }

  const approveMember = async (id: string) => {
    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id, status: "approved" }),
      })
      if (response.ok) {
        setMembers(members.map((m) => (m.id === id ? { ...m, status: "approved" } : m)))
        await fetchStats()
      }
    } catch (error) {
      console.error("[Admin] Error approving member:", error)
    }
  }

  const rejectMember = async (id: string) => {
    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id, status: "rejected" }),
      })
      if (response.ok) {
        setMembers(members.map((m) => (m.id === id ? { ...m, status: "rejected" } : m)))
        await fetchStats()
      }
    } catch (error) {
      console.error("[Admin] Error rejecting member:", error)
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member? This action can be undone.")) return

    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id, action: "delete" }),
      })
      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id))
        await fetchStats()
        alert("Member deleted successfully")
      } else {
        alert("Failed to delete member")
      }
    } catch (error) {
      console.error("[Admin] Error deleting member:", error)
      alert("Failed to delete member")
    }
  }

  const updateAbout = async () => {
    if (!about || !about.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      })
      if (response.ok) {
        alert("About section updated successfully")
      } else {
        alert("Failed to update about section")
      }
    } catch (error) {
      alert("Failed to update about section")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBenefitChange = (id: string, field: keyof CMSBenefit, value: any) => {
    setBenefits(benefits.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const saveBenefit = async (benefitId: string) => {
    const benefit = benefits.find((b) => b.id === benefitId)
    if (!benefit) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/benefits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(benefit),
      })
      if (response.ok) {
        alert("Benefit updated successfully")
      } else {
        alert("Failed to update benefit")
      }
    } catch (error) {
      alert("Failed to update benefit")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteBenefit = async (benefitId: string) => {
    if (!confirm("Are you sure you want to delete this benefit?")) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/cms/benefits?id=${benefitId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setBenefits(benefits.filter((b) => b.id !== benefitId))
        alert("Benefit deleted successfully")
      } else {
        alert("Failed to delete benefit")
      }
    } catch (error) {
      alert("Failed to delete benefit")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSocialMedia = async (socialId: string, url: string) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/social-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: socialId, url }),
      })
      if (response.ok) {
        setSocialMedia(socialMedia.map((s) => (s.id === socialId ? { ...s, url } : s)))
        alert("Social media link updated successfully")
      } else {
        alert("Failed to update social media link")
      }
    } catch (error) {
      alert("Failed to update social media link")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEventChange = (id: string, field: keyof Event, value: any) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const saveEvent = async (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
      if (response.ok) {
        alert("Event updated successfully")
      } else {
        alert("Failed to update event")
      }
    } catch (error) {
      alert("Failed to update event")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/cms/events?id=${eventId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setEvents(events.filter((e) => e.id !== eventId))
        alert("Event deleted successfully")
      } else {
        alert("Failed to delete event")
      }
    } catch (error) {
      alert("Failed to delete event")
    } finally {
      setIsSaving(false)
    }
  }

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      alert("Please fill in all fields")
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      })
      if (response.ok) {
        const createdEvent = await response.json()
        setEvents([createdEvent, ...events])
        setNewEvent({ title: "", description: "", icon: "" })
        setShowNewEventForm(false)
        alert("Event created successfully")
      } else {
        alert("Failed to create event")
      }
    } catch (error) {
      alert("Failed to create event")
    } finally {
      setIsSaving(false)
    }
  }

  const updateContact = async () => {
    if (!contact || !contact.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (response.ok) {
        alert("Contact section updated successfully")
      } else {
        alert("Failed to update contact section")
      }
    } catch (error) {
      alert("Failed to update contact section")
    } finally {
      setIsSaving(false)
    }
  }

  const updateMembership = async () => {
    if (!membership || !membership.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/membership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membership),
      })
      if (response.ok) {
        alert("Membership section updated successfully")
      } else {
        alert("Failed to update membership section")
      }
    } catch (error) {
      alert("Failed to update membership section")
    } finally {
      setIsSaving(false)
    }
  }

  const updateLogo = async () => {
    if (!logo || !logo.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/logo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logo),
      })
      if (response.ok) {
        alert("Logo updated successfully")
      } else {
        alert("Failed to update logo")
      }
    } catch (error) {
      alert("Failed to update logo")
    } finally {
      setIsSaving(false)
    }
  }

  const updateHero = async () => {
    if (!hero || !hero.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      })
      if (response.ok) {
        // Trigger storage event to notify other tabs
        localStorage.setItem('hero-updated', Date.now().toString())
        localStorage.removeItem('hero-updated')
        alert("Hero section updated successfully")
      } else {
        alert("Failed to update hero section")
      }
    } catch (error) {
      alert("Failed to update hero section")
    } finally {
      setIsSaving(false)
    }
  }

  const updateFooter = async () => {
    if (!footer || !footer.id) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/cms/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer),
      })
      if (response.ok) {
        alert("Footer section updated successfully")
      } else {
        alert("Failed to update footer section")
      }
    } catch (error) {
      alert("Failed to update footer section")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.clear()
      window.location.href = "/login"
    } catch (error) {
      console.error("[Admin] Logout error:", error)
      window.location.href = "/login"
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredMessages = contactMessages.filter((message) => {
    if (!messageStartDate && !messageEndDate) return true
    const messageDate = new Date(message.created_at)
    if (messageStartDate) {
      const start = new Date(messageStartDate)
      if (messageDate < start) return false
    }
    if (messageEndDate) {
      const end = new Date(messageEndDate)
      end.setHours(23, 59, 59, 999)
      if (messageDate > end) return false
    }
    return true
  })

  const exportToCSV = () => {
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Car Variant",
      "Year",
      "License Plate",
      "City",
      "Status",
      "Registration Date",
    ]
    const rows = members.map((m) => [
      m.full_name,
      m.email,
      m.phone_number,
      m.car_variant,
      m.year_car,
      m.license_plate,
      m.city,
      m.status,
      new Date(m.created_at).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `members_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // handleGalleryUpload function
  const handleGalleryUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setIsSaving(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Create FormData with the file directly
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""))

        console.log(`[Admin] Uploading ${file.name}, size: ${file.size} bytes`)

        const response = await fetch("/api/cms/gallery/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const newImage = await response.json()
          setGallery((prev) => [newImage, ...prev])
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error(`[Admin] Failed to upload ${file.name}:`, errorData)
          alert(`Failed to upload ${file.name}: ${errorData.error || 'Unknown error'}`)
        }
      }
      alert(`Successfully uploaded ${files.length} image(s)`)
    } catch (error) {
      console.error("[Admin] Gallery upload error:", error)
      alert("Failed to upload images")
    } finally {
      setIsSaving(false)
    }
  }

  // deleteGalleryImage function
  const deleteGalleryImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/cms/gallery?id=${imageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setGallery(gallery.filter((img) => img.id !== imageId))
        alert("Image deleted successfully")
      } else {
        alert("Failed to delete image")
      }
    } catch (error) {
      console.error("[Admin] Gallery delete error:", error)
      alert("Failed to delete image")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#0f0f0f] text-white transition-all duration-300 border-r border-white/5 flex flex-col relative z-20 shadow-2xl`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && <h1 className="text-xl font-bold">MBW Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white/10 p-2 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-2">
          {[
            { icon: Calendar, label: "dashboard", id: "overview" },
            { icon: Users, label: "members", id: "members" },
            { icon: MessageCircle, label: "messages", id: "messages" },
            // Added Gallery tab to sidebar
            { icon: FileText, label: "gallery", id: "gallery" },
            { icon: FileText, label: "content", id: "content" },
            { icon: Settings, label: "settings", id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? "bg-primary text-white" : "text-white/70 hover:bg-white/10"
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{t(item.label as any)}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Globe className="w-4 h-4" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "id")}
                className="bg-transparent text-white text-sm border-none outline-none flex-1"
              >
                <option value="en" className="text-black">
                  English
                </option>
                <option value="id" className="text-black">
                  Bahasa Indonesia
                </option>
              </select>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-3 rounded-lg text-white/70 hover:bg-white/10 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("logout")}</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div {...fadeIn}>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-6">{t("dashboardOverview")}</h1>

                <Card className={`p-6 ${glassCard} mb-6`}>
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-foreground mb-2">{t("startDate")}</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value)
                          fetchStats()
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-foreground mb-2">{t("endDate")}</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value)
                          fetchStats()
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate("")
                          setEndDate("")
                          fetchStats()
                        }}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                      >
                        {t("clearFilters")}
                      </button>
                    )}
                  </div>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
                  <Card className={`p-6 ${glassCard} hover:scale-[1.02] transition-transform duration-300 group`}>
                    <p className="text-foreground/60 text-sm mb-2 uppercase tracking-wider">{t("totalMembers")}</p>
                    <p className="text-4xl font-serif font-bold text-primary group-hover:text-primary/80 transition-colors">{stats.totalMembers}</p>
                  </Card>
                  <Card className={`p-6 ${glassCard} hover:scale-[1.02] transition-transform duration-300 group`}>
                    <p className="text-foreground/60 text-sm mb-2 uppercase tracking-wider">{t("pendingApprovals")}</p>
                    <p className="text-4xl font-serif font-bold text-accent group-hover:text-accent/80 transition-colors">{stats.pendingApprovals}</p>
                  </Card>
                  <Card className={`p-6 ${glassCard} hover:scale-[1.02] transition-transform duration-300 group`}>
                    <p className="text-foreground/60 text-sm mb-2 uppercase tracking-wider">{t("approvedMembers")}</p>
                    <p className="text-4xl font-serif font-bold text-emerald-600 group-hover:text-emerald-500 transition-colors">{stats.approvedMembers}</p>
                  </Card>
                  <Card className={`p-6 ${glassCard} hover:scale-[1.02] transition-transform duration-300 group`}>
                    <p className="text-foreground/60 text-sm mb-2 uppercase tracking-wider">{t("totalEvents")}</p>
                    <p className="text-4xl font-serif font-bold text-blue-600 group-hover:text-blue-500 transition-colors">{stats.totalEvents}</p>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className={`p-6 ${glassCard}`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">{t("recentRegistrations")}</h2>
                  <div className="space-y-4">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          {member.photo_url && (
                            <div
                              className="cursor-pointer hover:opacity-80 transition"
                              onClick={() => setPreviewImage(member.photo_url || null)}
                            >
                              <ImagePreview src={member.photo_url || "/placeholder.svg"} alt={member.full_name} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{member.full_name}</p>
                            <p className="text-sm text-foreground/60">{member.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${member.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : member.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {t(member.status as "pending" | "approved" | "rejected")}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <motion.div {...fadeIn}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-serif font-bold text-foreground">{t("memberManagement")}</h1>
                  <Button onClick={exportToCSV} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Download className="w-4 h-4 mr-2" />
                    {t("exportCSV")}
                  </Button>
                </div>

                {/* Search and Filter */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                        <input
                          type="text"
                          placeholder={t("searchPlaceholder")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="all">{t("allStatus")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="approved">{t("approved")}</option>
                        <option value="rejected">{t("rejected")}</option>
                      </select>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-foreground mb-2">{t("startDate")}</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value)
                            fetchMembers()
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-foreground mb-2">{t("endDate")}</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value)
                            fetchMembers()
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Members Table */}
                <Card className={`${glassCard} overflow-hidden`}>
                  {
                    isLoading ? (
                      <div className="p-12 text-center" >
                        <p className="text-foreground/60">Loading members...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-foreground/5 border-b border-border sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[80px]">
                                {t("photo")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[120px]">
                                {t("name")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[150px]">
                                {t("email")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[110px]">
                                {t("phone")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[120px]">
                                {t("carVariant")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[80px]">
                                {t("year")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[110px]">
                                {t("licensePlate")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[100px]">
                                {t("city")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[120px]">
                                {t("registered")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[90px]">
                                {t("status")}
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[120px]">
                                {t("actions")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMembers.length > 0 ? (
                              filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b border-border hover:bg-foreground/5 transition">
                                  <td className="px-4 py-3">
                                    {member.photo_url ? (
                                      <div
                                        className="cursor-pointer hover:opacity-80 transition inline-block group relative"
                                        onClick={() => setPreviewImage(member.photo_url || null)}
                                        title="Click to view full image"
                                      >
                                        <ImagePreview src={member.photo_url || "/placeholder.svg"} alt={member.full_name} />
                                        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                          <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition">
                                            View
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs text-white/60 border border-white/10">
                                        No Photo
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 font-medium text-foreground">{member.full_name}</td>
                                  <td className="px-4 py-3 text-foreground/70 text-xs">{member.email}</td>
                                  <td className="px-4 py-3 text-foreground">{member.phone_number}</td>
                                  <td className="px-4 py-3 text-foreground text-sm">{member.car_variant}</td>
                                  <td className="px-4 py-3 text-foreground">{member.year_car}</td>
                                  <td className="px-4 py-3 text-foreground font-mono text-sm">{member.license_plate}</td>
                                  <td className="px-4 py-3 text-foreground text-sm">{member.city}</td>
                                  <td className="px-4 py-3 text-foreground/70 text-sm">
                                    {new Date(member.created_at).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${member.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : member.status === "approved"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                      {member.status === "pending" && <Clock className="w-3 h-3" />}
                                      {member.status === "approved" && <Check className="w-3 h-3" />}
                                      {member.status === "rejected" && <XIcon className="w-3 h-3" />}
                                      {t(member.status)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2 flex-wrap">
                                      {member.status === "pending" && (
                                        <>
                                          <button
                                            onClick={() => approveMember(member.id)}
                                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                                            title="Approve"
                                          >
                                            <Check className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => rejectMember(member.id)}
                                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                            title="Reject"
                                          >
                                            <XIcon className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => deleteMember(member.id)}
                                        className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition"
                                        title="Delete member"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={11} className="px-4 py-8 text-center text-foreground/60">
                                  No members found matching your filters
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                </Card >

                {
                  filteredMembers.length > 0 && (
                    <div className="text-sm text-foreground/60 text-center">
                      {t("showing")} {filteredMembers.length} {t("of")} {members.length}
                    </div>
                  )
                }
              </motion.div >
            </TabsContent >

            {/* Messages Tab */}
            < TabsContent value="messages" className="space-y-6" >
              <motion.div {...fadeIn}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-serif font-bold text-foreground">{t("contactMessages")}</h1>
                </div>

                <Card className={`p-6 ${glassCard} mb-6`}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-foreground mb-2">{t("startDate")}</label>
                      <input
                        type="date"
                        value={messageStartDate}
                        onChange={(e) => setMessageStartDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-foreground mb-2">{t("endDate")}</label>
                      <input
                        type="date"
                        value={messageEndDate}
                        onChange={(e) => setMessageEndDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    {(messageStartDate || messageEndDate) && (
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setMessageStartDate("")
                            setMessageEndDate("")
                          }}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                        >
                          {t("clearFilters")}
                        </button>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className={`${glassCard} overflow-hidden`}>
                  {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                      <MessageCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                      <p className="text-foreground/60">
                        {contactMessages.length === 0 ? t("noMessages") : "No messages in selected date range"}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-foreground/5 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("name")}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("email")}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("message")}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("date")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMessages.map((message) => (
                            <tr key={message.id} className="border-b border-border hover:bg-foreground/5 transition">
                              <td className="px-6 py-4 font-medium text-foreground">
                                {message.first_name} {message.last_name}
                              </td>
                              <td className="px-6 py-4 text-foreground/70">{message.email}</td>
                              <td className="px-6 py-4 text-foreground text-sm max-w-xs">
                                <div className="truncate hover:text-clip" title={message.message}>
                                  {message.message}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-foreground/70 text-sm">
                                {new Date(message.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                {filteredMessages.length > 0 && (
                  <div className="text-sm text-foreground/60 text-center">
                    {t("showing")} {filteredMessages.length} {t("of")} {contactMessages.length}
                  </div>
                )}
              </motion.div>
            </TabsContent >

            {/* Gallery Tab (NEW) */}
            < TabsContent value="gallery" className="space-y-6" >
              <motion.div {...fadeIn}>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-6">{t("imageGallery")}</h1>

                <Card className={`p-6 ${glassCard} mb-6`}>
                  <div
                    className="flex items-center justify-center h-48 md:h-64 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 transition cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add("bg-primary/20")
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("bg-primary/20")
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("bg-primary/20")
                      const files = e.dataTransfer.files
                      if (files) handleGalleryUpload(files)
                    }}
                  >
                    <input
                      type="file"
                      id="galleryUpload"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleGalleryUpload(e.target.files)
                      }}
                    />
                    <label
                      htmlFor="galleryUpload"
                      className="cursor-pointer w-full h-full flex items-center justify-center"
                    >
                      <div className="text-center">
                        <Plus className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                        <p className="text-foreground mb-2 font-medium">{t("dragDrop")}</p>
                        <p className="text-sm text-foreground/60 mb-4">or click to select files (Max 5MB per image)</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          {t("selectImages")}
                        </Button>
                      </div>
                    </label>
                  </div>
                </Card>

                <Card className={`p-6 ${glassCard}`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {t("existingImages")} ({gallery.length})
                  </h2>
                  {gallery.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-foreground/60">No images in gallery yet. Upload some to get started!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.map((item) => (
                        <div key={item.id} className="group relative rounded-lg overflow-hidden bg-white/5">
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-48 object-cover group-hover:opacity-75 transition"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => deleteGalleryImage(item.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
                              title="Delete image"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="p-3 bg-white/80 backdrop-blur-sm">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-foreground/60">{new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent >

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <motion.div {...fadeIn}>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Content Management</h1>



                {/* Header Logo Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Header Logo & Description</h2>
                  {logo &&
                    logo.id && ( // Check for logo.id to ensure it's loaded
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Logo Text</label>
                          <input
                            type="text"
                            value={logo.text}
                            onChange={(e) => setLogo({ ...logo, text: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Logo Subtext</label>
                          <input
                            type="text"
                            value={logo.subtext}
                            onChange={(e) => setLogo({ ...logo, subtext: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Logo Image URL</label>
                          <input
                            type="url"
                            value={logo.image_url || ""}
                            onChange={(e) => setLogo({ ...logo, image_url: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="https://..."
                          />
                        </div>
                        {logo.image_url && <ImagePreview src={logo.image_url || "/placeholder.svg"} alt="Logo" />}
                        <Button
                          onClick={updateLogo}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Logo
                        </Button>
                      </div>
                    )}
                </Card>

                {/* About Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">About Section</h2>
                  {about &&
                    about.id && ( // Check for about.id to ensure it's loaded
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                          <input
                            type="text"
                            value={about.title}
                            onChange={(e) => setAbout({ ...about, title: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                          <textarea
                            value={about.description}
                            onChange={(e) => setAbout({ ...about, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Button Text</label>
                          <input
                            type="text"
                            value={about.button_text}
                            onChange={(e) => setAbout({ ...about, button_text: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <Button
                          onClick={updateAbout}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                </Card>

                {/* Hero Section Management */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Hero Section</h2>
                  {hero && hero.id && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Hero Title</label>
                        <input
                          type="text"
                          value={hero.title}
                          onChange={(e) => setHero({ ...hero, title: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Hero Description</label>
                        <textarea
                          value={hero.description}
                          onChange={(e) => setHero({ ...hero, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Button Text</label>
                        <input
                          type="text"
                          value={hero.button_text}
                          onChange={(e) => setHero({ ...hero, button_text: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Background Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={hero.background_image_url || ""}
                          onChange={(e) => setHero({ ...hero, background_image_url: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="https://..."
                        />
                      </div>
                      {hero.background_image_url && (
                        <ImagePreview src={hero.background_image_url || "/placeholder.svg"} alt="Hero Background" />
                      )}
                      <Button
                        onClick={updateHero}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Hero Section
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Events Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Events</h2>
                    <Button
                      onClick={() => setShowNewEventForm(!showNewEventForm)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>

                  {showNewEventForm && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg space-y-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                      <textarea
                        placeholder="Event Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Icon (emoji or icon type)"
                        value={newEvent.icon}
                        onChange={(e) => setNewEvent({ ...newEvent, icon: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={createEvent}
                          disabled={isSaving}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Create
                        </Button>
                        <Button
                          onClick={() => setShowNewEventForm(false)}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border-b border-border pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                            <input
                              type="text"
                              value={event.title}
                              onChange={(e) => handleEventChange(event.id, "title", e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Icon</label>
                            <div className="flex gap-2 items-center">
                              <div className="w-10 h-10 flex-shrink-0 bg-white/5 rounded flex items-center justify-center border border-border overflow-hidden">
                                {(event.icon?.startsWith('/') || event.icon?.startsWith('http')) ? (
                                  <img
                                    src={event.icon}
                                    alt="Icon"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl">{event.icon || "🎯"}</span>
                                )}
                              </div>
                              <input
                                type="text"
                                value={event.icon}
                                onChange={(e) => handleEventChange(event.id, "icon", e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Emoji or Image URL"
                              />
                            </div>
                          </div>
                          <div className="flex items-end gap-2">
                            <Button
                              onClick={() => saveEvent(event.id)}
                              disabled={isSaving}
                              className="bg-primary hover:bg-primary/90 text-white flex-1"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                          <textarea
                            value={event.description}
                            onChange={(e) => handleEventChange(event.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Membership Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Membership Section</h2>
                  {membership &&
                    membership.id && ( // Check for membership.id to ensure it's loaded
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                          <input
                            type="text"
                            value={membership.title}
                            onChange={(e) => setMembership({ ...membership, title: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                          <textarea
                            value={membership.description}
                            onChange={(e) => setMembership({ ...membership, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Stats</label>
                          {membership.stats.map((stat, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => {
                                  const newStats = [...membership.stats]
                                  newStats[idx].label = e.target.value
                                  setMembership({ ...membership, stats: newStats })
                                }}
                                placeholder="Label"
                                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => {
                                  const newStats = [...membership.stats]
                                  newStats[idx].value = e.target.value
                                  setMembership({ ...membership, stats: newStats })
                                }}
                                placeholder="Value"
                                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={updateMembership}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                </Card>

                {/* Contact Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Contact Section</h2>
                  {contact &&
                    contact.id && ( // Check for contact.id to ensure it's loaded
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                          <input
                            type="text"
                            value={contact.title}
                            onChange={(e) => setContact({ ...contact, title: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                          <textarea
                            value={contact.description}
                            onChange={(e) => setContact({ ...contact, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <Button
                          onClick={updateContact}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                </Card>

                {/* Benefits Section */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Benefits</h2>
                  <div className="space-y-6">
                    {benefits.map((benefit) => (
                      <div key={benefit.id} className="border-b border-border pb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                            <input
                              type="text"
                              value={benefit.title}
                              onChange={(e) => handleBenefitChange(benefit.id, "title", e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Icon</label>
                            <input
                              type="text"
                              value={benefit.icon_type}
                              onChange={(e) => handleBenefitChange(benefit.id, "icon_type", e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                          <textarea
                            value={benefit.description}
                            onChange={(e) => handleBenefitChange(benefit.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => saveBenefit(benefit.id)}
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Benefit
                          </Button>
                          <button
                            onClick={() => deleteBenefit(benefit.id)}
                            className="p-2 px-4 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Delete Benefit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Footer Configuration</h2>
                  {footer && footer.id && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                        <input
                          type="text"
                          value={footer.company_name}
                          onChange={(e) => setFooter({ ...footer, company_name: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                        <textarea
                          value={footer.description}
                          onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
                          <input
                            type="text"
                            value={footer.address}
                            onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                          <input
                            type="email"
                            value={footer.email}
                            onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                          <input
                            type="tel"
                            value={footer.phone}
                            onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Copyright Year</label>
                          <input
                            type="number"
                            value={footer.copyright_year}
                            onChange={(e) => setFooter({ ...footer, copyright_year: Number.parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Copyright Text</label>
                        <input
                          type="text"
                          value={footer.copyright_text}
                          onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <Button
                        onClick={updateFooter}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Footer
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <motion.div {...fadeIn}>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Settings</h1>

                {/* Social Media Links */}
                <Card className={`p-6 ${glassCard} mb-6`}>
                  <h2 className="text-xl font-bold text-foreground mb-4">Social Media Links</h2>
                  <div className="space-y-4">
                    {socialMedia.map((social) => (
                      <div key={social.id} className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-foreground mb-2 capitalize">
                            {social.platform}
                          </label>
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => {
                              const newUrl = e.target.value
                              setSocialMedia(socialMedia.map((s) => (s.id === social.id ? { ...s, url: newUrl } : s)))
                            }}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <Button
                          onClick={() => updateSocialMedia(social.id, social.url)}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div >

        {
          previewImage && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 flex justify-between items-center p-4 border-b border-border bg-white">
                  <h3 className="text-lg font-semibold text-foreground">Photo Preview</h3>
                  <button onClick={() => setPreviewImage(null)} className="p-2 hover:bg-white/10 text-black hover:text-black rounded transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex justify-center">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          )
        }
      </main >
    </div >
  )
}