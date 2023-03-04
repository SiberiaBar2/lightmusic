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

export const arrAdds = (arr: any[], key: string) => {
  if (Array.isArray(arr))
    return arr.map((ele: any) => {
      const getHttp = ele[key].slice(0, 4) as string;
      if (getHttp[getHttp.length - 1] === "s") return ele;
      const getEnd = ele[key].slice(4) as string;
      const item = { ...ele };
      item.imageUrl = getHttp + "s" + getEnd;
      return item;
    });
  return [];
};
