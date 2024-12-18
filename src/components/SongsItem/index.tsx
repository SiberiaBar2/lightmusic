import { MouseEvent, useCallback, CSSProperties } from "react";
import { Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import _ from "lodash";
import { Like as ParkLike, Play } from "@icon-park/react";

import { useCheckMusic, useLike } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";

import { songsState } from "store/songs";
import { likeState, changelike } from "store/ilike";
import { RootState } from "store";
import { useDouble } from "body/utils";
import { Keys } from "types";
import { useFuncDebounce } from "@karlfranz/reacthooks";
import { useLogin } from "body/Header/utils";
import { player } from "body/PlayFooter/Dynamic";

const cookie = localStorage.getItem("cookie");

const SONGSTYPE: { [x: number]: string } = {
  [Keys.zero]: "", // 免费或无版权
  [Keys.single]: "vip", // VIP 歌曲
  [Keys.fourth]: "", // 购买专辑
  [Keys.eightth]: "", // 非会员可免费播放低音质，会员可播放高音质及下载
};

const ICONSTYLE: CSSProperties = {
  display: "flex",
  cursor: "pointer",
  marginRight: "1rem",
  alignItems: "center",
};
const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, item, dataSource } = props;
  const { id, al, fee } = item;

  const loginStatus = useLogin();
  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const dispatch = useDispatch();
  const { likes } = likeState;
  const debouncedCallback = useFuncDebounce();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const [strategy, debounce] = useDouble<
    string | number,
    number | undefined,
    string | undefined
  >(id, songindex, String(songidlist), dataSource);

  const { songId } = songsState;
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

  const renderAuth = () => {
    return item?.ar?.map((ele: any, index: number) => {
      if (index === 0) {
        return ele.name + "  ";
      }
      return "/" + "  " + ele.name;
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
        height: "6rem",
        lineHeight: "6rem",
        // color: canUse
        //   ? isActive()
        //     ? "rgb(136, 58, 30)"
        //     : ""
        //   : "rgb(116, 120, 122)",
        // color: canUse
        //   ? isActive()
        //     ? "rgb(124, 171, 177)"
        //     : ""
        //   : "rgb(116, 120, 122)",
        // padding: "1rem 0.3rem",
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
      <Line>
        <Play
          onClick={() => {
            player.saveSongConfig({
              prevornext: String(songidlist),
              song: songindex!,
              songId: id as number,
              platList: dataSource,
            });
          }}
          theme="outline"
          size="22"
          fill="rgb(251, 236, 222)"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "1rem",
          }}
        />
        <ImgWrap>
          <img src={al?.picUrl} alt="" />
        </ImgWrap>
        <SongInfo>
          <span>{item?.name}</span>
          <span>{item?.alia?.[0]}</span>
        </SongInfo>
        {/* {!canUse ? <span>暂无版权</span> : null} */}
      </Line>
      <Container>
        {renderAuth()}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {SONGSTYPE[fee as number] ? (
            <AntTag>{SONGSTYPE[fee as number]}</AntTag>
          ) : null}
          {loginStatus ? (
            likes.includes(id) ? (
              <ParkLike
                // onClick={(
                //   e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
                // ) => {
                //   console.log("自己", e);
                //   e.stopPropagation();
                //   likeMusci();
                // }}
                onClick={_.debounce(function (
                  // onClick={debouncedCallback(function (
                  e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
                ) {
                  console.log(
                    "自己1",
                    e,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this as MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
                  );
                  e.stopPropagation();
                  likeMusci();
                }, 500)}
                theme={"filled"}
                size={22}
                fill="rgb(237, 90, 101)"
                style={ICONSTYLE}
              />
            ) : (
              <ParkLike
                onClick={debouncedCallback(
                  (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
                    console.log("自己2");

                    e.stopPropagation();
                    likeMusci();
                  }
                )}
                theme={"outline"}
                size={22}
                fill="rgb(237, 90, 101)"
                style={ICONSTYLE}
              />
            )
          ) : null}
        </div>
      </Container>
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
  background: transparent;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
`;
const ImgWrap = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 1rem;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
  }
`;

const Container = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
  height: 100%;

  > span {
    height: 3rem;
    font-size: 12px;
    line-height: 3rem;
  }
`;
