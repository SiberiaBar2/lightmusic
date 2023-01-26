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
  memo,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Slider, Tooltip, message } from "antd";
import _ from "lodash";
import Drawer from "./Drawer";
import { useMount, useInterVal } from "hooks";
import { Like } from "./like";
import { useSongs } from "./useSongs";
import { RootState } from "store";
import { playState, changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  Progress,
  SongsInfo,
} from "./style";

const INITTIME = "00:00";

enum PlayType {
  dan,
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
  time: any;
  musicRef: React.MutableRefObject<any>;
  lyric: string;
  songId?: number | string;
}

const reducer = (state: any, action: any) => {
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

export const Dynamic = (props: {
  param: songsState;
  setParam: reduxDispatch<AnyAction>;
}) => {
  const { param, setParam } = props;
  const { songId, song, prevornext } = param;

  const [open, setOpen] = useState(true);

  // 持久化存储播放类型
  const [type, dispatch] = useReducer(reducer, {
    type: Number(localStorage.getItem("playtype")) || PlayType.liexun,
  });

  const [volume, setVolume] = useState(50);
  const [upOrDown, setUpOrDown] = useState(false);

  const drawerRef: React.MutableRefObject<any> = useRef();
  const musicRef: React.MutableRefObject<any> = useRef();
  const [time, setTime] = useState(INITTIME);
  const [dura, setDura] = useState(INITTIME);

  const playState = useSelector<RootState, Pick<playState, "play">>((state) =>
    _.pick(state.play, "play")
  );
  const { play } = playState;

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const playMusic = useCallback((play: boolean) => {
    play ? musicRef.current.play() : musicRef.current.pause();
    setParam(changePlay({ play }));
  }, []);

  // 播放下一首、上一首 同时支持列表循环 、随机数
  const goPrevorNext = useCallback(
    (key: string, reback?: string) => {
      let togo = key === "prev" ? Number(song) - 1 : Number(song) + 1;

      const getSongsId = prevornext.split(",");
      const min = 0;
      const max = getSongsId?.length - 1;

      if (togo < min) {
        togo = 0;
        message.warning("不能再往上了哦！", 2);
        return;
      }
      if (togo > max) {
        reback === "reback" ? (togo = 0) : (togo = max);
        if (!reback) {
          message.warning("到底再也没有了！", 2);
          return;
        }
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

      // 下一首 、上一首切换、播放 success
      setTimeout(() => {
        playMusic(true);
      }, 2500);
    },
    [setParam, songsInfo, playMusic, prevornext, songsState, song]
  );

  // 随时监听播放进度 以用来控制单曲、循环、列表，随机

  // 加入 setTimeout 避免报错 ：元素没有播放的源错误
  // 没有 setTimeout 会出现最大深度的错误
  // 使用 time === dura && time !== "00:00" 对比
  // 会引发执行两次的bug！导致顺序播放跳两首播放
  // log 发现 currentTime 这种对比也执行了两次
  // 但两次是一起执行的 合并为一次了
  // 2Dynamic.tsx:174 currentTime 287.111837 duration 287.111837

  useEffect(() => {
    const { currentTime, duration } = musicRef.current;
    if (currentTime === duration) {
      switch (type.type) {
        case PlayType.dan:
          setTimeout(() => playMusic(true), 500);
          return;
        case PlayType.shun:
          setTimeout(() => goPrevorNext("next"), 500);
          return;
        case PlayType.liexun:
          setTimeout(() => goPrevorNext("next", "reback"), 500);
          return;
        case PlayType.sui:
          setTimeout(() => goPrevorNext("next", "random"), 500);
          return;
        default:
          return;
      }
    }
    // 以下if 代码与上面  switch 一致 ；失败实践
    // if (time === dura && time !== "00:00") {
    // }
  });

  // 初始音量
  useMount(() => {
    if (musicRef.current) musicRef.current.volume = volume * 0.01;
  });

  const { name, picUrl, authName, lyric } = useSongs(songId);

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

  const audioTimeUpdate = useCallback(() => {
    const { currentTime = 0 } = musicRef.current;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    const timeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    setTime(timeStr);
  }, [setTime, musicRef]);

  const hocConfig = useMemo(() => {
    return {
      playMusic: playMusic,
      musicRef: musicRef,
      songId: songId,
      play: play,
      setParam: setParam,
      type: type.type,
    };
  }, [playMusic, musicRef, songId, play, setParam, type.type]);

  // 使用react memo 和usememo 优化audio组件 避免audio不必要的渲染1
  const audioConfig = useMemo(() => {
    return {
      songId,
      musicRef,
      setDura,
      audioTimeUpdate,
    };
  }, [songId, musicRef, audioTimeUpdate]);

  return (
    <Container>
      <FatherHoc {...hocConfig}>
        <DivOne>
          {picUrl ? (
            <Tooltip title="打开、关闭歌词">
              <div
                onClick={() => {
                  drawerRef.current.changeVisiable();
                  setUpOrDown(!upOrDown);
                }}
              >
                <img src={picUrl} alt="" />
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
            <span>{time}</span>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <span>{dura}</span>
          </div>
        </DivOne>
        <DivTwo>
          <GoStart
            onClick={() => goPrevorNext("prev")}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
            style={{ cursor: "pointer" }}
          />
          {!play ? (
            <Play
              onClick={() => playMusic(true)}
              theme="filled"
              size="24"
              fill="rgb(237, 195, 194)"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <PauseOne
              onClick={() => playMusic(false)}
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
          {/* <Like songId={songId} /> */}
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
        <Audio {...audioConfig} />
        <Drawer ref={drawerRef} {...DrawerConfig} />
      </FatherHoc>
    </Container>
  );
};

Dynamic.whyDidYouRender = true;

// 使用react memo 和usememo 优化audio组件 避免audio不必要的渲染2
// 抽离 audio , 使无关状态改变, 不重新渲染audio

// 避免受到其他组件渲染的影响
const Audio = memo(
  ({
    musicRef,
    songId,
    audioTimeUpdate,
    setDura,
  }: {
    musicRef: React.MutableRefObject<any>;
    songId?: string | number;
    audioTimeUpdate: () => void;
    setDura: Dispatch<SetStateAction<string>>;
  }) => {
    const { data } = useSongs(songId);

    console.log("render");

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
    }, [setDura]);

    return (
      <audio
        controls
        ref={musicRef}
        src={data[0].url}
        style={{ display: "none" }}
        onTimeUpdate={audioTimeUpdate}
        onDurationChange={onDurationChange}
      />
    );
  }
);

// react 控制反转 使 duration 播放进度变化时 不影响父组件下的其他组件重渲

// 控制进度 与 播放完成的暂停图标
const FatherHoc = ({
  children,
  playMusic,
  musicRef,
  songId,
  play,
  setParam,
  type,
}: {
  children: React.ReactNode;
  playMusic: (play: boolean) => void;
  musicRef: React.MutableRefObject<any>;
  songId?: number | string;
  play: boolean | undefined;
  setParam: reduxDispatch<AnyAction>;
  type: PlayType;
}) => {
  const [duration, setDuration] = useState(0);

  const { data } = useSongs(songId);
  // 切歌时重置播放进度
  useMemo(() => {
    setDuration(0);
  }, [songId]);

  // 随着音乐播放，进度条自动行进
  useInterVal(() => {
    // 这里 && musicRef.current 之后播放就稳定了
    // 不会再出现切歌后进度条在走，也显示播放图标，但音频时而播放时而不播放的问题
    // 做到了同步
    // 但同时也必须配合2.5s
    if (play && musicRef.current && data[0].url) {
      setDuration((dura) => dura + 1);
      // 播放完毕 重置播放状态 | 从新播放
      if (duration >= musicRef.current?.duration) {
        // 如果是单曲循环 不停止播放状态 、并且重置播放进度从新播放
        if (type === PlayType.dan) {
          setDuration(0);
          return;
        }
        setParam(changePlay({ play: false }));
      }
    }
  }, 1000);

  return (
    <>
      <Progress>
        <Slider
          value={duration}
          onChange={(dura) => {
            setDuration(dura);
            playMusic(true);
            musicRef.current.currentTime = dura;
          }}
          tooltip={{ open: false }}
          min={0}
          max={musicRef.current?.duration}
          step={1}
          style={{ height: "85%", bottom: "none" }}
        />
      </Progress>
      {children}
    </>
  );
};
