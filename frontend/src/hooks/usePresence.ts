'use client';
import { useEffect, useRef } from 'react';
import api from '@/lib/api';

export function usePresence() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ping = () => {
      const tabActive = document.visibilityState === 'visible';
      api.post('/presence', { tab_active: tabActive }).catch(() => {});
    };

    ping();
    intervalRef.current = setInterval(ping, 5000);
    document.addEventListener('visibilitychange', ping);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', ping);
    };
  }, []);
}
