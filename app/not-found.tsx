import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-5xl text-on-primary-container">error</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface">Page Not Found</h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          The academic record or module you are looking for does not exist or has been moved to a different lifecycle.
        </p>
        <div className="pt-8">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-primary text-on-primary rounded-lg font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
