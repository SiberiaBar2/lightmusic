import { useMemo } from "react";
import { useQueryParam } from "hooks";

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
