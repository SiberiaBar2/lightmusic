import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  ForwardedRef,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Drawer as AntDrawer } from "antd";
import {
  DoubleDown,
  DoubleUp,
  GoEnd,
  GoStart,
  LoopOnce,
  PauseOne,
  Play,
  PlayCycle,
  PlayOnce,
  ShuffleOne,
} from "@icon-park/react";
import styled from "@emotion/styled";

import { DrawProps, DrawRefType, player, PlayType } from "..";
import { Common } from "../../Common";
import { IsSame } from "../../IsSame";
import { useSongs } from "../../useSongs";
import { CardList } from "components";
import { stringAdds } from "utils/utils";
import "./index.css";
import { playState, changePlay } from "store/play";
import { useToggleSongs } from "./utils";
import { RootState } from "store";
import _ from "lodash";
import { songsState } from "store/songs";
import { Like } from "./like";
import { PlayTypeIcon } from "./PlayTypeIcon";
import { useFuncDebounce } from "@karlfranz/reacthooks";
import { useReLoadImage } from "hooks";
import { useBackGroundColor } from "entries/utils";

const Drawer = (props: DrawProps, ref: ForwardedRef<DrawRefType>) => {
  const { lyric, time, picUrl, songId, type, handeChangeType, musicRef } =
    props;

  // console.log("time ---->", time);

  const [visiable, setVisiable] = useState(false);

  /**
   *
   *  item. content:string 评论内容 commentId:number ，评论id ， timeStr:string 时间字符， time:number 时间戳，
   *  item. user 用户信息 ，avatarUrl: string 头像地址，nickname:string 昵称， userId:number 用户id， userType:number 用户类型
   *  console.log("hotComments", hotComments);
   *  data name：string 歌曲名，id： number 歌曲id， artists:[] 0.name 作者， picUrl ： 歌曲图片
   */

  const changeVisiable = () => {
    songId && setVisiable(!visiable);
  };
  const onClose = () => {
    setVisiable(false);
  };
  useImperativeHandle(ref, () => ({
    changeVisiable,
  }));

  const LryicConfig = {
    lyric,
    time,
  };

  const themeColor = useBackGroundColor(picUrl, "drawer");

  return visiable ? (
    <DrawerModal>
      <Wrap>
        <div
          id="drawer"
          style={{
            background: themeColor || "rgb(21, 108, 117)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            filter: "blur(12px)",
            opacity: "0.7",
            backgroundPosition: "50%",
          }}
        />
        <ContainerMask />
        <Component>
          <DoubleDown
            style={{
              top: "2rem",
              left: "5rem",
              cursor: "pointer",
              position: "absolute",
            }}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
            onClick={() => changeVisiable()}
          />
          {/* <DoubleUp
            style={{
              bottom: "2rem",
              left: "5rem",
              cursor: "pointer",
              position: "absolute",
            }}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
            onClick={() => changeVisiable()}
          /> */}
          <Container>
            <RoundWrap
              picUrl={stringAdds(picUrl)}
              type={type}
              musicRef={musicRef}
              handeChangeType={handeChangeType}
            />
            <LyricWrap {...LryicConfig} />
          </Container>
          {/* <CommonWrap songId={songId} /> */}
        </Component>
      </Wrap>
    </DrawerModal>
  ) : null;
};

const RoundWrap: React.FC<
  Pick<DrawProps, "picUrl" | "musicRef"> & {
    handeChangeType?: any;
    type: any;
  }
> = React.memo(({ picUrl, handeChangeType, type, musicRef }) => {
  const dispatch = useDispatch();
  const playState = useSelector<RootState, Pick<playState, "play">>((state) =>
    _.pick(state.play, "play")
  );
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);
  const { play } = playState;
  const { songId, song, prevornext } = songsState;

  const goPrevorNext = useToggleSongs({
    prevornext,
    song,
    songsState,
    play,
    musicRef,
  });

  const imgRef = useRef<HTMLImageElement>(null);
  useReLoadImage(imgRef, picUrl, "pict", () => "");
  const debouncedCallback = useFuncDebounce();
  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.dan))}
            theme="outline"
            size="30"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.shun))}
            theme="outline"
            size="30"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={debouncedCallback(() => handeChangeType(PlayType.liexun))}
            theme="outline"
            size="30"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.sui))}
            theme="outline"
            size="30"
            fill="rgb(251, 236, 222)"
          />
        );

      default:
        break;
    }
  };
  return (
    <Round>
      <div>
        <img ref={imgRef} />
      </div>
      <Player>
        <GoStart
          onClick={player.playPrev}
          theme="outline"
          size="30"
          fill="rgb(251, 236, 222)"
          style={{ cursor: "pointer" }}
        />
        {play !== "play" ? (
          <Play
            onClick={player?.playMusic}
            theme="outline"
            size="30"
            style={{
              cursor: "pointer",
              margin: "0px 15px",
            }}
            fill="rgb(251, 236, 222)"
          />
        ) : (
          <PauseOne
            onClick={player?.pauseMusic}
            theme="outline"
            size="30"
            fill="rgb(251, 236, 222)"
            style={{
              cursor: "pointer",
              margin: "0px 15px",
            }}
          />
        )}
        <GoEnd
          onClick={player.playNext}
          theme="outline"
          size="30"
          fill="rgb(251, 236, 222)"
          style={{ cursor: "pointer" }}
        />
        <Like
          style={{
            marginLeft: 20,
            marginRight: 35,
          }}
          size={30}
          songId={useMemo(() => songId, [songId])}
        />
        <span
          style={{
            cursor: "pointer",
          }}
        >
          {getElement(type.type)}
        </span>
        {/* <PlayTypeIcon /> */}
      </Player>
    </Round>
  );
});

