import { useEffect, useRef } from "react";
import _ from "lodash";

export const useFuncDebounce = function () {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  /**
   *
   * @param callback 被防抖的函数
   * @param delay 函数延迟执行时间
   * @param change 选择是否改变this指向
   * @returns Function
   */
  function debouncedCallback<
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends Function,
    K,
    U extends unknown[]
  >(callback: T, delay = 500, change = true) {
    return function (object?: K, ...args: U) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(function () {
        if (change && _.isObject(object)) {
          callback.apply(object, [object, ...args]);
        } else {
          callback(object, ...args);
        }
      }, delay);
    };
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  });

  return debouncedCallback;
};
