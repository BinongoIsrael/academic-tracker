import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-primary-container py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="mb-6 text-on-primary-container">
          Ready to Take Control of Your Academic Journey?
        </h2>
        <p className="text-body-large text-on-primary-container/80 mb-8">
          Join Gradient today and start tracking your grades with confidence.
          Plan smarter, study better, and grow stronger.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-10 py-4 bg-brand-dark text-white rounded font-black text-lg neo-shadow-hover transition-all"
          >
            Get Started Now
          </Link>
          <Link
            href="/signin"
            className="px-10 py-4 bg-surface-container-highest text-on-surface font-bold text-lg rounded transition-all hover:bg-surface-variant flex items-center justify-center gap-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
