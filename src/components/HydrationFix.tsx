"use client";

import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // Remove any attributes that might be added by browser extensions
    const removeExternalAttributes = () => {
      const html = document.documentElement;
      const attributesToRemove = ['data-arp', 'data-adblock', 'data-adblocker'];
      
      attributesToRemove.forEach(attr => {
        if (html.hasAttribute(attr)) {
          html.removeAttribute(attr);
        }
      });
    };

    // Run immediately
    removeExternalAttributes();

    // Also run after a short delay to catch late-loading extensions
    const timeoutId = setTimeout(removeExternalAttributes, 100);

    // Cleanup
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
