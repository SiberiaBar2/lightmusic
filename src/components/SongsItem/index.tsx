import { MouseEvent } from "react";
import { Tag } from "antd";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { useCheckMusic } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";

import { songsState } from "store/songs";
import { RootState } from "store";
import { useDouble } from "body/utils";
import { Keys } from "types";

const SONGSTYPE: { [x: number]: string } = {
  [Keys.zero]: "", // 免费或无版权
  [Keys.single]: "vip", // VIP 歌曲
  [Keys.fourth]: "", // 购买专辑
  [Keys.eightth]: "", // 非会员可免费播放低音质，会员可播放高音质及下载
};

const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, customrender, item, ...other } = props;
  const { id, name, fee } = item;

  // const backTopRef = useRef() as MutableRefObject<any>;
  // const backTopInstance = backTopRef.current;
  const check = useCheckMusic();

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
        // color: canUse
        //   ? isActive()
        //     ? "rgb(136, 58, 30)"
        //     : ""
        //   : "rgb(116, 120, 122)",
        color: isActive() ? "rgb(136, 58, 30)" : "",
        padding: "1rem 0.3rem",
        background: isActive() ? "rgb(228, 151, 157)" : "",
        borderRadius: "0.3rem",
      }}
      // {...isClick}
      // 双击可能触发单击 因此使用传参式防抖
      // 也可以使用lodash防抖，同样支持传参
      onClick={debounce((e) => {
        // if (!canUse) return message.warning("暂无版权", 1);
        strategy[(e as MouseEvent<Element, MouseEvent>).detail]();
      }, 300)}
    >
      <span>
        <span style={{ marginRight: "1rem" }}>{name}</span>
        {SONGSTYPE[fee as number] ? (
          <AntTag>{SONGSTYPE[fee as number]}</AntTag>
        ) : null}
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
`;
