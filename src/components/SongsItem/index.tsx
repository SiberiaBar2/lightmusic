import { MouseEvent, useCallback, CSSProperties } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Like as ParkLike, Play, PauseOne } from "@icon-park/react";
import { Tag, message } from "antd";
import { createSelector } from "reselect";
import _ from "lodash";
import styled from "@emotion/styled";

import { useCheckMusic, useLike } from "body/PlayFooter/utils";
import { childrenReturnType } from "components/CardList";

import { Keys } from "types";
import { RootState } from "store";
import { likeState, changelike } from "store/ilike";
import { useFuncDebounce } from "@karlfranz/reacthooks";
import { useLogin } from "body/Header/utils";
import { player } from "body/PlayFooter/Dynamic";
import { doubleCilck } from "body/utils";
import { playState } from "store/play";

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

// 创建记忆化的 selector
const selectLikes = createSelector(
  (state: RootState) => state.ilike.likes,
  (likes) => ({ likes })
);

const selectSongsState = createSelector(
  (state: RootState) => state.songs,
  (songs) => _.pick(songs, ["songId", "song", "prevornext"])
);

const SongsItem: React.FC<childrenReturnType> = (props) => {
  const { songindex, songidlist, item, dataSource, showLike = true } = props;
  const { id, al, fee } = item;

  const playState = useSelector<RootState, Pick<playState, "play">>(
    (state) => _.pick(state.play, "play"),
    shallowEqual
  );
  const { play } = playState;

  const loginStatus = useLogin();
  const likeState = useSelector(selectLikes, shallowEqual); // 使用记忆化的 selector
  const songsState = useSelector(selectSongsState, shallowEqual); // 使用记忆化的 selector

  const dispatch = useDispatch();
  const { likes } = likeState;
  const debouncedCallback = useFuncDebounce();
  const [strategy, debounce] = doubleCilck<
    string | number,
    number | undefined,
    string | undefined
  >(id, songindex, String(songidlist), dataSource);
  const { songId } = songsState;
  const isActive = () => item.id === songId;

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
            id: "",
            // id: songId,
            like: true,
            cookie: cookie,
            timerstamp: Date.now(),
          }),
        1000
      );
      // const like = _.cloneDeep(likes);
      // like.unshift(id as number);
      // dispatch(
      //   changelike({
      //     likes: like,
      //   })
      // );
      getMsgColor("已添加到我喜欢");
      return;
    }
    getMsgColor("请先登录");
  }, [cookie, tolike, islike, songId, dispatch, changelike, id, likes]);

  const renderAuth = () => {
    return item?.ar?.map((ele: any, index: number) => {
      if (index === 0) {
        return ele.name + "  ";
      }
      return "/" + "  " + ele.name;
    });
  };

  const renderPlay = () => {
    return (
      <Play
        onClick={(e) => {
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
    );
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
        background: isActive() ? "rgba(0, 0, 0, 0.2)" : "",
        borderRadius: "0.3rem",
      }}
      onClick={debounce((e) => {
        console.log("父级");
        strategy[(e as MouseEvent<Element, MouseEvent>).detail]();
      }, 300)}
    >
      <Line>
        {isActive() && play === "pause" ? (
          renderPlay()
        ) : isActive() && play === "play" ? (
          <PauseOne
            onClick={player?.pauseMusic}
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
        ) : (
          renderPlay()
        )}
        <ImgWrap>
          <img src={al?.picUrl} alt="" />
        </ImgWrap>
        <SongInfo>
          <span>{item?.name}</span>
          <span>{item?.alia?.[0]}</span>
        </SongInfo>
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
          {showLike && loginStatus ? (
            likes.includes(id) ? (
              <ParkLike
                onClick={_.debounce((e: MouseEvent<HTMLSpanElement>) => {
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
                onClick={debouncedCallback((e: MouseEvent<HTMLSpanElement>) => {
                  e.stopPropagation();
                  likeMusci();
                })}
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
