const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
export const cleanObject = <T extends { [key: string]: unknown }>(obj?: T) => {
  if (!obj) {
    return {} as T;
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
export const arrAdds = <T extends Record<string, any>>(
  arr: T[],
  key: string
) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map((ele: T) => {
      const getHttp = ele[key]?.slice(0, 4) as string;

      if (ele[key]?.slice(0, 5)[ele[key]?.slice(0, 5)?.length - 1] === "s")
        return ele;
      const getEnd = ele[key]?.slice(4) as string;
      const item = { ...ele };
      // item.imageUrl = getHttp + "s" + getEnd;
      (item as Record<string, any>)[key] = getHttp + "s" + getEnd;
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
  const pictUrl = getHttp + "s" + getEnd;

  return pictUrl;
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
