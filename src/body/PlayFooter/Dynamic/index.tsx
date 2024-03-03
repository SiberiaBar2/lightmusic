import {
  GoEnd,
  GoStart,
  Play,
  PauseOne,
  // Like,
  Acoustic,
  PlayOnce,
  LoopOnce,
  PlayCycle,
  ShuffleOne,
  ListBottom,
  VolumeSmall,
  VolumeMute,
} from "@icon-park/react";
import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Button, Dropdown, MenuProps, Slider, Tooltip } from "antd";
import _ from "lodash";

import { Audio } from "./component/Audio";

import Drawer from "./component/Drawer";
import { useFuncDebounce, useMount } from "hooks";
import { Like } from "./component/like";
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
import { NowList } from "./component/NowList";
import { useToggleSongs } from "./component/utils";
import { PlayTypeIcon } from "./component/PlayTypeIcon";
import { ToneQualityState, changeToneQuality } from "store/toneQuality";
// import { changePicturl } from "store/picturl";

import { useBoolean, useStateSync } from "k-react-custom-hook";
const singer = process.env.REACT_APP_SPA_URL as string;

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
  handeChangeType?: any;
  type: {
    type: PlayType;
  };
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

export type NowListType = {
  changeOpen: () => void;
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

  const debouncedCallback = useFuncDebounce();
  // 持久化存储播放类型
  const [type, dispatch] = useReducer<ReducerType>(reducer, {
    type: Number(localStorage.getItem("playtype")) || PlayType.liexun,
  });

  const [volume, setVolume] = useState(50);

  const drawerRef = useRef() as React.MutableRefObject<DrawRefType>;
  const musicRef = useRef() as React.MutableRefObject<HTMLAudioElement>;
  const nowListRef = useRef() as React.MutableRefObject<NowListType>;

  const [time, setTime] = useState(INITTIME);
  const [dura, setDura] = useState(INITTIME);

  const [duration, setDuration] = useState(0);

  const playState = useSelector<RootState, Pick<playState, "play">>((state) =>
    _.pick(state.play, "play")
  );
  const { play } = playState;

  const qualityState = useSelector<
    RootState,
    Pick<ToneQualityState, "toneQuality">
  >((state) => _.pick(state.toneQuality, "toneQuality"));
  const { toneQuality } = qualityState;

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { name, picUrl, authName, lyric, data } = useSongs(
    songId || "",
    toneQuality?.key || ""
  );

  const goPrevorNext = useToggleSongs({
    prevornext,
    song,
    songsState,
    play,
  });

  // useEffect(() => {
  //   setParam(changePicturl({ picturl: picUrl }));
  // }, [picUrl]);

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

  // 切歌时重置播放进度
  useMemo(() => {
    setDuration(0);
    localStorage.setItem("currentTime", "0");
  }, [songId]);

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

  // document.addEventListener("visibilitychange", function () {
  //   if (document.hidden) {
  //     console.log("笔记本盖子已关闭");
  //     setParam(changePlay({ play: "pause" }));
  //   }
  // });
  const playMusic = useCallback(() => {
    // 使用 async await 辅助 try catch 捕获异步错误
    const isAuto = async () => {
      let flag = true;
      try {
        if (musicRef.current?.src && !musicRef.current?.src.includes(singer)) {
          play === "play"
            ? await musicRef.current.play()
            : await musicRef.current.pause();
        }
      } catch (err) {
        flag = false;
      }
      return flag;
    };

    // 这里为什么没有在声明函数的时候调用
    const content = () => {
      isAuto().then((res) => {
        if (res) {
          console.warn("success");
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
  }, [play, musicRef.current?.src]);

  // 播放暂停
  useEffect(() => {
    if (play !== "init") {
      playMusic();
    }
  }, [playMusic, play]);

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

  // useMemo(() => {
  //   if (musicRef.current?.currentTime && duration) {
  //     musicRef.current.currentTime = duration;
  //   }
  // }, [toneQuality?.key]);
  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.dan))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.shun))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={debouncedCallback(() => handeChangeType(PlayType.liexun))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={debouncedCallback(() => handeChangeType(PlayType.sui))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );

      default:
        break;
    }
  };

  const songAndAuth = useCallback(() => {
    return name + "-" + authName;
  }, [name, authName]);

  const DrawerConfig: DrawProps & {
    handeChangeType: any;
    type: {
      type: PlayType;
    };
  } = {
    picUrl: picUrl,
    time: time,
    musicRef: musicRef,
    lyric: lyric,
    songId: songId,
    handeChangeType: handeChangeType,
    type: type,
  };

  const hocConfig = {
    musicRef: musicRef,
    songId: songId,
    setParam: setParam,
    type: type.type,
    goPrevorNext,
    duration,
    setDuration,
    play,
  };

  const audioConfig = {
    musicRef,
    audioTimeUpdate,
    onDurationChange,
    play,
    data,
    setParam,
    changePlay,
  };

  const renderDivOne = () => (
    <DivOne>
      {picUrl ? (
        <div
          onClick={debouncedCallback(
            (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
              drawerRef.current.changeVisiable();
              e.stopPropagation();
            }
          )}
        >
          <img src={stringAdds(picUrl)} alt="" />
        </div>
      ) : (
        <div
          onClick={debouncedCallback(() => drawerRef.current.changeVisiable())}
        >
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

  const MUSICQUALITY = {
    color: "#333333",
  };

  const onChangeToneQuality = (config: { key: string; label: string }) => {
    // changeToneQuality
    // console.log("key======>", config);
    setParam(changeToneQuality({ toneQuality: config }));
  };
  const items: MenuProps["items"] = [
    {
      key: "standard",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "standard",
                label: "标准",
              })
            }
          >
            标准
          </div>
        </label>
      ),
    },
    {
      key: "higher",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "higher",
                label: "较高",
              })
            }
          >
            较高
          </div>
        </label>
      ),
    },
    {
      key: "exhigh",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "exhigh",
                label: "极高",
              })
            }
          >
            极高
          </div>
        </label>
      ),
    },
    {
      key: "lossless",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "lossless",
                label: "无损",
              })
            }
          >
            无损
          </div>
        </label>
      ),
    },
    {
      key: "hires",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "hires",
                label: "Hi-Res",
              })
            }
          >
            Hi-Res
          </div>
        </label>
      ),
    },
    {
      key: "jyeffect",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "jyeffect",
                label: "高清环绕声",
              })
            }
          >
            高清环绕声
          </div>
        </label>
      ),
    },
    {
      key: "sky",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "sky",
                label: "沉浸环绕声",
              })
            }
          >
            沉浸环绕声
          </div>
        </label>
      ),
    },
    {
      key: "jymaster",
      label: (
        <label>
          <div
            style={MUSICQUALITY}
            onClick={() =>
              onChangeToneQuality({
                key: "jymaster",
                label: "超清母带",
              })
            }
          >
            超清母带
          </div>
        </label>
      ),
    },
  ];

  const renderDivRight = () => {
    return (
      <DivRight>
        <DivTwo>
          <GoStart
            onClick={debouncedCallback(() => goPrevorNext("prev"))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
            style={{ cursor: "pointer" }}
          />
          {play !== "play" ? (
            <Play
              onClick={debouncedCallback(() => {
                setParam(changePlay({ play: "play" }));
              })}
              theme="outline"
              size="24"
              fill="rgb(251, 236, 222)"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <PauseOne
              onClick={debouncedCallback(() => {
                setParam(changePlay({ play: "pause" }));
              })}
              theme="outline"
              size="24"
              fill="rgb(251, 236, 222)"
              style={{ cursor: "pointer" }}
            />
          )}
          <GoEnd
            onClick={debouncedCallback(() => goPrevorNext("next"))}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
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
          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <span>{toneQuality?.label || "-"}</span>
          </Dropdown>
          <Tooltip title={PLAYTYPE[type.type]}>
            {getElement(type.type)}
            {/* <PlayTypeIcon type={type.type} /> */}
          </Tooltip>
          <Tooltip title={"播放列表"}>
            <ListBottom
              theme="outline"
              size="24"
              fill="rgb(251, 236, 222)"
              onClick={debouncedCallback(() =>
                nowListRef.current?.changeOpen()
              )}
            />
          </Tooltip>
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
                fill="rgb(251, 236, 222)"
              />
            ) : (
              <VolumeMute
                theme="outline"
                onClick={() => changeOpen(true)}
                size="24"
                fill="rgb(251, 236, 222)"
              />
            )}
          </VolumeWrap>
        </DivThree>
      </DivRight>
    );
  };

  // console.log("崇轩");

  const [value, { toggle, on, off }] = useBoolean();
  return (
    <Container id={"player"}>
      <FatherHoc {...hocConfig}>
        {/* <div>111? {value ? "是" : "否"}</div> */}
        {/* <div onClick={() => toggle()}>改变</div> */}
        {renderDivOne()}
        {renderDivRight()}
        <Audio {...audioConfig} />
        <Drawer ref={drawerRef} {...DrawerConfig} />
        <NowList ref={nowListRef} />
      </FatherHoc>
    </Container>
  );
};

Dynamic.whyDidYouRender = true;
