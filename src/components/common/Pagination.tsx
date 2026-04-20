import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8" dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-[#E2E8F0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F0F4F8] transition-colors"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
          .map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-black transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-[#E2E8F0] hover:bg-[#F0F4F8]'
              }`}
            >
              {page}
            </button>
          ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-[#E2E8F0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F0F4F8] transition-colors"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
