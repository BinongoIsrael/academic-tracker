"use client";

import { MyTermsProps } from "@/types";
import TermCard from "./TermCard";
import { Calendar } from "lucide-react";

export default function MyTerms({ terms, onEditTerm, onAddCourse }: MyTermsProps) {
  
  const currentDate = new Date();

  const termsWithDates = terms.filter(
    (term) => term.startDate && term.endDate
  );

  const termsWithoutDates = terms.filter(
    (term) => !term.startDate || !term.endDate
  );

  const activeTerms = termsWithDates.filter((term) => {
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

  if (terms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">calendar_today</span>
        </div>
        <h3 className="text-empty-state text-on-surface mb-2">No Terms Records Found</h3>
        <p className="text-center text-on-surface-variant max-w-md mb-8">
          Your academic lifecycle is currently empty. Start by initializing your first term to begin tracking your educational trajectory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 mt-12">
      {/* Section: ACTIVE */}
      {activeTerms.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Active Terms</h2>
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black rounded-full uppercase tracking-tighter">Current Lifecycle</span>
            </div>
            <div className="h-[1px] flex-1 bg-outline-variant/20 ml-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTerms.map((term) => (
              <TermCard
                key={term.id}
                term={{ ...term, isActive: true }}
                onEdit={onEditTerm}
                onAddCourse={onAddCourse}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section: UNSCHEDULED */}
      {termsWithoutDates.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Unscheduled Terms</h2>
              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-tighter">Pending Dates</span>
            </div>
            <div className="h-[1px] flex-1 bg-outline-variant/20 ml-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {termsWithoutDates.map((term) => (
              <TermCard
                key={term.id}
                term={{ ...term, isActive: false, isUnscheduled: true }}
                onEdit={onEditTerm}
                onAddCourse={onAddCourse}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section: UPCOMING */}
      {futureTerms.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Upcoming Terms</h2>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-tighter">Drafted Pipeline</span>
            </div>
            <div className="h-[1px] flex-1 bg-outline-variant/20 ml-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureTerms.map((term) => (
              <TermCard 
                key={term.id} 
                term={{ ...term, isActive: false, isUpcoming: true }} 
                onEdit={onEditTerm} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Section: PAST */}
      {pastTerms.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Past Terms</h2>
            </div>
            <div className="h-[1px] flex-1 bg-outline-variant/20 ml-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastTerms.map((term) => (
              <TermCard 
                key={term.id}
                term={{ ...term, isActive: false, isPast: true }} 
                onEdit={onEditTerm} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}