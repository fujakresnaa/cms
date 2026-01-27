"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Share2, ArrowLeft, Home, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function EventNotFound() {
    const [copied, setCopied] = useState(false)

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    }

    return (
        <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />

            <div className="max-w-xl w-full text-center relative z-10">
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2.5rem] p-10 sm:p-14 shadow-2xl border border-white/20 dark:border-white/5"
                >
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100 dark:border-red-900/10">
                        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                        Event Not Found
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                        The event you're looking for might have been moved, deleted, or the link might be incorrect.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleCopyLink}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <Share2 className={`w-5 h-5 transition-transform ${copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
                            <span className="absolute">{copied ? 'Copied!' : ''}</span>
                            <span className={copied ? 'opacity-0' : 'opacity-100'}>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>

                        <Link
                            href="/#events"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Events
                        </Link>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 dark:border-zinc-800">
                        <Link
                            href="/"
                            className="text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 group"
                        >
                            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Go to Home
                        </Link>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]"
                >
                    Mercedes-Benz W205CI Club Indonesia
                </motion.p>
            </div>
        </main>
    )
}
