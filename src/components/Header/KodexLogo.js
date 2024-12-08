// 'use client'

// import { useState, useEffect } from 'react'
// import './Header.css'

// export default function KodexLogo() {
//   const [isAnimated, setIsAnimated] = useState(false)

//   useEffect(() => {
//     setIsAnimated(true)
//   }, [])

//   return (
//     <div className="flex items-center space-x-2">
//       <div className="relative w-10 h-10">
//         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//           <path 
//             d="M6 4V20M6 12H10L18 20M18 4L10 12" 
//             stroke="#00FFFF" 
//             strokeWidth="2" 
//             strokeLinecap="round" 
//             strokeLinejoin="round"
//             className={`${isAnimated ? 'animate-draw-path' : ''}`}
//           />
//           <path 
//             d="M6 4V20M6 12H10L18 20M18 4L10 12" 
//             stroke="#00FFFF" 
//             strokeWidth="1" 
//             strokeLinecap="round" 
//             strokeLinejoin="round"
//             className={`${isAnimated ? 'animate-glow' : ''}`}
//             filter="url(#glow)"
//           />
//           <circle cx="0" cy="0" r="1" fill="#00FFFF" className={`${isAnimated ? 'animate-particle-trail' : ''}`}>
//             <animateMotion
//               path="M6 4V20M6 12H10L18 20M18 4L10 12"
//               dur="3s"
//               repeatCount="indefinite"
//             />
//           </circle>
//           <defs>
//             <filter id="glow">
//               <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//               <feMerge>
//                 <feMergeNode in="coloredBlur"/>
//                 <feMergeNode in="SourceGraphic"/>
//               </feMerge>
//             </filter>
//           </defs>
//         </svg>

//         {isAnimated && (
//           <>
//             <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full animate-particle-1" />
//             <div className="absolute top-1/2 right-0 w-1 h-1 bg-blue-400 rounded-full animate-particle-2" />
//             <div className="absolute bottom-0 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-particle-3" />
//           </>
//         )}

//         <div 
//           className={`absolute inset-0 bg-gradient-to-br from-transparent to-cyan-500/10 mix-blend-overlay transition-opacity duration-2000 ${
//             isAnimated ? 'animate-digital-noise opacity-50' : 'opacity-0'
//           }`}
//         />
//       </div>
//       <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//         odex
//       </div>
//     </div>
//   )
// }

'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Particle = ({ x, y, radius, color }) => (
  <motion.circle cx={x} cy={y} r={radius} fill={color} />
)

export default function KodexLogo() {
  const [particles, setParticles] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i <10+ Math.random()*20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 200,
          y: Math.random() * 50,
          radius: Math.random() * 2 + 1,
          color: i % 2 === 0 ? '#00FFFF' : '#0080FF',
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
        })
      }
      setParticles(newParticles)
    }

    createParticles()
  }, [])

  useEffect(() => {
    let animationFrameId

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let { x, y, velocity } = particle
          x += velocity.x * (isHovered ? 2 : 1)
          y += velocity.y * (isHovered ? 2 : 1)

          if (x < 0 || x > 150) velocity.x *= -1
          if (y < 0 || y > 50) velocity.y *= -1

          return { ...particle, x, y, velocity }
        })
      )

      animationFrameId = requestAnimationFrame(animateParticles)
    }

    animateParticles()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered])

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width="200" height="50" className="absolute top-0 left-0">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </svg>
      <motion.div
        className="relative z-10 text-4xl font-bold"
        style={{
          background: 'linear-gradient(135deg, #00FFFF, #0080FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        KODEX
      </motion.div>
    </motion.div>
  )
}
