import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient",
  description: "Plan Smarter, Study Better, Grow Stronger. Track grades, compute GPA/GWA, and predict scores needed to reach your goals.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-1 md:py-5">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-md">
            Plan Smarter Study Better Grow Stronger
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
            Aiming to help students monitor grades, compute GPA/GWA, and predict
            the scores needed to reach their goals. With personalized insights
            and simple tools, Gradient empowers learners to stay on track,
            improve performance, and achieve academic success.
          </p>
        </div>
      </section>

      <section
        id="features"
        className="bg-white py-16 md:py-8"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex justify-center mb-8">
            <div className="inline-flex px-4 py-2 bg-brand-green rounded-lg">
              <span className="text-3xl font-medium">Features</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative bg-white border border-black rounded-[45px] p-10 shadow-brand hover:shadow-brand-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-brand-green rounded-lg text-3xl font-medium">
                  Grade Input
                </span>
                <span className="inline-block px-3 py-1 bg-brand-green rounded-lg text-3xl font-medium">
                  System
                </span>
              </div>
              <p className="text-2xl font-medium text-brand-dark leading-8">
                Manual entry of grades per subject and assessment, and custom grading criteria
              </p>
            </div>

            <div className="relative bg-brand-green border border-black rounded-[45px] p-10 shadow-brand-dark hover:shadow-brand-dark-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-gray-200 rounded-lg text-3xl font-medium">
                  Subject Grade
                </span>
                <span className="inline-block px-3 py-1 bg-gray-200 rounded-lg text-3xl font-medium">
                  Computation
                </span>
              </div>
              <p className="text-2xl font-medium text-black leading-8">
                Automatic calculation of subject grades from weighted assessments
              </p>
            </div>

            <div className="relative bg-brand-green border border-black rounded-[45px] p-10 shadow-brand hover:shadow-brand-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-white rounded-lg text-3xl font-medium">
                  Target Score
                </span>
                <span className="inline-block px-3 py-1 bg-white rounded-lg text-3xl font-medium">
                  Prediction
                </span>
              </div>
              <p className="text-2xl font-medium text-black leading-8">
                Predict the minimum score required to pass a subject/reach target GPA
              </p>
            </div>

            <div className="relative bg-brand-green border border-black rounded-[45px] p-10 shadow-brand hover:shadow-brand-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-white rounded-lg text-3xl font-medium">
                  GWA
                </span>
                <span className="inline-block px-3 py-1 bg-white rounded-lg text-3xl font-medium">
                  Calculator
                </span>
              </div>
              <p className="text-2xl font-medium text-brand-dark leading-8">
                Calculate your GWA from different contexts
              </p>
            </div>

            <div className="relative bg-gray-100 border border-black rounded-[45px] p-10 shadow-brand hover:shadow-brand-lg hover:-translate-y-1 transition-all duration-200 md:col-span-2 md:max-w-xl md:mx-auto md:w-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-brand-green rounded-lg text-3xl font-medium">
                  Recommendation
                </span>
                <span className="inline-block px-3 py-1 bg-brand-green rounded-lg text-3xl font-medium">
                  System
                </span>
              </div>
              <p className="text-2xl font-medium text-brand-dark leading-8">
                Personalized advice on what to focus on
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-50 py-16 md:py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center mb-16">
            <div className="inline-flex px-4 py-2 bg-brand-green rounded-lg mb-6">
              <span className="text-3xl font-medium">How It Works</span>
            </div>
            <h2 className="mb-6">
              Simple Steps to Track Your Academic Success
            </h2>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              Gradient streamlines your academic tracking process through an
              intuitive workflow designed to help you stay on top of your
              performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-black rounded-3xl p-8 shadow-brand">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="mb-3">Input Your Courses</h4>
              <p className="text-gray-600">
                Add your subjects and define grading criteria including course
                assessments like quizzes, activities, projects, and term exams
                with their weight percentages.
              </p>
            </div>

            <div className="bg-white border border-black rounded-3xl p-8 shadow-brand">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="mb-3">Record Your Grades</h4>
              <p className="text-gray-600">
                Enter your scores for completed assessments. The system
                automatically calculates your current subject grade based on
                weighted components.
              </p>
            </div>

            <div className="bg-white border border-black rounded-3xl p-8 shadow-brand">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="mb-3">Get Predictions</h4>
              <p className="text-gray-600">
                For upcoming assessments, Gradient predicts the minimum score
                you need to pass the subject or reach your target grade.
              </p>
            </div>

            <div className="bg-white border border-black rounded-3xl p-8 shadow-brand">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                4
              </div>
              <h4 className="mb-3">Monitor & Improve</h4>
              <p className="text-gray-600">
                View your term GPA, academic year GWA, and running totals. Get
                personalized recommendations on which areas to focus on for
                improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-16 md:py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center mb-16">
            <div className="inline-flex px-4 py-2 bg-brand-green rounded-lg mb-6">
              <span className="text-3xl font-medium">About Gradient</span>
            </div>
            <h2 className="mb-6">
              Empowering Students Through Data-Driven Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10">
              <h3 className="mb-6">The Challenge</h3>
              <p className="text-gray-600 mb-4">
                Students often face difficulties in monitoring their academic
                performance due to ambiguous grade records, varied grading
                systems, and the lack of predictive tools to know how much more
                they need to score to achieve their goals.
              </p>
              <p className="text-gray-600">
                While GPA and GWA are key measures of academic standing, many
                students do not have a centralized platform that combines grade
                tracking, GPA/GWA computation, and predictive grade calculation
                in one system. This leads to uncertainty in planning and
                prioritizing academic efforts.
              </p>
            </div>
            <div className="bg-brand-green border border-black rounded-3xl p-10 shadow-brand">
              <h3 className="mb-6">Our Solution</h3>
              <p className="text-brand-dark mb-4">
                Gradient is an Academic Tracker system that enables students to
                track their academic performance from the subject level to their
                final graduation standing.
              </p>
              <p className="text-brand-dark">
                We provide automatic grade calculation, predictive scoring, and
                personalized recommendations to help students understand their
                current standing, set performance goals, and plan their study
                efforts effectively.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="mb-3">Students</h4>
              <p className="text-gray-600">
                From elementary to college level, track your academic progress
                effectively.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="mb-3">Professionals</h4>
              <p className="text-gray-600">
                Monitor grades in courses or certifications with cumulative
                grading systems.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-3">Lifelong Learners</h4>
              <p className="text-gray-600">
                Anyone committed to tracking and improving their educational
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallToAction/>
      <Footer />
    </div>
  );
}
