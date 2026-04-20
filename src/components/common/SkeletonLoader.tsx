import React from 'react';

export function CardSkeleton() {
  return (
    <div className="premium-card p-6 rounded-2xl animate-pulse">
      <div className="flex justify-between items-start mb-4 flex-row-reverse">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-24 flex-shrink-0" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-lg w-full" />
        <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
      </div>
    </div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <div className="premium-card p-6 rounded-2xl text-center animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 mx-auto mb-4" />
      <div className="h-5 bg-slate-200 rounded-lg w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-slate-100 rounded-lg w-2/3 mx-auto mb-4" />
      <div className="flex items-center justify-center gap-1 mb-4">
        <div className="h-4 bg-slate-200 rounded-lg w-12" />
      </div>
      <div className="h-9 bg-slate-200 rounded-lg w-full" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="premium-card p-8 rounded-[2.5rem] animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-slate-200 mb-8" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded-lg w-24" />
        <div className="h-8 bg-slate-200 rounded-lg w-32" />
      </div>
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-100 rounded-lg w-full" />
          <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-6 flex-shrink-0" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-100 rounded-2xl p-4 h-20" />
        ))}
      </div>
    </div>
  );
}
