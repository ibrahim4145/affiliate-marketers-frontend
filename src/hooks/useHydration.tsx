"use client";

import React, { useState, useEffect } from 'react';

/**
 * Custom hook to handle hydration safely
 * Prevents hydration mismatches by ensuring client-side only code runs after hydration
 */
export function useHydration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Higher-order component to prevent hydration mismatches
 * Shows loading state until component is mounted on client
 */
export function withHydrationSafety<T extends object>(
  Component: React.ComponentType<T>,
  LoadingComponent?: React.ComponentType
) {
  return function HydrationSafeComponent(props: T) {
    const mounted = useHydration();

    if (!mounted) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-slate-600 text-sm">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
