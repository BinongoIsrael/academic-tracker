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

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error('Failed to parse response from server.');
      }

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
      <main className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
        {/* Hero / Entry State */}
        <section className="mb-12">
          <div className="bg-surface-container-low rounded-xl p-6 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
            <div className="flex-1 z-10 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>colors_spark</span>
                AI Powered Insights
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface mb-4 leading-none">Smart Insights</h1>
              <p className="text-on-surface-variant text-base md:text-lg max-w-md mb-8 mx-auto md:mx-0">
                Leverage advanced academic analysis to predict outcomes and receive tailored curriculum recommendations.
              </p>
              <button
                onClick={handleGetRecommendation}
                disabled={loadingRecommendation}
                className="bg-brand-green text-brand-dark px-6 md:px-8 py-3 md:py-4 font-bold text-sm tracking-tight inline-flex items-center gap-2 transition-all duration-200 active:scale-95 hover:shadow-[4px_4px_0px_#191A23] group disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="w-48 h-48 md:w-64 md:h-64 bg-surface-container-highest rounded-full flex items-center justify-center relative shrink-0">
              <span className="material-symbols-outlined text-5xl md:text-7xl text-primary/20">psychology</span>
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
                <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)] border border-outline-variant/10">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-black text-on-surface mb-6 mt-8 flex items-center gap-3 border-b border-outline-variant/20 pb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-black text-on-surface mb-4 mt-8 flex items-center gap-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold text-primary mb-3 mt-6 uppercase tracking-wider" {...props} />,
                        p: ({node, ...props}) => <p className="text-on-surface-variant leading-relaxed mb-4 text-base font-medium" {...props} />,
                        ul: ({node, ...props}) => <ul className="space-y-3 mb-6 ml-4" {...props} />,
                        ol: ({node, ...props}) => <ol className="space-y-3 mb-6 ml-4 list-decimal" {...props} />,
                        li: ({node, ...props}) => (
                          <li className="flex items-start gap-3 group">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0 group-hover:scale-125 transition-transform" />
                            <div className="text-on-surface-variant font-medium flex-1">{props.children}</div>
                          </li>
                        ),
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-brand-green bg-surface-container-low/50 p-6 my-8 rounded-r-xl italic text-on-surface/90 relative overflow-hidden" {...props}>
                            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl text-brand-green/10 select-none">format_quote</span>
                            {props.children}
                          </blockquote>
                        ),
                        strong: ({node, ...props}) => <strong className="font-extrabold text-on-surface bg-brand-green/10 px-0.5 rounded" {...props} />,
                        code: ({node, ...props}) => <code className="bg-surface-container-high px-1.5 py-0.5 rounded font-mono text-[11px] text-primary font-bold border border-outline-variant/20" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-10 border-outline-variant/20" {...props} />,
                      }}
                    >
                      {recommendation}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Projected Milestones */}
                <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
                  <h2 className="text-2xl font-bold mb-8 text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                    Projected Milestones
                  </h2>
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="text-5xl font-bold text-brand-green tracking-tighter shrink-0 min-w-[120px] tabular-nums">
                        {milestones?.gpaVelocity || "-.--"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface text-lg">GPA Velocity</h4>
                        <p className="text-sm text-on-surface-variant">Projected increase in overall cumulative average if current performance trends and suggestions are maintained.</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="text-5xl font-bold text-brand-green tracking-tighter shrink-0 min-w-[120px] tabular-nums">
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
