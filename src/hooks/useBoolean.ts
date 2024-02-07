import { useRef } from "react";

export const useBoolean = (initValue = false) => {
  const value = useRef(initValue);

  const on = () => {
    value.current = true;
  };
  const off = () => {
    value.current = false;
  };
  const toggle = () => {
    value.current = !value.current;
  };

  return [value, { toggle, on, off }] as const;
};
