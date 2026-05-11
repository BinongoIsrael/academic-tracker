"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RecommendationPageClient() {
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<{ gpaVelocity: string; optimalTrajectory: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = async () => {
    setLoadingRecommendation(true);
    setRecommendation(null);
    setMilestones(null);
    setError(null);
    
    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setRecommendation(data.recommendation);
      setMilestones(data.milestones);

    } catch (err: any) {
      setError(err.message || "An error occurred while generating the recommendation.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-12">
      <main className="max-w-4xl mx-auto pt-6 lg:pt-10 px-8 pb-12">
        {/* Hero / Entry State */}
        <section className="mb-12">
          <div className="bg-surface-container-low rounded-xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
            <div className="flex-1 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>colors_spark</span>
                AI Powered Insights
              </span>
              <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-4 leading-none">Smart Insights</h1>
              <p className="text-on-surface-variant text-lg max-w-md mb-8">
                Leverage advanced academic analysis to predict outcomes and receive tailored curriculum recommendations.
              </p>
              <button
                onClick={handleGetRecommendation}
                disabled={loadingRecommendation}
                className="bg-brand-green text-brand-dark px-8 py-4 font-bold text-sm tracking-tight inline-flex items-center gap-2 transition-all duration-200 active:scale-95 hover:shadow-[4px_4px_0px_#191A23] group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingRecommendation ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">cyclone</span>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Recommendation
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
            <div className="w-64 h-64 bg-surface-container-highest rounded-full flex items-center justify-center relative shrink-0">
              <span className="material-symbols-outlined text-7xl text-primary/20">psychology</span>
              <div className="absolute inset-0 border-2 border-dashed border-outline-variant/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            </div>
          </div>
        </section>

        {/* Loading State Animation */}
        {loadingRecommendation && (
          <section className="mb-12 animate-in fade-in duration-500">
            <div className="bg-surface-container-lowest rounded-xl p-12 text-center shadow-[0_20px_40px_rgba(26,27,36,0.06)] border border-outline-variant/10">
              <div className="max-w-sm mx-auto flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary animate-spin">cyclone</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-on-surface">Analyzing Academic Profile</h3>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary w-full origin-left animate-[pulse-width_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Synthesizing performance nodes...</p>
              </div>
            </div>
          </section>
        )}

        {/* Result Presentation */}
        {(recommendation || error) && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {error && (
              <div className="bg-error-container/20 border border-error/10 rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-error text-4xl mb-4">error</span>
                <p className="text-error font-medium">{error}</p>
              </div>
            )}
            
            {recommendation && (
              <div className="space-y-8">
                <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
                  <article className="prose prose-slate max-w-none prose-headings:text-on-surface prose-headings:font-black prose-headings:tracking-tight prose-strong:text-on-surface prose-p:leading-relaxed prose-li:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendation}</ReactMarkdown>
                  </article>
                </div>

                {/* Projected Milestones */}
                <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
                  <h2 className="text-2xl font-bold mb-8 text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                    Projected Milestones
                  </h2>
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="text-5xl font-bold text-brand-green tracking-tighter w-24 tabular-nums">
                        {milestones?.gpaVelocity || "-.--"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface text-lg">GPA Velocity</h4>
                        <p className="text-sm text-on-surface-variant">Projected increase in overall cumulative average if current performance trends and suggestions are maintained.</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="text-5xl font-bold text-brand-green tracking-tighter w-24 tabular-nums">
                        {milestones?.optimalTrajectory || "---"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface text-lg">Optimal Trajectory</h4>
                        <p className="text-sm text-on-surface-variant">Estimated outcome based on prerequisite performance trends across your current curriculum.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
