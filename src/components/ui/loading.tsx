import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-driver-green" />
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-driver-green" />
    </div>
  );
} 