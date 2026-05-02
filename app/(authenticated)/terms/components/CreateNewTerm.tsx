"use client";

import { CreateNewTermProps } from "@/types";
import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

export default function CreateNewTerm({ onCreateTerm }: CreateNewTermProps) {
  const [academicYear, setAcademicYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [semester, setSemester] = useState("1st");
  const [isExpanded, setIsExpanded] = useState(false);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const placeholderText = `${currentYear}-${nextYear}`;

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/[^\d-]/g, "");
    
    if (value.length <= 9) {
      if (value.length === 4 && !value.includes("-")) {
        value = value + "-";
      }
      const hyphenCount = (value.match(/-/g) || []).length;
      if (hyphenCount <= 1) {
        setAcademicYear(value);
      }
    }
  };

  const handleSubmit = () => {
    const academicYearPattern = /^\d{4}-\d{4}$/;
    if (!academicYearPattern.test(academicYear)) {
      alert(`Please enter academic year in format: YYYY-YYYY (e.g., ${placeholderText})`);
      return;
    }

    const [startYear, endYear] = academicYear.split("-").map(Number);
    
    if (endYear !== startYear + 1) {
      alert(`End year must be exactly one year after start year (e.g., ${placeholderText})`);
      return;
    }

    if (startYear >= endYear) {
      alert("Start year must be before end year");
      return;
    }

    onCreateTerm({ 
      academicYear, 
      startDate: startDate || null, 
      endDate: endDate || null, 
      semester 
    });
    
    setAcademicYear("");
    setStartDate("");
    setEndDate("");
    setSemester("1st");
    setIsExpanded(false); 
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.06)] mb-8 sm:mb-12 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 sm:p-8 flex items-center justify-between hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-on-primary-container text-xl">add</span>
          </div>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">
              Create New Term
            </h2>
            <p className="text-sm text-on-surface-variant font-medium">Initialize a new academic session</p>
          </div>
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100 border-t border-outline-variant/10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                Academic Year <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder={placeholderText}
                value={academicYear}
                onChange={handleAcademicYearChange}
                maxLength={9}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Semester <span className="text-error">*</span></label>
            <div className="flex flex-wrap gap-8">
              {["1st", "2nd", "summer"].map((sem) => (
                <label key={sem} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="semester"
                    value={sem}
                    checked={semester === sem}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors capitalize">
                    {sem === "summer" ? "Summer" : `${sem} Semester`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center gap-2"
            >
              Initialize Term
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}