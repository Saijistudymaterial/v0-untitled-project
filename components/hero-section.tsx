"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const scrollToTools = () => {
    const toolsSection = document.querySelector(".tabs")
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Digital Effects - Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">All-in-One File Conversion Suite</h1>

          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Convert, compress, and edit your images and PDFs with our powerful tools
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" onClick={scrollToTools}>
              Get Started
            </Button>

            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="mx-auto h-8 w-8" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-100px) translateX(50px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
