import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-brand-green py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="mb-6">
          Ready to Take Control of Your Academic Journey?
        </h2>
        <p className="text-body-large text-brand-dark mb-8">
          Join Gradient today and start tracking your grades with confidence.
          Plan smarter, study better, and grow stronger.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 bg-brand-dark text-white rounded-lg text-button hover:bg-black transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white border-2 border-brand-dark rounded-lg text-button hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
