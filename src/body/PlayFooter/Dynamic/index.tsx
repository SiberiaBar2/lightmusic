import {
  GoEnd,
  GoStart,
  Play,
  PauseOne,
  // Like,
  ShareOne,
  Acoustic,
  PlayOnce,
  LoopOnce,
  PlayCycle,
  ShuffleOne,
  ListBottom,
  VolumeSmall,
  VolumeMute,
  ArrowUp,
  ArrowDown,
} from "@icon-park/react";
import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Slider, Tooltip, message } from "antd";
import _ from "lodash";

import { Audio } from "./component/Audio";

import Drawer from "../Drawer";
import { useMount } from "hooks";
import { Like } from "../like";
import { useSongs } from "../useSongs";
import { RootState } from "store";
import { playState, changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  SongsInfo,
  DivRight,
} from "../style";
import { stringAdds } from "utils/utils";
import { FatherHoc } from "./component/FatherHoc";

const INITTIME = "00:00";

export enum PlayType {
  dan = 1,
  shun,
  liexun,
  sui,
}

const PLAYTYPE = {
  [PlayType.dan]: "单曲循环",
  [PlayType.shun]: "顺序播放",
  [PlayType.liexun]: "列表循环",
  [PlayType.sui]: "随机播放",
};

export interface DrawProps {
  picUrl: string;
  time: string;
  musicRef: React.MutableRefObject<HTMLAudioElement>;
  lyric: string;
  songId?: number | string;
}

type StateActionType = { type: PlayType };
type ReducerType = (
  state: StateActionType,
  action: StateActionType
) => {
  type: PlayType;
};

export type DrawRefType = {
  changeVisiable: () => void;
};

const reducer = (_: StateActionType, action: StateActionType) => {
  switch (action.type) {
    case PlayType.dan:
      return { type: PlayType.shun };
    case PlayType.shun:
      return { type: PlayType.liexun };
    case PlayType.liexun:
      return { type: PlayType.sui };
    case PlayType.sui:
      return { type: PlayType.dan };
    default:
      return { type: PlayType.liexun };
  }
};

