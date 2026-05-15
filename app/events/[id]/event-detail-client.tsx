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
        <main className="min-h-screen bg-background text-foreground">
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
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60" />
                <div className="absolute inset-0 bg-black/40" />

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
                                className="inline-flex items-center font-accent text-white px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-primary/20 hover:border-primary/40 mb-6 transition-all group shadow-2xl"
                            >
                                <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                                BACK TO EVENTS
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
                            <div className="bg-card/40 backdrop-blur-xl rounded-sm p-8 sm:p-12 shadow-2xl border border-border/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-metallic-gold opacity-50" />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-12 pb-10 border-b border-border/40">
                                    <div className="w-24 h-24 flex-shrink-0 bg-background/50 rounded-sm flex items-center justify-center text-5xl shadow-2xl border border-primary/20">
                                        {(event.icon?.startsWith('/') || event.icon?.startsWith('http')) ? (
                                            <img src={event.icon} alt={event.title} className="w-12 h-12 object-contain invert brightness-200" />
                                        ) : (
                                            <span role="img" aria-label="icon">{event.icon || "🎯"}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center text-primary font-accent mb-3">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            EVENT DETAILS
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-foreground leading-tight tracking-tight">
                                            {event.title}
                                        </h2>
                                        {event.status && event.status !== 'upcoming' && (
                                            <div className="mt-4">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${event.status === 'coming_soon'
                                                    ? 'bg-primary/20 text-primary border-primary/30'
                                                    : 'bg-muted text-muted-foreground border-border'
                                                    }`}>
                                                    {event.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans font-light">
                                    {event.description}
                                </div>

                                <div className="mt-12 flex flex-wrap gap-4 pt-10 border-t border-border/40">
                                    {event.status !== 'past' && (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-10 py-4 bg-metallic-gold text-primary-foreground font-bold tracking-widest rounded-sm transition-all shadow-xl hover:scale-105 active:scale-95 border-0"
                                        >
                                            REGISTER INTEREST
                                        </button>
                                    )}
                                    <button
                                        onClick={handleShare}
                                        className="p-4 bg-secondary/50 hover:bg-secondary text-foreground rounded-sm transition-all group border border-border/50"
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
                            <motion.div variants={fadeIn} className="bg-card/40 backdrop-blur-xl rounded-sm p-8 shadow-xl border border-border/50">
                                <h3 className="font-accent text-primary mb-8 border-b border-border/40 pb-4">SCHEDULE</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 group/item">
                                        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/20 transition-colors">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-accent text-[9px] text-muted-foreground block mb-1">TIME</p>
                                            <p className="font-sans font-bold text-lg text-foreground tracking-wide">{event.event_time || "TBA"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group/item">
                                        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/20 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-accent text-[9px] text-muted-foreground block mb-1">LOCATION</p>
                                            <p className="font-sans font-bold text-lg text-foreground tracking-wide">{event.location || "TBA"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group/item">
                                        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/20 transition-colors">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-accent text-[9px] text-muted-foreground block mb-1">STATUS</p>
                                            <p className={`font-sans font-bold text-lg capitalize ${event.status === 'past' ? 'text-muted-foreground' : 'text-primary'}`}>
                                                {(event.status || 'upcoming').replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-metallic-gold rounded-sm p-8 text-primary-foreground relative overflow-hidden group shadow-2xl">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-sans font-bold mb-2 tracking-tight">Join the Club</h3>
                                    <p className="opacity-80 text-sm mb-8 font-light leading-relaxed">Experience exclusive events with the W205CI brotherhood.</p>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center font-accent text-[10px] group border border-primary-foreground/30 px-4 py-2 rounded-sm hover:bg-primary-foreground hover:text-primary transition-all"
                                    >
                                        REGISTRATION INFO
                                        <ArrowLeft className="w-3 h-3 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
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
                                        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-3xl font-sans font-bold text-foreground mb-4">Thank You!</h3>
                                        <p className="text-muted-foreground leading-relaxed font-light">
                                            Your interest has been registered. We'll be in touch with you shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="font-accent text-[10px] text-muted-foreground">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-5 py-4 bg-background/50 border border-border/50 rounded-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground transition-all font-sans"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="font-accent text-[10px] text-muted-foreground">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-5 py-4 bg-background/50 border border-border/50 rounded-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground transition-all font-sans"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-accent text-[10px] text-muted-foreground">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone_number}
                                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                placeholder="+62 812 3456 7890"
                                                className="w-full px-5 py-4 bg-background/50 border border-border/50 rounded-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground transition-all font-sans"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-accent text-[10px] text-muted-foreground">Additional Message</label>
                                            <textarea
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Any questions or special requests?"
                                                className="w-full px-5 py-4 bg-background/50 border border-border/50 rounded-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground transition-all resize-none font-sans"
                                            />
                                        </div>

                                        {submitStatus === "error" && (
                                            <div className="flex items-center gap-2 text-destructive text-sm font-medium p-4 bg-destructive/10 border border-destructive/20 rounded-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                Something went wrong. Please try again.
                                            </div>
                                        )}

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-5 bg-metallic-gold text-primary-foreground font-bold tracking-widest rounded-sm transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 mt-4 border-0"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    SUBMITTING...
                                                </>
                                            ) : (
                                                "CONFIRM REGISTRATION"
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
