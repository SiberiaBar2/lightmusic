import _ from "lodash";
import { MouseEvent } from "react";

const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
export const cleanObject = (obj?: { [key: string]: unknown }) => {
  if (!obj) {
    return {};
  }

  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    if (isVoid(result[key])) {
      delete result[key];
    }
  });

  return result;
};

// 为数组对象的图片地址http添加s
export const arrAdds = (arr: any[], key: string) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map((ele: any) => {
      const getHttp = ele[key]?.slice(0, 4) as string;

      if (ele[key]?.slice(0, 5)[ele[key]?.slice(0, 5)?.length - 1] === "s")
        return ele;
      const getEnd = ele[key]?.slice(4) as string;
      const item = { ...ele };
      item.imageUrl = getHttp + "s" + getEnd;
      return item;
    });
  }
  return [];
};

export const stringAdds = (str: string) => {
  if (!str) return "";
  if (str.slice(0, 5)[str.slice(0, 5).length - 1] === "s") return str;
  const getHttp = str.slice(0, 4);
  const getEnd = str.slice(4);
  return getHttp + "s" + getEnd;
};

// 传参的防抖
export function debounce<T extends (e: unknown) => void>(
  fn: T,
  delaty: number
) {
  let timer: null | NodeJS.Timeout = null;
  return function (this: object, ...args: [key: unknown]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delaty);
  };
}
