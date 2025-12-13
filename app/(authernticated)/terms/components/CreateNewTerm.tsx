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
    <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] mb-8 sm:mb-12 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">
            Create New Term
          </h2>
        </div>
        <ChevronDown 
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-8 pb-4 sm:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={placeholderText}
                value={academicYear}
                onChange={handleAcademicYearChange}
                maxLength={9}
                className="h-10 px-3 border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 px-3 border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 px-3 border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-900">Semester <span className="text-red-500">*</span></span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="semester"
                value="1st"
                checked={semester === "1st"}
                onChange={(e) => setSemester(e.target.value)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-brand-green"
              />
              <span className="text-sm font-medium text-black">1st Semester</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="semester"
                value="2nd"
                checked={semester === "2nd"}
                onChange={(e) => setSemester(e.target.value)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-brand-green"
              />
              <span className="text-sm font-medium text-black">2nd Semester</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="semester"
                value="summer"
                checked={semester === "summer"}
                onChange={(e) => setSemester(e.target.value)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-brand-green"
              />
              <span className="text-sm font-medium text-black">Summer</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleSubmit}
              className="h-10 px-4 bg-brand-green text-black rounded-md font-medium text-sm hover:bg-green-light transition-colors"
            >
              Create Term
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}