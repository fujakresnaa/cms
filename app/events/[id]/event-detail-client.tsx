"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Share2, MapPin, Clock, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface Event {
    id: string
    title: string
    description: string
    icon: string
    header_image?: string
    event_time?: string
    location?: string
    status?: string
    created_at: string
}

export function EventDetailClient({ event }: { event: Event }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        message: ""
    })

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    }

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: event.title,
            text: `Check out this event: ${event.title}`,
            url: typeof window !== 'undefined' ? window.location.href : ''
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
            }
        } catch (error) {
            console.error("Error sharing:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        setSubmitStatus("idle")

        try {
            const response = await fetch("/api/cms/events/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event_id: event.id,
                    ...formData
                })
            })

            if (response.ok) {
                setSubmitStatus("success")
                setFormData({ full_name: "", email: "", phone_number: "", message: "" })
                setTimeout(() => {
                    setIsModalOpen(false)
                    setSubmitStatus("idle")
                }, 3000)
            } else {
                setSubmitStatus("error")
            }
        } catch (error) {
            console.error("Error submitting registration:", error)
            setSubmitStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            {/* Immersive Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                {event.header_image ? (
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={event.header_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] dark:from-[#0a0a0a] via-transparent to-black/30" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Floating Back Button (Top) */}
                <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 lg:p-8 z-20">
                    <div className="max-w-5xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <Link
                                href="/#events"
                                className="inline-flex items-center text-sm font-medium text-white px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40 hover:border-white/40 mb-6 transition-all group shadow-lg"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to All Events
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-20 pb-24 px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content Card */}
                        <motion.div
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            className="lg:col-span-2"
                        >
                            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20 dark:border-white/5">
                                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-gray-100 dark:border-zinc-700">
                                        {(event.icon?.startsWith('/') || event.icon?.startsWith('http')) ? (
                                            <img src={event.icon} alt={event.title} className="w-12 h-12 object-contain" />
                                        ) : (
                                            <span role="img" aria-label="icon">{event.icon || "🎯"}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase mb-2">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Event Details
                                        </div>
                                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                                            {event.title}
                                            {event.status && event.status !== 'upcoming' && (
                                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${event.status === 'coming_soon'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700'
                                                    }`}>
                                                    {event.status.replace('_', ' ')}
                                                </span>
                                            )}
                                        </h2>
                                    </div>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </div>

                                <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-gray-100 dark:border-zinc-800">
                                    {event.status !== 'past' && (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                                        >
                                            Register Interest
                                        </button>
                                    )}
                                    <button
                                        onClick={handleShare}
                                        className="p-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all group"
                                    >
                                        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar Info */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-6"
                        >
                            <motion.div variants={fadeIn} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-white/5">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 dark:border-zinc-800 pb-4">Schedule</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-bold">Time</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{event.event_time || "TBA"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-bold">Location</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{event.location || "TBA"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-bold">Status</p>
                                            <p className={`font-semibold capitalize ${event.status === 'past' ? 'text-gray-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                                {(event.status || 'upcoming').replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Join the Club</h3>
                                    <p className="text-gray-400 text-sm mb-6">Want to attend this member-exclusive event?</p>
                                    <Link
                                        href="/#join"
                                        className="inline-flex items-center text-sm font-bold text-white group"
                                    >
                                        Registration Info
                                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold dark:text-white">Register Interest</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-8">
                                {submitStatus === "success" ? (
                                    <div className="py-12 text-center">
                                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                            Your interest has been registered. We'll be in touch with you shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone_number}
                                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                placeholder="+62 812 3456 7890"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Additional Message</label>
                                            <textarea
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Any questions or special requests?"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white transition-all resize-none"
                                            />
                                        </div>

                                        {submitStatus === "error" && (
                                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                                <AlertCircle className="w-4 h-4" />
                                                Something went wrong. Please try again.
                                            </div>
                                        )}

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Confirm Registration"
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}
