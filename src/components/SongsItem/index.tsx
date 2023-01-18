import { message } from "antd";
import { useCheckMusic } from "body/PlayFooter/utils";
import { useSongIdSearchParam } from "body/PlayFooter/comutils";
import { childrenReturnType } from "components/CardList";

const SongsItem = (props: childrenReturnType) => {
  const { id, name, songIndex, songIdList, customRender, ...other } = props;

  const [param, setParam] = useSongIdSearchParam();
  const check = useCheckMusic();

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
            song: songIndex,
            prevornext: String(songIdList),
          }),
      }
    : {
        // onClick: () => message.error("暂无版权", 2),
      };

  return (
    <div
      style={{
        // color: !isUse(id) ? "rgb(116, 120, 122)" : "",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
      }}
      // {...isClick}
      onClick={() =>
        setParam({
          ...param,
          songId: id,
          song: songIndex,
          prevornext: String(songIdList),
        })
      }
    >
      <span>{name}</span>
      {customRender ? customRender(other) : null}
    </div>
  );
};

export default SongsItem;
