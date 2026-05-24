import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CallToAction from "@/components/CallToAction";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import Image from "next/image";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient",
  description: "Plan Smarter, Study Better, Grow Stronger. Track grades, compute GPA/GWA, and predict scores needed to reach your goals.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface-container-low px-6">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-container blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary-container blur-[100px]"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto py-12 md:py-20 lg:py-0">
            <ScrollReveal direction="up" distance={30}>
              <span className="inline-block px-4 py-1.5 mb-6 text-[0.75rem] font-bold tracking-[0.2em] uppercase bg-primary-container/30 text-primary border border-primary/10 rounded-full">Editorial Academic Tracking</span>
              <h1 className="text-[3.5rem] md:text-[5rem] font-black leading-[1.1] tracking-tight text-on-surface mb-8">
                Plan Smarter <br />Study Better <br />
                <span className="text-primary italic hover-underline cursor-default">Grow Stronger</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Track grades, compute GWA, and predict your path to success. Gradient provides simple tools and personalized insights to keep you on track and growing stronger.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto px-10 py-4 bg-primary-container text-on-primary-container font-black text-lg rounded neo-shadow-hover transition-all text-center">
                  Get Started Now
                </Link>
                <Link 
                  href="#how-it-works"
                  className="w-full sm:w-auto px-10 py-4 bg-surface-container-highest text-on-surface font-bold text-lg rounded transition-all hover:bg-surface-variant flex items-center justify-center gap-2"
                >
                  How It Works
                  <span className="material-symbols-outlined text-xl">arrow_downward</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto scroll-mt-24" id="features">
          <ScrollReveal direction="up">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Advanced Gradient Curators</h2>
              <p className="text-on-surface-variant text-lg">Sophisticated tools for the modern scholar.</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden p-4">
            {/* Grade Input - Slide Left to Right */}
            <div className="md:col-span-8 group">
              <ScrollReveal direction="left" distance={100} duration={1}>
                <div className="bg-surface-container-high p-10 rounded-xl flex flex-col justify-between neo-shadow-hover transition-all h-full">
                  <div>
                    <div className="mb-8 w-14 h-14 bg-primary-container flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-3xl">edit_note</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Grade Input System</h3>
                    <p className="text-on-surface-variant max-w-md">Manual entry of grades per subject and assessment, and custom grading criteria.</p>
                  </div>
                  <div className="mt-12 h-40 bg-surface rounded-lg overflow-hidden relative border border-outline-variant/20">
                    <Image 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeusJ7ay5enNQyV6CZeFP-nTHki3i5HcMd7gKcwFyn5UlPZFlL01edQJfZCaJ5UiLAioQQiMjO4czfzeba2lRBitvJ-lqI0Q48h2I8gTiao9ugEz45IM617WDHztsfL0a5xY4r1PnlcDywndpLLiI-2WAS5V8TCZnHy66O6uOozlMzR2ZUnJFOm9LMu4XDnakW2A64uoMxuXZxDqNFeF4a1mDiRowBImCqr0Skl15QzEOEtZvs2GF_GFmRJZqWg05_eMii9mtjkGxi" 
                      alt="Dashboard Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Computation - Slide Up to Down */}
            <div className="md:col-span-4">
              <ScrollReveal direction="down" distance={100} duration={1} delay={0.2}>
                <div className="bg-surface-container-low p-10 rounded-xl flex flex-col neo-shadow-hover transition-all h-full">
                  <div className="mb-8 w-14 h-14 bg-primary flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-3xl text-white">calculate</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Subject Grade Computation</h3>
                  <p className="text-on-surface-variant">Automatic calculation of subject grades from weighted assessments.</p>
                </div>
              </ScrollReveal>
            </div>

            {/* Prediction - Slide Down to Up */}
            <div className="md:col-span-4">
              <ScrollReveal direction="up" distance={100} duration={1} delay={0.4}>
                <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col border border-outline-variant/10 neo-shadow-hover transition-all h-full">
                  <div className="mb-8 w-14 h-14 bg-primary flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-3xl text-white">query_stats</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Target Score Prediction</h3>
                  <p className="text-on-surface-variant">Predict the minimum score required to pass a subject or reach your target GPA.</p>
                </div>
              </ScrollReveal>
            </div>

            {/* GWA & Recommendation - Slide Right to Left */}
            <div className="md:col-span-8">
              <ScrollReveal direction="right" distance={100} duration={1} delay={0.6}>
                <div className="bg-brand-dark text-white p-10 rounded-xl grid md:grid-cols-2 gap-8 neo-shadow-hover transition-all h-full">
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4 text-brand-green">Recommendation System</h3>
                    <p className="text-zinc-400">Personalized advice on what to focus on based on your current performance.</p>
                  </div>
                  <div className="flex flex-col justify-center border-l border-white/10 pl-8">
                    <h3 className="text-2xl font-bold mb-4 text-brand-green">GWA Calculator</h3>
                    <p className="text-zinc-400">Calculate your GWA from different contexts to stay on top of your academic standing.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 bg-surface-container-low scroll-mt-24" id="how-it-works">
          <div className="max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up">
              <div className="mb-20">
                <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">Simple Steps to Track Your Academic Success</h2>
                <div className="w-24 h-2 bg-primary-container"></div>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Input Your Courses", desc: "Add your subjects and define grading criteria including course assessments like quizzes, activities, projects, and term exams with their weight percentages." },
                { step: "02", title: "Record Your Grades", desc: "Enter your scores for completed assessments. The system automatically calculates your current subject grade based on weighted components." },
                { step: "03", title: "Get Predictions", desc: "For upcoming assessments, Gradient predicts the minimum score you need to pass the subject or reach your target grade." },
                { step: "04", title: "Monitor & Improve", desc: "View your term GPA, academic year GWA, and running totals. Get personalized recommendations on which areas to focus on for improvement." }
              ].map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <div className="relative">
                    <span className="text-8xl font-black text-on-surface/[0.07] dark:text-on-surface/[0.12] absolute -top-10 -left-4">{item.step}</span>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                      <p className="text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* User Segments */}
        <section className="py-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "school", title: "Students", desc: "From elementary to college level, track your academic progress effectively." },
                { icon: "work", title: "Professionals", desc: "Monitor grades in courses or certifications with cumulative grading systems." },
                { icon: "auto_stories", title: "Lifelong Learners", desc: "Anyone committed to tracking and improving their educational performance." }
              ].map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.2}>
                  <div className="p-8 border border-outline-variant/30 rounded-lg hover:bg-surface-container-high transition-colors h-full">
                    <span className="material-symbols-outlined text-primary text-4xl mb-6">{item.icon}</span>
                    <h4 className="text-xl font-bold mb-3 uppercase">{item.title}</h4>
                    <p className="text-on-surface-variant">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-32 bg-surface-dim text-on-surface overflow-hidden scroll-mt-24" id="about">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <ScrollReveal direction="left">
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-black mb-6 uppercase text-primary">The Challenge</h2>
                    <p className="text-xl text-on-surface-variant leading-relaxed opacity-90">
                      Students often face difficulties in monitoring their academic performance due to ambiguous grade records, varied grading systems, and the lack of predictive tools. Gradient creates a unified source of truth.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black mb-6 uppercase text-primary">Our Solution</h2>
                    <p className="text-xl text-on-surface-variant leading-relaxed opacity-90">
                      Gradient is an Academic Tracker system that enables students to track their academic performance from the subject level to their final graduation standing. We provide automatic grade calculation and predictive scoring.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="right">
                <div className="relative">
                  <div className="aspect-square bg-surface-container-highest/10 rounded-2xl p-4 overflow-hidden relative">
                    <Image 
                      className="w-full h-full object-cover rounded-xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxOEMFMb8p005mCfy55W0Ka_CL4p9KogGVrZCplWmZKcw9whh5PDu6RMUaCkFDhqWGc4IfT4aZPCf_3rwVyq4qxKz39fLgkuqmpCekct-ANXdm5XSbQs5zKmW9Jgcmelt78S1jWHq-IMqKvrayBwpghtu5Kp4RrAxPQg8-cqRdFV3emyaWcORYYtrgxuICRubqmt4SE5y574w3gzGQdul5ukV_gO-2mGLmesNUH56YL6wy_mk3H2ejjZaiKsX3WxHgGuyh8C3CZfLn" 
                      alt="Study Setup"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-primary-container p-8 rounded-lg shadow-2xl">
                    <div className="text-on-primary-container font-black text-4xl">98%</div>
                    <div className="text-on-primary-container/80 font-bold uppercase text-xs tracking-widest">Accuracy in Grade Predictions</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <ScrollReveal direction="up">
        <CallToAction />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}
