import { forwardRef, useImperativeHandle } from "react";
import { message } from "antd";
import { useCheckMusic } from "body/PlayFooter/utils";
import { useSongIdSearchParam } from "body/PlayFooter/comutils";

const SongsItem = (props: any, ref: any) => {
  const { id, name, prev, next, songIndex, songIdList } = props;
  const [param, setParam] = useSongIdSearchParam();
  const check = useCheckMusic();

  console.log("songIdList", String(songIdList));

  const isUse = (id: number) => {
    const { data } = check(id);
    return data?.success;
  };

  const isClick = isUse(id)
    ? {
        onClick: () =>
          setParam({
            ...param,
            songId: id,
            prev: prev,
            next: next,
            song: songIndex,
            prevornext: String(songIdList),
          }),
      }
    : {
        onClick: () => message.error("暂无版权", 2),
      };

  // useImperativeHandle(ref, () => ({
  //   songIndex,
  //   songIdList,
  // }));

  return (
    <div
      style={{
        color: isUse(id) === false ? "rgb(116, 120, 122)" : "",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span {...isClick}>{name}</span>
    </div>
  );
};

export default SongsItem;
