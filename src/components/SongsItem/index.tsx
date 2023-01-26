import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useCheckMusic } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";
import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";

const SongsItem = (props: childrenReturnType) => {
  const { id, name, songIndex, songIdList, customRender, ...other } = props;

  // const [param, setParam] = useSongIdSearchParam();
  const check = useCheckMusic();
  const dispatch = useDispatch();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

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
      onClick={() => {
        dispatch(
          songsInfo({
            ...songsState,
            songId: id,
            song: songIndex,
            prevornext: String(songIdList),
          })
        );
        dispatch(changePlay({ play: false }));
      }}
    >
      <span>{name}</span>
      {customRender ? customRender(other) : null}
    </div>
  );
};

export default SongsItem;
