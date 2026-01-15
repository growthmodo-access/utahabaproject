import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="mb-4">
              <div className="relative h-10 sm:h-11 md:h-12 w-auto flex items-center justify-start">
                <Image
                  src="/logo.png"
                  alt="ABA Utah Logo"
                  width={200}
                  height={50}
                  className="object-contain h-full w-auto"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your comprehensive resource for finding the best ABA therapy providers in Utah.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/directory" className="text-muted-foreground hover:text-foreground transition-colors">Provider Directory</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/cost-estimator" className="text-muted-foreground hover:text-foreground transition-colors">Cost Estimator</Link></li>
              <li><Link href="/quiz" className="text-muted-foreground hover:text-foreground transition-colors">ABA Quiz</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">About ABA Therapy</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Treatment Guide</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Insurance Information</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Have questions? Reach out to us for assistance finding the right provider.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
