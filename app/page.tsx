'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Image from 'next/image'

// Analytics flag - set to false to disable console logs
const ENABLE_ANALYTICS_LOGS = true

// Function stub for future endpoint integration
// Uncomment and implement when ready to connect to a real backend
/*
async function submitLeadToEndpoint(email: string, size?: string) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, size }),
  })
  return response.json()
}
*/

interface LeadData {
  email: string
  size?: string
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSizeQuestion, setShowSizeQuestion] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isSizeSaved, setIsSizeSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const storyLinkRef = useRef<HTMLButtonElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Check if user has already submitted
  useEffect(() => {
    const saved = localStorage.getItem('virtvs_lead')
    if (saved) {
      const data: LeadData = JSON.parse(saved)
      setIsSubmitted(true)
      if (data.size) {
        setShowSizeQuestion(true)
        setSelectedSize(data.size)
        setIsSizeSaved(true)
      } else {
        setShowSizeQuestion(true)
      }
    }
  }, [])

  // Analytics logging
  useEffect(() => {
    if (ENABLE_ANALYTICS_LOGS) {
      console.log('page_view')
    }
  }, [])

  // Story modal management
  useEffect(() => {
    if (!isStoryOpen) return

    // Focus the close button when modal opens
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    // Lock background scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsStoryOpen(false)
        return
      }

      // Minimal focus trap (Tab cycling within modal)
      if (e.key === "Tab") {
        const modal = document.getElementById("story-modal")
        if (!modal) return

        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1)

        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow

      // Return focus to the link/button that opened the modal
      storyLinkRef.current?.focus()
    }
  }, [isStoryOpen])

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Form submit handler called', { email, isSubmitting })
    
    if (!email || isSubmitting) {
      console.log('Submission blocked:', { email, isSubmitting })
      return
    }

    setIsSubmitting(true)
    console.log('Starting submission...')

    try {
      // Store in localStorage first (this always works)
      const leadData: LeadData = { email }
      localStorage.setItem('virtvs_lead', JSON.stringify(leadData))
      console.log('Stored in localStorage')

      // Try to send email notification (but don't fail if it doesn't work)
      try {
        console.log('Sending request to /api/submit-lead')
        const response = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        console.log('Response received:', response.status, response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.warn('Email API error (non-critical):', errorText)
          // Don't throw - just log the warning, form submission still succeeds
        }
      } catch (emailError) {
        // Email sending failed, but that's okay - we still show success
        console.warn('Email sending failed (non-critical):', emailError)
      }

      // Analytics
      if (ENABLE_ANALYTICS_LOGS) {
        console.log('signup_submit', { email })
      }

      // Track Plausible event for successful email submit
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('email_submit')
      }

      // Set success state - this will trigger the UI to show the confirmation
      console.log('Setting success state')
      setIsSubmitted(true)
      setShowSizeQuestion(true)
      console.log('Success state set')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your email. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleSizeSave = async () => {
    if (!selectedSize) return

    const existing = localStorage.getItem('virtvs_lead')
    if (existing) {
      const data: LeadData = JSON.parse(existing)
      data.size = selectedSize
      localStorage.setItem('virtvs_lead', JSON.stringify(data))

      // Update the lead with size preference
      try {
        await fetch('/api/submit-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email, size: selectedSize }),
        })
      } catch (error) {
        console.error('Error updating size preference:', error)
      }
    }

    // Analytics
    if (ENABLE_ANALYTICS_LOGS) {
      console.log('size_saved', { size: selectedSize })
    }

    setIsSizeSaved(true)
  }

  const handleReset = () => {
    localStorage.removeItem('virtvs_lead')
    setIsSubmitted(false)
    setShowSizeQuestion(false)
    setSelectedSize('')
    setIsSizeSaved(false)
    setEmail('')
  }

  const scrollToForm = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, source: 'header' | 'hero' = 'hero') => {
    e.preventDefault()
    e.stopPropagation()
    
    // Track Plausible event
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(source === 'header' ? 'cta_header' : 'cta_hero')
    }
    
    console.log('scrollToForm called')
    const element = document.getElementById('early-access')
    console.log('Element found:', element)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Fallback: try querySelector
      const section = document.querySelector('#early-access')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        console.error('Element with id "early-access" not found')
      }
    }
  }

  const scrollToDetails = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Track Plausible event
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('details_click')
    }
    
    const element = document.getElementById('details')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const currentYear = new Date().getFullYear()
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  
  // Gallery images - currently using hoodie.png as placeholder
  // To swap to specific images, change to: ['hoodie-front.png', 'hoodie-back.png', 'hoodie-sleeve.png']
  const galleryImages = ['fortitvdo-front.png', 'fortitvdo-back.png', 'fortitvdo-sleeve.png']
  const galleryLabels = ['Front View', 'Back View', 'Sleeve Detail']
  
  // Check if images exist (for now, we'll use SVG placeholders)
  const usePlaceholders = false // Set to false when you have actual PNG files

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          <div className="text-lg font-serif tracking-wide">VIRTVS</div>
          <a
            href="#early-access"
            onClick={(e) => scrollToForm(e, 'header')}
            className="inline-block text-sm tracking-wide uppercase border border-charcoal px-8 py-3 hover:bg-charcoal hover:text-background transition-colors cursor-pointer"
            aria-label="Request Early Access"
          >
            Request Early Access
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="relative w-[115px] h-[115px] sm:w-36 sm:h-36 lg:w-[173px] lg:h-[173px]">
                <img
                  src="/wreath-logo-v-black-on-white.svg"
                  alt="Virtvs"
                  className="w-full h-full object-contain opacity-[0.85]"
                />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif leading-tight tracking-tight">
              FORTITVDO
            </h1>
            <p className="text-xl sm:text-2xl font-serif italic text-charcoal/80 mt-2">
              Endurance. Resolve. Atonement.
            </p>
            <div className="space-y-2 text-base sm:text-lg text-charcoal/70 leading-relaxed">
              <p>The first Virtvs drop.</p>
              <p>Heavyweight charcoal hoodie. Roman virtue.</p>
            </div>
            <a
              href="#early-access"
              onClick={(e) => scrollToForm(e, 'hero')}
              className="inline-block mt-8 text-sm tracking-wide uppercase border border-charcoal px-8 py-3 hover:bg-charcoal hover:text-background transition-colors cursor-pointer"
              aria-label="Request Early Access"
            >
              Request Early Access
            </a>
            <div className="mt-4">
              <a
                href="#details"
                onClick={scrollToDetails}
                className="text-sm text-charcoal/60 hover:text-charcoal underline"
              >
                See the details
              </a>
            </div>
          </div>
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] animate-fade-in-delay bg-background rounded-md overflow-hidden">
            {usePlaceholders ? (
              <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="800" height="800" fill="#FAFAFA"/>
                <rect x="50" y="50" width="700" height="700" fill="#2C2C2C" opacity="0.1"/>
                <text x="400" y="380" fontFamily="serif" fontSize="24" fill="#2C2C2C" textAnchor="middle" opacity="0.4">hoodie.png</text>
                <text x="400" y="420" fontFamily="serif" fontSize="16" fill="#2C2C2C" textAnchor="middle" opacity="0.3">Hero Product Image</text>
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-0">
                <img
                  src="/walking-hoodie-fortitvdo.png"
                  alt="Virtvs Fortitvdo hoodie"
                  className="w-full h-full object-contain opacity-[0.85] rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section id="details" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="relative w-full aspect-square bg-background border border-charcoal/10 cursor-pointer hover:border-charcoal/30 transition-colors rounded-md overflow-hidden"
              onClick={() => setEnlargedImage(img)}
            >
              {usePlaceholders ? (
                <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect width="800" height="800" fill="#FAFAFA"/>
                  <rect x="50" y="50" width="700" height="700" fill="#2C2C2C" opacity="0.1"/>
                  <text x="400" y="380" fontFamily="serif" fontSize="20" fill="#2C2C2C" textAnchor="middle" opacity="0.4">{img}</text>
                  <text x="400" y="420" fontFamily="serif" fontSize="14" fill="#2C2C2C" textAnchor="middle" opacity="0.3">{galleryLabels[idx] || 'Gallery Image'}</text>
                </svg>
              ) : (
                <Image
                  src={`/${img}`}
                  alt={`Virtvs hoodie view ${idx + 1}`}
                  fill
                  className="object-cover opacity-[0.85] rounded-md"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            ref={storyLinkRef}
            type="button"
            onClick={() => {
              // Track Plausible event
              if (typeof window !== 'undefined' && window.plausible) {
                window.plausible('story_open')
              }
              setIsStoryOpen(true)
            }}
            className="inline-flex items-center text-sm text-charcoal/60 hover:text-charcoal underline underline-offset-4"
            aria-haspopup="dialog"
            aria-controls="story-modal"
          >
            Meaning behind the symbols →
          </button>
        </div>
      </section>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-charcoal/60 text-2xl z-10"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={`/${enlargedImage}`}
              alt="Enlarged product view"
              className="w-full h-full object-contain rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* The First Drop Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-left">
        <h2 className="text-3xl font-serif mb-8">The First Drop</h2>

        <div className="max-w-prose space-y-5 text-lg leading-7 text-charcoal/90">
          <p>Fortitvdo means strength forged in trial.</p>

          <p>Drop I is a heavyweight charcoal hoodie released in a single run of 75 units.</p>

          <p>
            It is made to feel substantial, understated, and lasting — a piece defined by discipline rather than excess.
          </p>

          <p>No restock. No second run.</p>
        </div>
      </section>

      {/* Early Access Section */}
      <section id="early-access" className="max-w-3xl mx-auto px-6 pb-32 text-left" style={{ scrollMarginTop: '0' }}>
        <h2 className="text-3xl font-serif mb-6">Early Access</h2>

        <div className="max-w-prose space-y-5 text-lg leading-7 text-charcoal/90 mb-8">
          <p>
            Join early access to be notified before the public release and receive priority access to Drop I.
          </p>

          <p>Once all 75 units are claimed, the drop closes.</p>
        </div>

        {!isSubmitted ? (
          <form 
            onSubmit={handleEmailSubmit} 
            className="space-y-6" 
            noValidate
            onReset={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                autoComplete="email"
                className="w-full border border-charcoal/30 px-4 py-3 text-base focus:outline-none focus:border-charcoal transition-colors"
                aria-label="Email address"
                onInvalid={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block border border-charcoal px-8 py-3 text-sm tracking-wide uppercase hover:bg-charcoal hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Early Access'}
            </button>
          </form>
        ) : (
          <div className="space-y-8 max-w-md" id="form-success">
            <div className="space-y-3 p-6 border-2 border-charcoal bg-background">
              <h3 className="text-2xl font-serif">You&apos;re On The List.</h3>
              <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed">
                Thank you for signing up. When the first Virtvs drop opens, you&apos;ll receive early access before the public release.
              </p>
            </div>

            {showSizeQuestion && !isSizeSaved && (
              <div className="space-y-6 pt-6 border-t border-charcoal/10">
                <p className="text-base font-medium">What size would you most likely order?</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm transition-colors ${
                        selectedSize === size
                          ? 'border-charcoal bg-charcoal text-background'
                          : 'border-charcoal/20 hover:border-charcoal/40'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSizeSave}
                  disabled={!selectedSize}
                  className="text-sm tracking-wide uppercase border-2 border-charcoal px-8 py-3 hover:bg-charcoal hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save size preference
                </button>
              </div>
            )}

            {isSizeSaved && (
              <div className="pt-6 border-t border-charcoal/10">
                <p className="text-base text-charcoal/70">Saved. You&apos;re all set.</p>
              </div>
            )}

            {/* Reset button for testing */}
            <div className="pt-6 border-t border-charcoal/10 mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-charcoal/50 hover:text-charcoal underline"
              >
                Reset form (for testing)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 border-t border-charcoal/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-charcoal/60">
          <div>© {currentYear} Virtvs</div>
          <div className="italic">ad astra per aspera</div>
        </div>
      </footer>

      {/* Story Modal */}
      {isStoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Product story"
          aria-describedby="story-desc"
          id="story-modal"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close story modal"
            onClick={() => setIsStoryOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-2xl bg-background border border-charcoal/10 shadow-sm rounded-md overflow-hidden">
            <div className="flex justify-end px-6 pt-4 pb-0">
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setIsStoryOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 text-charcoal/50 hover:text-charcoal text-xl leading-none transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-8 py-8">
              <div id="story-desc" className="text-base leading-7 text-charcoal/80 space-y-5 max-w-prose">
                <p>
                  The Nemean Lion was the first of Hercules&apos; twelve labors.
                  <br />
                  It symbolizes the beginning of every worthy struggle: the first test of strength, discipline, and resolve.
                </p>

                <p>
                  The XII represents the full twelve labors.
                  <br />
                  The lion marks the first.
                </p>

                <p>
                  Fortitvdo is not comfort.
                  <br />
                  It is strength forged in trial.
                </p>
              </div>

              {/* Optional: a subtle divider line for finish */}
              <div className="mt-8 h-px w-full bg-charcoal/10" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}

