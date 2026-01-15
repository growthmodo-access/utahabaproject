'use client'

import Link from 'next/link'
// import Image from 'next/image' // Uncomment when adding logo.png
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Logo placeholder - Replace with your actual logo.png */}
              {/* To use your logo: 1) Add logo.png to /public/ folder, 2) Uncomment Image component below, 3) Remove placeholder div */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-red-300 flex items-center justify-center border-2 border-orange-400/30 shadow-sm">
                <div className="w-6 h-5 bg-red-700 rounded-sm transform rotate-45"></div>
              </div>
              {/* 
              <Image
                src="/logo.png"
                alt="ABA Utah Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              */}
            </div>
            <span className="text-xl font-semibold text-foreground">ABA Utah</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/directory" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Directory
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/cost-estimator" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cost Estimator
            </Link>
            <Link 
              href="/quiz" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ABA Quiz
            </Link>
            <Link 
              href="/directory" 
              className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Find Providers
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link 
              href="/directory" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Directory
            </Link>
            <Link 
              href="/blog" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/cost-estimator" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cost Estimator
            </Link>
            <Link 
              href="/quiz" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ABA Quiz
            </Link>
            <Link 
              href="/directory" 
              className="block bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-foreground/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Providers
            </Link>
          </div>
        )}
      </nav>
    </header>
    </>
  )
}
