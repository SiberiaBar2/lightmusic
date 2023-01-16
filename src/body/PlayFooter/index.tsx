import { useSongIdSearchParam } from "./comutils";
import { Dynamic } from "./Dynamic";
import { StaticFooter } from "./StaticFooter";

export const PlayFooter = () => {
  const [param, setParam] = useSongIdSearchParam();
  const songId = param.songId;

  return (
    <>
      {songId ? (
        <Dynamic param={param} setParam={setParam} />
      ) : (
        <StaticFooter />
      )}
    </>
  );
};
