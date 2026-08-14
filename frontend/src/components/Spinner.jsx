import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
