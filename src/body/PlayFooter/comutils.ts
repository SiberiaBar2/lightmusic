import { useMemo } from "react";
import { useQueryParam } from "hooks";
import qs from "qs";

export const useSongIdSearchParam = () => {
  const [param, setParam] = useQueryParam(["songId", "song", "prevornext"]);

  return [
    useMemo(
      () => ({ ...param, songId: Number(param.songId) || undefined }),
      [param]
    ),
    setParam,
  ] as const; // as const 解决了使用时 变量和函数类型报错的问题
};

export const useSongParam = () => {
  const [param] = useSongIdSearchParam();

  return `?${qs.stringify(param)}`;
};
