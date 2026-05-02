import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low pt-16 pb-8 border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 max-w-[1200px] mx-auto">
        <div className="col-span-2 md:col-span-1">
          <div className="text-lg font-black text-on-surface mb-6 uppercase">Gradient</div>
          <p className="text-on-surface-variant font-['Inter'] text-sm leading-relaxed mb-6">Professional-grade academic precision with Gradient. Precision in every point.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h5 className="text-on-surface font-bold text-sm">Quick Links</h5>
          <Link href="#features" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Features</Link>
          <Link href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors text-sm">How it Works</Link>
          <Link href="#about" className="text-on-surface-variant hover:text-primary transition-colors text-sm">About</Link>
          <Link href="/signup" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Get Started</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="text-on-surface font-bold text-sm">Legal</h5>
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Terms of Service</Link>
          <Link href="/cookies" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Cookie Policy</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="text-on-surface font-bold text-sm">Connect</h5>
          <div className="space-y-2 text-on-surface-variant text-sm">
            <p className="font-semibold text-on-surface">Vee Emmanuel L. Añora</p>
            <a href="mailto:veeanora5@gmail.com" className="block hover:text-primary transition-colors">Email</a>
            <a href="https://github.com/vitrus-o" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/vee-emmanuel-l-anora-37520b2a6/" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="mt-16 px-12 max-w-[1200px] mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-on-surface-variant text-xs font-['Inter']">
        <p>© {currentYear} Editorial Academic Tracking. Built for precision.</p>
        <div className="mt-4 md:mt-0 flex gap-6">
          <span>Designed for Academic Excellence</span>
        </div>
      </div>
    </footer>
  );
}