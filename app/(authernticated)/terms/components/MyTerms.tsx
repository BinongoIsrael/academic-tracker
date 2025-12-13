"use client";

import { MyTermsProps } from "@/types";
import TermCard from "./TermCard";
import { Calendar } from "lucide-react";

export default function MyTerms({ terms, onEditTerm, onAddCourse }: MyTermsProps) {
   const currentDate = new Date();

  const termsWithDates = terms.filter(
    (term) => term.startDate && term.endDate
  );

  const activeTerm = termsWithDates.find((term) => {
    const startDate = new Date(term.startDate!);
    const endDate = new Date(term.endDate!);
    
    return currentDate >= startDate && currentDate <= endDate;
  });

  const pastTerms = termsWithDates.filter((term) => {
    const endDate = new Date(term.endDate!);
    return currentDate > endDate;
  });

  const futureTerms = termsWithDates.filter((term) => {
    const startDate = new Date(term.startDate!);
    return currentDate < startDate;
  });

  return (
    <div className="w-full max-w-[1024px] bg-white border-2 border-black rounded-3xl sm:rounded-[45px] shadow-brand p-6 sm:p-8">
      <div className="inline-flex items-center px-2 py-0.5 mb-6">
        <span className="text-xl sm:text-2xl lg:text-[30px] leading-tight font-medium text-black">
          My Terms
        </span>
      </div>

      {terms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No Terms Yet</h3>
          <p className="text-center text-gray-600 max-w-md mb-6">
            You haven&apos;t created any academic terms yet. Start by creating your first term using the form above to organize your courses and track your academic progress.
          </p>
        </div>
      ) : (
        <>
          {activeTerm && (
            <div className="mb-8">
              <TermCard
                term={{ ...activeTerm, isActive: true }}
                onEdit={onEditTerm}
                onAddCourse={onAddCourse}
              />
            </div>
          )}

          {futureTerms.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-black">
                  Upcoming Terms
                </h3>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="space-y-4 mb-8">
                {futureTerms.map((term) => (
                  <TermCard 
                    key={term.id} 
                    term={{ ...term, isActive: false }} 
                    onEdit={onEditTerm} 
                  />
                ))}
              </div>
            </>
          )}

          {pastTerms.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-black">
                  Past Terms
                </h3>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="space-y-4">
                {pastTerms.map((term) => (
                  <TermCard 
                    key={term.id} 
                    term={{ ...term, isActive: false }} 
                    onEdit={onEditTerm} 
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}