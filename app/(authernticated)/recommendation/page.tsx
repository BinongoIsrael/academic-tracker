"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RecommendationPage() {
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = async () => {
    setLoadingRecommendation(true);
    setRecommendation(null);
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

    } catch (err: any) {
      setError(err.message || "An error occurred while generating the recommendation.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-4 sm:p-8 pt-8 sm:pt-8 pb-24 ml-0 lg:ml-[325px]">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">AI Academic Advisor</h1>
          <p className="text-slate-500 mb-8">
            Get personalized recommendations for your current term to stay ahead.
          </p>
          
          <div className="bg-white border-2 border-black rounded-[45px] p-6 sm:p-8 shadow-[0_5px_0_#191A23]">
            {!recommendation && !error && (
              <div className="flex flex-col items-center text-center">
                <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
                <h2 className="text-2xl font-medium mb-2">Ready for your analysis?</h2>
                <p className="text-slate-600 max-w-lg mb-6">
                  I'll analyze your current term's courses and assessments to provide proactive advice on where to focus your efforts.
                </p>
                
                <button
                  onClick={handleGetRecommendation}
                  disabled={loadingRecommendation}
                  className="bg-purple-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-purple-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingRecommendation ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Recommendation
                    </>
                  )}
                </button>
              </div>
            )}
            
            {(recommendation || error) && (
              <div className="text-left">
                {error && (
                  <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                    <p>{error}</p>
                  </div>
                )}
                {recommendation && (
                  <div className="prose prose-slate max-w-none prose-h3:font-bold prose-h3:text-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendation}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}