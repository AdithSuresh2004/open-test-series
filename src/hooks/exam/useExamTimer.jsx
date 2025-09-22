import { useCallback, useEffect, useRef, useState } from "react";

export function useExamTimer(initialSeconds = 0, running = false) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(running);
  const [isInitialized, setIsInitialized] = useState(false); 
  const latestInitial = useRef(initialSeconds);
  const intervalRef = useRef(null);

  // Update initialSeconds when it changes
  useEffect(() => {
    if (initialSeconds > 0) {
      latestInitial.current = initialSeconds;
      setTimeRemaining(initialSeconds);
      setIsInitialized(true); // Only mark as initialized when we have a valid duration
    } else {
      setIsInitialized(false);
      setTimeRemaining(0);
    }
  }, [initialSeconds]);

  useEffect(() => {
    // Only run the interval if timer is initialized and running
    if (isRunning && timeRemaining > 0 && isInitialized) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear interval if conditions aren't met
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, isInitialized]);

  const start = useCallback(() => {
    if (isInitialized) {
      setIsRunning(true);
    }
  }, [isInitialized]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(
    (next = latestInitial.current) => {
      if (next > 0) {
        latestInitial.current = next;
        setTimeRemaining(next);
        setIsInitialized(true);
      } else {
        setTimeRemaining(0);
        setIsInitialized(false);
      }
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    []
  );

  const elapsed = isInitialized ? Math.max(0, latestInitial.current - timeRemaining) : 0;

  const isTimeExpired = isInitialized && timeRemaining === 0 && latestInitial.current > 0;

  return { 
    timeRemaining, 
    elapsed, 
    isRunning, 
    isInitialized,
    isTimeExpired,
    start, 
    stop, 
    reset 
  };
}