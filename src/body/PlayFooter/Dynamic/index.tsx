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
import { Button, Dropdown, MenuProps, Slider, Tooltip, message } from "antd";
import _ from "lodash";

import { likeState } from "store/ilike";
import Drawer from "./component/Drawer";
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
import {
  BasicPlayer,
  Controller,
  SongDetailConfig,
  TimeType,
  useToggleSongs,
} from "./component/utils";
import { PlayTypeIcon } from "./component/PlayTypeIcon";
import { ToneQualityState, changeToneQuality } from "store/toneQuality";
// import { changePicturl } from "store/picturl";

import {
  useBoolean,
  useStateSync,
  useSessonState,
  useKeyUpdate,
  useQuery,
  useFuncDebounce,
  useMount,
} from "@karlfranz/reacthooks";
import styled from "@emotion/styled";
import { https } from "utils";
import { LoginState } from "store/login";
import { useReLoadImage } from "hooks";
import { useLogin } from "body/Header/utils";
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

const INITSONGDETAIL = {
  name: "",
  picUrl: "",
  authName: "",
  dt: 0,
  backGroundColor:
    "linear-gradient(rgb(6, 28, 30), rgb(21, 108, 117), rgb(6, 28, 30))",
};

export interface DrawProps {
  picUrl: string;
  time: string;
  // lyric: string;
  songId?: number | string;
  handeChangeType?: any;
  type: {
    type: PlayType;
  };
  backGroundColor: string;
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

export const player = new Controller();

export const Dynamic: React.FC<{
  param: songsState;
  setParam: reduxDispatch<AnyAction>;
}> = (props) => {
  const { param, setParam } = props;
  const { songId } = param;

  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
    loginState;

  const client = https();
  const { run: getUserPlaylist, data: playList } = useQuery(
    ({ userId }: { userId: string }) =>
      client("user/playlist", {
        data: {
          uid: userId,
        },
      }),
    {
      responsePath: "playlist",
      manual: true,
      success(res) {
        // console.log("查看用户歌单", res);
      },
      error(error) {
        console.log("error====>", error);
      },
    }
  );

  useEffect(() => {
    if (userId) {
      getUserPlaylist({ userId });
    }
  }, [userId]);

  const { run: getHeartBit } = useQuery(
    ({ id, pid }: { id: string; pid: string }) =>
      client("playmode/intelligence/list", {
        data: { id, pid, timestamp: new Date().getTime() },
      }),
    {
      manual: true,
      success(res) {
        console.log("心动模式数据", res);
        const ids = res.data.map((item: any) => {
          return item.id;
        });
        console.log("ids", ids);
        handeChangeType(PlayType.shun);
        setParam(
          songsInfo({
            ...songsState,
            songId: ids[0],
            song: 0,
            prevornext: String(ids),
          })
        );
        // setParam(changePlay({ play: "play" }));
        message.success("心动模式已开启");
      },
    }
  );
  // const [open, setOpen] = useState(true);

  const debouncedCallback = useFuncDebounce();
  // 持久化存储播放类型
  const [type, dispatch] = useReducer<ReducerType>(reducer, {
    type: Number(localStorage.getItem("playtype")) || PlayType.liexun,
  });

  // const [volume, setVolume] = useState(50);

  const drawerRef = useRef() as React.MutableRefObject<DrawRefType>;
  // const musicRef = useRef() as React.MutableRefObject<HTMLAudioElement>;
  const nowListRef = useRef() as React.MutableRefObject<NowListType>;

  const [time, setTime] = useState<TimeType>({
    time: 0,
    timeStr: "00:00",
  } as TimeType);

  player.saveRenderTime(setTime);
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

  const [songDetailConfig, setSongDetailConfig] =
    useState<SongDetailConfig>(INITSONGDETAIL);

  useEffect(() => {
    player.setSongConfig(setSongDetailConfig);
    player.getSongDetailConfig(songId + "");
  }, []);

  const { name, picUrl, authName, dt, backGroundColor } = songDetailConfig;

  // const changeOpen = useCallback((open: boolean) => {
  //   setOpen(open);
  //   if (!open) {
  //     // musicRef.current.volume = 0;
  //     // setVolume(0);
  //     return;
  //   }
  // }, []);

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
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={() => handeChangeType(PlayType.shun)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={() => handeChangeType(PlayType.liexun)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={() => handeChangeType(PlayType.sui)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );

      default:
        break;
    }
  };

  // const imgRef = useRef<HTMLImageElement>(null);
  // const { text: songAndAuth } = useReLoadImage(imgRef, picUrl, "picture", () =>
  //   name && authName ? name + "-" + authName : ""
  // );

  const songAndAuth = name + "-" + authName;

  const DrawerConfig: DrawProps & {
    handeChangeType: any;
    type: {
      type: PlayType;
    };
  } = {
    picUrl: picUrl,
    time: time?.timeStr,
    // musicRef: musicRef,
    // lyric: lyric,
    songId: songId,
    handeChangeType: handeChangeType,
    type: type,
    backGroundColor,
  };

  const { time: duraTionTime, timeStr: durationTime } = useMemo(() => {
    return player.getDurationTime(dt);
    // return "00:00";
  }, [dt]);

  const hocConfig = {
    type: type.type,
    duration: duraTionTime,
    currentTime: time.time,
  };

  const renderDivOne = () => (
    <DivOne>
      <div
        onClick={debouncedCallback(
          (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
            drawerRef.current.changeVisiable();
            e.stopPropagation();
          }
        )}
      >
        {picUrl ? <img src={picUrl} /> : "-"}
      </div>

      <div>
        <Tooltip title={songAndAuth}>
          <SongsInfo>
            {songAndAuth?.length > 16
              ? songAndAuth?.slice(0, 16) + "..."
              : songAndAuth}
          </SongsInfo>
        </Tooltip>
        <span style={{ width: "3.4rem", display: "inline-block" }}>
          {time?.timeStr}
        </span>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span>{durationTime}</span>
      </div>
    </DivOne>
  );

  const onChangeToneQuality = (config: { key: string; label: string }) => {
    player.changeToneQuality(config.key);
    setParam(changeToneQuality({ toneQuality: config }));
  };
  const items = [
    {
      key: "standard",
      label: (
        <label>
          <div
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
            onClick={player.playPrev}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
            style={{ cursor: "pointer" }}
          />

          {play !== "play" ? (
            <Play
              onClick={player?.playMusic}
              theme="outline"
              size="24"
              fill="rgb(251, 236, 222)"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <PauseOne
              onClick={player?.pauseMusic}
              theme="outline"
              size="24"
              fill="rgb(251, 236, 222)"
              style={{ cursor: "pointer" }}
            />
          )}
          <GoEnd
            // onClick={debouncedCallback(() => goPrevorNext("next"))}
            onClick={player.playNext}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
            style={{ cursor: "pointer" }}
          />
          <Like songId={useMemo(() => songId, [songId])} />

          {/* {loginStatus ? (
            <svg
              fill="#d86267"
              width="24px"
              height="24px"
              viewBox="0 0 7.68 7.68"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                cursor: "pointer",
              }}
              onClick={debouncedCallback(() => {
                try {
                  console.log("likeSongs", likeSongs);
                  const startId =
                    likeSongs.findIndex((id) => id === data[0].id) === -1
                      ? likeSongs[0]
                      : songId;
                  console.log("startId", startId, playList?.[0]?.id);

                  if (startId && playList?.[0]?.id) {
                    getHeartBit({
                      id: startId as string,
                      pid: playList[0].id,
                    });
                  } else {
                    message.warning("请先收藏一些歌曲");
                  }
                } catch (error) {
                  console.log(error);
                }
              })}
            >
              <path d="M2.16 3.96H0.96a0.12 0.12 0 0 1 0 -0.24h1.136l0.444 -0.667a0.12 0.12 0 0 1 0.2 0L3.6 4.344l0.38 -0.57A0.12 0.12 0 0 1 4.08 3.72h0.72a0.12 0.12 0 0 1 0 0.24h-0.656l-0.444 0.667a0.12 0.12 0 0 1 -0.2 0L2.64 3.336l-0.38 0.57A0.12 0.12 0 0 1 2.16 3.96m3.12 -2.88a1.676 1.676 0 0 0 -1.44 0.814A1.68 1.68 0 0 0 0.72 2.76c0 0.042 0.001 0.085 0.004 0.127a0.12 0.12 0 0 0 0.24 -0.014A1.98 1.98 0 0 1 0.96 2.76a1.44 1.44 0 0 1 2.769 -0.555 0.12 0.12 0 0 0 0.111 0.074 0.12 0.12 0 0 0 0.111 -0.074A1.44 1.44 0 0 1 6.72 2.76c0 1.791 -2.466 3.334 -2.88 3.581 -0.25 -0.148 -1.242 -0.765 -1.99 -1.62a0.12 0.12 0 0 0 -0.181 0.158c0.885 1.013 2.062 1.678 2.112 1.706a0.12 0.12 0 0 0 0.117 0 9.39 9.39 0 0 0 1.522 -1.111C6.442 4.555 6.96 3.641 6.96 2.76a1.682 1.682 0 0 0 -1.68 -1.68" />
            </svg>
          ) : null} */}
        </DivTwo>
        <DivThree>
          {/* <Acoustic
        title="音效"
        theme="outline"
        size="24"
        fill="rgb(237, 195, 194)"
      /> */}
          <Dropdown
            menu={{ items }}
            dropdownRender={(menus) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const { items } = menus.props;
              return (
                <ToneQualityContainer>
                  {items.map((ele: any) => {
                    return (
                      <ToneQualityDiv key={ele.key}>{ele.label}</ToneQualityDiv>
                    );
                  })}
                </ToneQualityContainer>
              );
            }}
            placement="bottomLeft"
          >
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
          {/* <VolumeWrap>
            <div>
              <Slider
                vertical
                value={volume}
                onChange={(volume) => {
                  setVolume(volume);
                  // musicRef.current.volume = volume * 0.01;
                  // volume && changeOpen(true);
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
          </VolumeWrap> */}
        </DivThree>
      </DivRight>
    );
  };

  return (
    <Container id={"player"}>
      <FatherHoc {...hocConfig}>
        {renderDivOne()}
        {renderDivRight()}
        <Drawer ref={drawerRef} {...DrawerConfig} />
        <NowList ref={nowListRef} />
      </FatherHoc>
    </Container>
  );
};

Dynamic.whyDidYouRender = true;

const ToneQualityContainer = styled.div`
  width: 90px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ToneQualityDiv = styled.div`
  width: 100%;
  :hover {
    background-color: rgb(0, 0, 0.9);
  }
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
`;
