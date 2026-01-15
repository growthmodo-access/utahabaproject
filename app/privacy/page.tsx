import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | ABA Therapy Utah',
  description: 'Privacy policy for ABA Therapy Utah directory and blog website',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Privacy Policy
            </h1>
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-foreground space-y-6">
            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Welcome to ABA Therapy Utah (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground mt-2 ml-4">
                    <li>Subscribe to our email newsletter</li>
                    <li>Fill out contact forms or request assistance</li>
                    <li>Use our cost estimator or ABA quiz tools</li>
                    <li>Contact us directly</li>
                  </ul>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-4">
                    This information may include your name, email address, phone number, county, and any other details you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground mt-2 ml-4">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages you visit and time spent on pages</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze website usage and trends to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Email Marketing</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We use Klaviyo for email marketing services. When you subscribe to our newsletter, your email address and related information are stored in Klaviyo&apos;s systems. You can unsubscribe from our emails at any time by clicking the unsubscribe link in any email we send, or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Data Storage</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We use Supabase for storing blog post data. Your personal information submitted through forms may be stored securely in our database systems. We implement appropriate technical and organizational measures to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We may use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                We may use third-party services that collect, monitor, and analyze information. These services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground ml-4">
                <li><strong>Klaviyo:</strong> Email marketing platform</li>
                <li><strong>Supabase:</strong> Database and backend services</li>
                <li><strong>Vercel/Next.js:</strong> Website hosting and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of email communications</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Children&apos;s Privacy</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Changes to This Privacy Policy</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our <Link href="/contact" className="text-foreground underline hover:text-foreground/80">contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}
