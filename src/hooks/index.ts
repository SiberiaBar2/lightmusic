import React, { useRef, useEffect, MutableRefObject } from "react";

export const useMount = (callBack: () => void) => {
  useEffect(() => {
    callBack();
  }, []);
};

export const useInterVal = (callback: () => void, delaty: number | null) => {
  const savedCallback: MutableRefObject<any> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    // 暂停
    if (delaty !== null) {
      const id = setInterval(tick, delaty);
      return () => clearInterval(id);
    }
  }, [delaty]);
};
