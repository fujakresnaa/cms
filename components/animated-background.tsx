"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"


export function AnimatedBackground() {
    const [particles, setParticles] = useState<Array<{ width: string; height: string; top: string; left: string; duration: number; delay: number }>>([])

    useEffect(() => {
        setParticles(
            [...Array(20)].map(() => ({
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                duration: Math.random() * 10 + 10,
                delay: Math.random() * 20,
            }))
        )
    }, [])

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black">
            {/* Deep Black Base */}
            <div className="absolute inset-0 bg-[#050505]" />

            {/* Elegant Gold Glow (Top Left) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#D4AF37] blur-[150px]"
            />

            {/* Deep Blue/Onyx Glow (Bottom Right) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#1a1a2e] blur-[150px]"
            />

            {/* Floating Particles */}
            <div className="absolute inset-0 opacity-20">
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: particle.width,
                            height: particle.height,
                            top: particle.top,
                            left: particle.left,
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: particle.delay,
                        }}
                    />
                ))}
            </div>

            {/* Subtle Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    )
}
