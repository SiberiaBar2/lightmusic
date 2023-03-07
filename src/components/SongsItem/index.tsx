import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useCheckMusic } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";
import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";

const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, customrender, item, ...other } = props;
  const { id, name } = item;

  const check = useCheckMusic();
  const dispatch = useDispatch();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { songId } = songsState;
  const isUse = (id: number) => {
    const { data } = check(id);
    return data?.success;
  };

  // const isClick = isUse(id)
  //   ? {
  //       onClick: () =>
  //         setParam({
  //           ...param,
  //           songId: id,
  //           song: songIndex,
  //           prevornext: String(songIdList),
  //         }),
  //     }
  //   : {
  //       onClick: () => message.error("暂无版权", 2),
  //     };
  const isActive = () => {
    if (item.id === songId) {
      return "rgb(228, 151, 157)";
    }
    return "";
  };

  return (
    <div
      style={{
        // color: !isUse(id) ? "rgb(116, 120, 122)" : "",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
        color: isActive(),
      }}
      // {...isClick}
      onClick={() => {
        dispatch(
          songsInfo({
            ...songsState,
            songId: id,
            song: songindex,
            prevornext: String(songidlist),
          })
        );
        dispatch(changePlay({ play: false }));
      }}
    >
      <span>{name}</span>
      {customrender ? customrender(item) : null}
    </div>
  );
};

export default SongsItem;
