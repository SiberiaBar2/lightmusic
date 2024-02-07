import { useEffect, useRef } from "react";

export const useThrottle = () => {
  const valid = useRef<boolean>(false);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const throttleCallback = (fn: Function, delay = 500) => {
    return (config?: unknown, ...args: unknown[]) => {
      if (valid.current) return;

      valid.current = true;
      timer.current = setTimeout(() => {
        valid.current = false;
        fn.apply(config, [config, ...args]);
      }, delay);
    };
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return throttleCallback;
};