// 抽离组件，将频繁渲染的状态单独提出， 自身状态变化 不影响其他组件重复渲染
const LyricWrap: React.FC<Pick<DrawProps, "lyric" | "time">> = ({
  lyric,
  time,
}) => {
  const [lrc, setLrc] = useState<string[]>([""]);

  const div = document.getElementById("lyricdiv") as HTMLElement;

  // console.log("div", div);

  // const containerHeight = document.querySelector("#container")
  //   ?.clientHeight as number;
  // const liHeight = div?.children[0].clientHeight as number;

  // console.log("liHeight", liHeight);

  // const maxOffset = (div?.clientHeight as number) - containerHeight;

  useMemo(() => {
    // const lines = lyric.split("\n");
    // console.log("lines", lines);

    const timeArr: string[] = [];
    const lrcArr: string[] = [];
    const regex = /\[(\d{2}:\d{2})\.\d{2,3}\](.+)/g;
    // console.log("regex.exec(lyric)", regex.exec(lyric));
    let tmp = regex.exec(lyric);
    // console.log("tmp", tmp);

    // console.log("time", time);

    while (tmp) {
      timeArr.push(tmp[1]);
      lrcArr.push(tmp[2]);
      tmp = regex.exec(lyric); // 不写页面崩溃
    }
    // console.log("timeArr", timeArr);

    setLrc(lrcArr);
    const index = timeArr.findIndex((item: any) => {
      // console.log("time", time);
      // console.log("tim--->item-", item);
      // console.log("item === time", item === time);

      return item === time;
    });

    // console.log("index", index);

    // console.log("time---->", time);
    // console.log("divdivdiv", div);

    // let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    // // 处理边界问题

    // if (offset < 0) {
    //   offset = 0;
    // }
    // if (offset > maxOffset) {
    //   offset = maxOffset;
    // }
    // if (div) {
    //   div.style.transform = `translateY(-${offset})rem`;
    //   // 去除之前的active
    //   let li = div.querySelector(".active");
    //   if (li) {
    //     li.classList.remove("active");
    //   }

    //   li = div.children[index];
    //   if (li) {
    //     li.classList.add("active");
    //   }
    // }

    if (index !== -1 && div) {
      div.style.top = -index * 4 + 21 + "rem";
      [...div.children].forEach((item) => {
        if (item) {
          item.classList.remove("active");
        }
      });
      if (div.children[index]) {
        div.children[index].classList.add("active");
      }
    }
    // console.log("index----->", index);
  }, [lyric, time]);
  return (
    <Lyric id="container">
      <ul id="lyricdiv">
        {lrc.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </Lyric>
  );
};

const CommonWrap: React.FC<Pick<DrawProps, "songId">> = React.memo(
  ({ songId }) => {
    const { hotComments, comments, userId, topComments, songs } = useSongs(
      songId || "",
      ""
    );

    return (
      <Comment>
        <CommentList>
          <Divider orientation="left">热评</Divider>
          {Array.isArray(hotComments) &&
            hotComments.map((ele: any) => (
              <Common key={ele.commentId} {...ele} />
            ))}
          <Divider orientation="left">最新评论</Divider>
          {Array.isArray(comments) &&
            comments.map((ele: any) => <Common key={ele.commentId} {...ele} />)}
        </CommentList>
        <Revelant>
          <Divider orientation="left">相关</Divider>
          <CardList grid={{ column: 1, gutter: 1 }} dataSource={songs}>
            <IsSame />
          </CardList>
        </Revelant>
      </Comment>
    );
  }
);

export default forwardRef(Drawer);

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
`;

const ContainerMask = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Component = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  /* margin-top: 5rem; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Round = styled.div`
  width: 50%;
  height: 50rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-left: 1rem;

  div:nth-of-type(1) {
    width: 38rem;
    height: 38rem;

    img:nth-of-type(1) {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
`;

const Lyric = styled.div`
  width: 50% !important;
  height: 50rem;

  overflow: hidden;
  position: relative;
  font-size: 1.4rem;
  overflow-y: auto;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */

  ul {
    width: 100%;
    position: absolute;
    left: 0;
    padding: 0;

    li {
      margin-bottom: 1rem;
      min-height: 3rem;
      list-style: none;
      width: 100%;
      line-height: 2rem;
      font-size: 1.7rem;
      font-weight: 450;
      letter-spacing: 0.1rem;
    }
  }
`;

const Comment = styled.div`
  display: flex;
  width: 90rem;
`;

const CommentList = styled.div`
  width: 60%;
`;

const Revelant = styled.div`
  flex: 1;
  margin: 2rem;
`;

const Player = styled.div`
  height: 5rem;
  width: 35rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const DrawerModal = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.5s;
  z-index: 999;
  color: rgb(251, 236, 222);
  /* background-color: rgba(0, 0, 0, 0.9); */
  background-color: black;
`;

Drawer.whyDidYouRender = true;
