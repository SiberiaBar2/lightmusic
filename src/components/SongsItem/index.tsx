import { useDispatch, useSelector } from "react-redux";
import { useCheckMusic } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";
import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";
// import { useMemo, useRef } from "react";

const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, customrender, item, ...other } = props;
  const { id, name } = item;

  // const clickRef = useRef(0);

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

  // useMemo(() => {
  //   console.log("clickRef.current", clickRef.current);
  // }, [clickRef.current]);

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
  // 是否播放的是当前项，如果是 则添加 active 效果，并禁止重复点击的保存！
  const isActive = () => {
    return item.id === songId;
  };

  return (
    <div
      style={{
        // color: !isUse(id) ? "rgb(116, 120, 122)" : "",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
        color: isActive() ? "rgb(136, 58, 30)" : "",
        padding: "1rem 0.3rem",
        background: isActive() ? "rgb(228, 151, 157)" : "",
        borderRadius: "0.3rem",
      }}
      // {...isClick}
      onClick={() => {
        // if (isActive()) return;
        dispatch(
          songsInfo({
            ...songsState,
            songId: id,
            song: songindex,
            prevornext: String(songidlist),
          })
        );
        dispatch(changePlay({ play: false }));
        // clickRef.current += 1;
      }}
    >
      <span>{name}</span>
      {customrender ? customrender(item) : null}
    </div>
  );
};

export default SongsItem;