export const Dynamic: React.FC<{
  param: songsState;
  setParam: reduxDispatch<AnyAction>;
}> = (props) => {
  const { param, setParam } = props;
  const { songId, song, prevornext } = param;

  const [open, setOpen] = useState(true);

  // 持久化存储播放类型
  const [type, dispatch] = useReducer<ReducerType>(reducer, {
    type: Number(localStorage.getItem("playtype")) || PlayType.liexun,
  });

  const [volume, setVolume] = useState(50);
  const [upOrDown, setUpOrDown] = useState(false);

  const drawerRef = useRef() as React.MutableRefObject<DrawRefType>;
  const musicRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  const [time, setTime] = useState(INITTIME);
  const [dura, setDura] = useState(INITTIME);

  const [duration, setDuration] = useState(0);

  const playState = useSelector<RootState, Pick<playState, "play">>((state) =>
    _.pick(state.play, "play")
  );
  const { play } = playState;

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { name, picUrl, authName, lyric, data } = useSongs(songId);

  // console.log("data--=-==-=>", data[0].url);

  const audioTimeUpdate = useCallback(() => {
    const { currentTime = 0 } = musicRef.current;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    const timeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    setTime(timeStr);
    setDuration(currentTime);
  }, [musicRef.current, setTime, setDuration]);

  // 为什么 musicRef.current.src 的值是当前url地址栏？ 导致 出现播放源错误
  // 获得播放总时长
  const onDurationChange = useCallback(() => {
    // 时长发生变化时执行的函数 确保时长不为NAN
    const { duration } = musicRef.current;
    const minutes = parseInt(duration / 60 + ""); // 获取总时长分钟
    const seconds = parseInt((duration % 60) + ""); // 获取总时长秒数
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    const dura = m + ":" + s;
    setDura(dura);
  }, [setDura, musicRef.current]);

  const playMusic = useCallback(() => {
    // 使用 async await 辅助 try catch 捕获异步错误
    const isAuto = async () => {
      let flag = true;
      try {
        console.log("musicRef.current", musicRef.current, "play", play);
        console.log("data--=-==-=>", data[0].url);
        play === "play" && musicRef.current
          ? await musicRef.current.play()
          : await musicRef.current.pause();
      } catch (err) {
        console.error("err ---> ", err);
        flag = false;
      }
      return flag;
    };

    // 这里为什么没有在声明函数的时候调用
    const content = () => {
      isAuto().then((res) => {
        if (res) {
          console.log("success");
          return;
        }
        // 失败就一直调用，直到成功为止！
        console.error("error", res);
        setTimeout(() => {
          content();
        }, 1000);
      });
    };

    content();
  }, [musicRef.current, play]);

  /**
   * duration >= musicRef.current?.duration 播放完毕后的操作 用于单曲
   */
  useEffect(() => {
    if (duration >= musicRef.current?.duration && data[0].url) {
      playMusic();
    }
  }, [duration, musicRef.current?.duration, data[0].url]);
  // 这里必须写两个effect 不然 duration 的变化 会触发 play === "play" 调用 playMusic
  // data[0].url 避免播放源错误
  useEffect(() => {
    if (play !== "init" && data[0].url) {
      playMusic();
    }
    // return () => {
    //   removeEventListener("keydown", onKeyDown);
    // };
  }, [playMusic, play, data[0].url]);

  // const onKeyDown = _.debounce((e: KeyboardEvent) => {
  //   removeEventListener("keydown", onKeyDown);
  //   if (e.code === "Space") {
  //     play === "play"
  //       ? setParam(changePlay({ play: "pause" }))
  //       : setParam(changePlay({ play: "play" }));
  //     setTimeout(() => playMusic(), 1000);
  //   }
  // }, 1000);

  // window.addEventListener("keydown", onKeyDown);

  // 播放下一首、上一首 同时支持列表循环 、随机数
  const goPrevorNext = useCallback(
    (key: string, reback?: string) => {
      let togo = key === "prev" ? Number(song) - 1 : Number(song) + 1;
      const getSongsId = prevornext.split(",").map((ele) => Number(ele));
      const min = 0;
      const max = getSongsId?.length - 1;

      if (togo < min) {
        togo = max;
      }
      if (togo > max) {
        togo = 0;
      }
      // 生成一个歌曲列表下标数组之内的随机数
      if (reback === "random") {
        togo = Math.round(Math.random() * max);
      }

      setParam(
        songsInfo({
          ...songsState,
          songId: getSongsId[togo],
          song: togo,
        })
      );
      setParam(changePlay({ play: "play" }));
    },
    [setParam, songsInfo, prevornext, songsState, song]
  );

  /**
   *  随时监听播放进度 以用来控制单曲、循环、列表，随机
   *
   *  加入 setTimeout 避免报错 ：元素没有播放的源错误
   *  没有 setTimeout 会出现最大深度的错误
   *  使用 time === dura && time !== "00:00" 对比
   *  会引发执行两次的bug！导致顺序播放跳两首播放
   *  log 发现 currentTime 这种对比也执行了两次
   *  但两次是一起执行的 合并为一次了
   *  2Dynamic.tsx:174 currentTime 287.111837 duration 287.111837
   */

  // 初始音量
  useMount(() => {
    if (musicRef.current) musicRef.current.volume = volume * 0.01;
  });

  const changeOpen = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      musicRef.current.volume = 0;
      setVolume(0);
      return;
    }
  }, []);

  // 函数 提入组件内部与 useReducer的 reducer 区分开来，
  // 避免 reducer 纯函数受到副作用污染
  const storge = useCallback((type: number) => {
    localStorage.setItem("playtype", String(type));
  }, []);

  const saveStorge = useCallback((type: number) => {
    switch (type) {
      case PlayType.dan:
        return storge(PlayType.shun);
      case PlayType.shun:
        return storge(PlayType.liexun);
      case PlayType.liexun:
        return storge(PlayType.sui);
      case PlayType.sui:
        return storge(PlayType.dan);
      default:
        return storge(PlayType.liexun);
    }
  }, []);

  const handeChangeType = useCallback((type: number) => {
    dispatch({ type });
    saveStorge(type);
  }, []);

  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={() => handeChangeType(PlayType.dan)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={() => handeChangeType(PlayType.shun)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={() => handeChangeType(PlayType.liexun)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={() => handeChangeType(PlayType.sui)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );

      default:
        break;
    }
  };

  const songAndAuth = useCallback(() => {
    return name + "-" + authName;
  }, [name, authName]);

  const DrawerConfig: DrawProps = {
    picUrl: picUrl,
    time: time,
    musicRef: musicRef,
    lyric: lyric,
    songId: songId,
  };

  const hocConfig = {
    musicRef: musicRef,
    songId: songId,
    setParam: setParam,
    type: type.type,
    goPrevorNext,
    duration,
    setDuration,
  };

  const audioConfig = {
    musicRef,
    audioTimeUpdate: audioTimeUpdate,
    onDurationChange,
    play,
    data,
  };

  const renderDivOne = () => (
    <DivOne>
      {picUrl ? (
        <Tooltip title="打开、关闭歌词">
          <div
            onClick={() => {
              drawerRef.current.changeVisiable();
              setUpOrDown(!upOrDown);
            }}
          >
            <img src={stringAdds(picUrl)} alt="" />
            <div
              style={{
                display: upOrDown ? "block" : "none",
              }}
            >
              <ArrowUp theme="outline" size="16" fill="#fff" />
              <ArrowDown theme="outline" size="16" fill="#fff" />
            </div>
          </div>
        </Tooltip>
      ) : (
        <div onClick={() => drawerRef.current.changeVisiable()}>
          <p>music</p>
        </div>
      )}
      <div>
        <Tooltip title={songAndAuth()}>
          <SongsInfo>
            {songAndAuth() && songAndAuth().length > 16
              ? songAndAuth().slice(0, 16) + "..."
              : songAndAuth()}
          </SongsInfo>
        </Tooltip>
        <span style={{ width: "3.4rem", display: "inline-block" }}>{time}</span>
        {/* <TimeChange ref={timeRef} audioTimeUpdate={audioTimeUpdate} /> */}
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span>{dura}</span>
      </div>
    </DivOne>
  );

  const renderDivRight = () => (
    <DivRight>
      <DivTwo>
        <GoStart
          onClick={() => goPrevorNext("prev")}
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        {play !== "play" ? (
          <Play
            onClick={() => setParam(changePlay({ play: "play" }))}
            theme="filled"
            size="24"
            fill="rgb(237, 195, 194)"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <PauseOne
            onClick={() => setParam(changePlay({ play: "pause" }))}
            theme="filled"
            size="24"
            fill="rgb(192, 44, 56)"
            style={{ cursor: "pointer" }}
          />
        )}
        <GoEnd
          onClick={() => goPrevorNext("next")}
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        <Like songId={useMemo(() => songId, [songId])} />
      </DivTwo>
      <DivThree>
        {/* <Acoustic
      title="音效"
      theme="outline"
      size="24"
      fill="rgb(237, 195, 194)"
    /> */}
        <Tooltip title={PLAYTYPE[type.type]}>{getElement(type.type)}</Tooltip>
        {/* <ListBottom
      title="播放列表"
      theme="outline"
      size="24"
      fill="rgb(237, 195, 194)"
    /> */}
        <VolumeWrap>
          <div>
            <Slider
              vertical
              value={volume}
              onChange={(volume) => {
                setVolume(volume);
                musicRef.current.volume = volume * 0.01;
                volume && changeOpen(true);
              }}
              min={0}
              max={100}
              step={5}
              style={{ height: "85%", bottom: "none" }}
            />
          </div>
          {open && volume !== 0 ? (
            <VolumeSmall
              theme="outline"
              onClick={() => changeOpen(false)}
              size="24"
              fill="rgb(237, 195, 194)"
            />
          ) : (
            <VolumeMute
              theme="outline"
              onClick={() => changeOpen(true)}
              size="24"
              fill="rgb(237, 195, 194)"
            />
          )}
        </VolumeWrap>
      </DivThree>
    </DivRight>
  );

  return (
    <Container>
      <FatherHoc {...hocConfig}>
        {renderDivOne()}
        {renderDivRight()}
        <Audio {...audioConfig} />
        <Drawer ref={drawerRef} {...DrawerConfig} />
      </FatherHoc>
    </Container>
  );
};

Dynamic.whyDidYouRender = true;
