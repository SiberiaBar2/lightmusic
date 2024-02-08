import { MouseEvent, useCallback } from "react";
import { Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import _ from "lodash";
import { Like as ParkLike } from "@icon-park/react";

import { useCheckMusic, useLike } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";

import { songsState } from "store/songs";
import { likeState, changelike } from "store/ilike";
import { RootState } from "store";
import { useDouble } from "body/utils";
import { Keys } from "types";
import { useFuncDebounce } from "hooks";
const cookie = localStorage.getItem("cookie");

const SONGSTYPE: { [x: number]: string } = {
  [Keys.zero]: "", // 免费或无版权
  [Keys.single]: "vip", // VIP 歌曲
  [Keys.fourth]: "", // 购买专辑
  [Keys.eightth]: "", // 非会员可免费播放低音质，会员可播放高音质及下载
};

const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, customrender, item, ...other } = props;
  const { id, name, fee } = item;

  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const dispatch = useDispatch();
  const { likes } = likeState;

  console.log("likes", likes);

  // const backTopRef = useRef() as MutableRefObject<any>;
  // const backTopInstance = backTopRef.current;
  const check = useCheckMusic();
  const debouncedCallback = useFuncDebounce();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const [strategy, debounce] = useDouble<
    string | number,
    number | undefined,
    string | undefined
  >(id, songindex, String(songidlist));

  const { songId } = songsState;
  const isUse = (id: number) => {
    const { data } = check(id);
    return data?.success;
  };

  // const canUse = isUse(id);
  // console.log("isUse", isUse(id));

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

  const { mutate: tolike } = useLike();
  const islike = likes.includes(id);

  const getMsgColor = (msg: string) =>
    message.warning({
      content: (
        <span
          style={{
            color: "rgb(240, 124, 130)",
          }}
        >
          {msg}
        </span>
      ),
    });
  const likeMusci = useCallback(() => {
    // 不再喜欢
    if (islike && cookie) {
      // 更新接口
      setTimeout(
        () =>
          tolike({
            id: id,
            like: false,
            cookie: cookie,
            timerstamp: Date.now(),
          }),
        1000
      );
      // 更新redux
      const like = likes.filter((item) => item !== id);

      dispatch(
        changelike({
          likes: like,
        })
      );
      getMsgColor("已从我喜欢移除");
      return;
    }
    // 喜欢歌曲
    if (!islike && cookie) {
      setTimeout(
        () =>
          tolike({
            id: songId,
            like: true,
            cookie: cookie,
            timerstamp: Date.now(),
          }),
        1000
      );

      const like = _.cloneDeep(likes);
      like.unshift(id as number);

      // console.log("songId", songId, "likelist", like);

      dispatch(
        changelike({
          likes: like,
        })
      );
      getMsgColor("已添加到我喜欢");
      return;
    }
    getMsgColor("请先登录");
  }, [cookie, tolike, islike, songId, dispatch, changelike]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
        height: 22,
        // color: canUse
        //   ? isActive()
        //     ? "rgb(136, 58, 30)"
        //     : ""
        //   : "rgb(116, 120, 122)",
        color: isActive() ? "rgb(124, 171, 177)" : "",
        padding: "1rem 0.3rem",
        background: isActive() ? "rgba(0, 0, 0, 0.2)" : "",
        borderRadius: "0.3rem",
      }}
      // {...isClick}
      // 双击可能触发单击 因此使用传参式防抖
      // 也可以使用lodash防抖，同样支持传参
      onClick={debounce((e) => {
        console.log("父级");
        // if (!canUse) return message.warning("暂无版权", 1);
        strategy[(e as MouseEvent<Element, MouseEvent>).detail]();
      }, 300)}
    >
      <span style={{ display: "flex" }}>
        <span style={{ marginRight: "1rem" }}>{name}</span>
        {SONGSTYPE[fee as number] ? (
          <AntTag>{SONGSTYPE[fee as number]}</AntTag>
        ) : null}
        {likes.includes(id) ? (
          <ParkLike
            // onClick={(
            //   e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
            // ) => {
            //   console.log("自己", e);
            //   e.stopPropagation();
            //   likeMusci();
            // }}
            onClick={debouncedCallback(
              (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
                e.stopPropagation();
                likeMusci();
              }
            )}
            theme={"filled"}
            size={22}
            fill="rgb(237, 90, 101)"
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          />
        ) : (
          <ParkLike
            onClick={debouncedCallback(
              (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
                console.log("自己");

                e.stopPropagation();
                likeMusci();
              }
            )}
            theme={"outline"}
            size={22}
            fill="rgb(237, 90, 101)"
            style={{ cursor: "pointer" }}
          />
        )}
      </span>
      {customrender ? customrender(item) : null}
    </div>
  );
};

export default SongsItem;

const AntTag = styled(Tag)`
  color: rgb(192, 44, 56);
  border: 0.1rem solid rgb(192, 44, 56);
  border-radius: 5rem;
  height: 22px;
  width: 32px;
`;
