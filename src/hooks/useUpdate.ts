import { log } from "console";
import { useEffect, useRef } from "react";

/**
 * 有时我们并不希望在react初次渲染时就执行某些函数，
 *
 * 而是希望在后续的组件重渲中执行
 */

enum Nums {
  zero,
  one,
}

export const useUpdate = (
  callback: () => void,
  deps: unknown[],
  unMount?: () => void
) => {
  const count = useRef(Nums.zero);

  useEffect(() => {
    count.current += Nums.one;

    console.log("count.current", count.current);

    if (count.current === Nums.one) {
      return;
    }

    console.log("sadadasdsadasd");

    callback();

    return unMount && unMount();
  }, [...deps]);
};
