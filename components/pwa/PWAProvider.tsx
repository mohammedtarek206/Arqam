'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  deferredPrompt: any;
  showInstallPrompt: () => void;
  hideInstallPrompt: () => void;
  isIOS: boolean;
  showIOSPrompt: boolean;
  setShowIOSPrompt: (v: boolean) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if it's already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if the user is on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);
    
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      const hasDismissedIOS = localStorage.getItem('iosPwaPromptDismissed');
      if (!hasDismissedIOS) {
        setShowIOSPrompt(true);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      // Optional: send analytics that it was installed
      fetch('/api/analytics/pwa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'installed' })
      }).catch(() => {});
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = () => {
    // Analytics
    fetch('/api/analytics/pwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'prompt_shown' })
    }).catch(() => {});
  };

  const hideInstallPrompt = () => {
    setIsInstallable(false);
    // Analytics
    fetch('/api/analytics/pwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'prompt_dismissed' })
    }).catch(() => {});
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        deferredPrompt,
        showInstallPrompt,
        hideInstallPrompt,
        isIOS,
        showIOSPrompt,
        setShowIOSPrompt
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
