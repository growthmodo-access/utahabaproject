import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions | ABA Therapy Utah',
  description: 'Terms and conditions for ABA Therapy Utah directory and blog website',
}

export default function TermsPage() {
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
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Terms & Conditions
            </h1>
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-foreground space-y-6">
            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                By accessing and using the ABA Therapy Utah website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Use License</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on ABA Therapy Utah&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Provider Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The provider directory information on this website is provided for informational purposes only. We do not endorse, recommend, or guarantee the services of any provider listed. It is your responsibility to verify provider credentials, licenses, and suitability for your needs. We are not responsible for the quality of services provided by any listed provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Cost Estimator & Quiz Tools</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The cost estimator and ABA benefit quiz are provided for informational and educational purposes only. Results are estimates and should not be considered as medical advice, professional recommendations, or guarantees of actual costs or outcomes. Always consult with qualified healthcare providers and ABA therapy professionals for accurate information.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Medical Disclaimer</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The content on this website, including blog posts, articles, and resources, is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                In no event shall ABA Therapy Utah or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Accuracy of Materials</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Links to Third-Party Sites</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of these sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Modifications</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Governing Law</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the State of Utah, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Contact Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us through our <Link href="/contact" className="text-foreground underline hover:text-foreground/80">contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}
