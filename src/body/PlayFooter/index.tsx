import {
  GoEnd,
  GoStart,
  Play,
  PauseOne,
  Like,
  ShareOne,
  Acoustic,
  PlayOnce,
  LoopOnce,
  PlayCycle,
  ShuffleOne,
  ListBottom,
  VolumeSmall,
  VolumeMute,
} from "@icon-park/react";
import { useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import styled from "@emotion/styled";
import Drawer from "./Drawer";
import { Slider } from "antd";
import {
  useSongComment,
  useSongDetail,
  useSonglyric,
  useSongUrl,
} from "./utils";
import { PLAYCONSTANTS } from "./contants";
import { playState } from "store/play";
import { useMount, useInterVal } from "hooks";

enum PlayType {
  dan,
  shun,
  liexun,
  sui,
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

export const PlayFooter = () => {
  const [play, setPlay] = useState(false);
  const [open, setOpen] = useState(true);
  const [type, dispatch] = useReducer(reducer, { type: PlayType.liexun });

  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);

  const drawerRef: React.MutableRefObject<any> = useRef();
  const musicRef: React.MutableRefObject<any> = useRef();
  const [time, setTime] = useState("");

  const playMusic = (play: boolean) => {
    play ? musicRef.current?.play() : musicRef.current?.pause();
  };

  const playState = useSelector<RootState, Pick<playState, "songId">>(
    (state) => state.play
  );

  // 初始音量
  useMount(() => {
    if (musicRef.current) musicRef.current.volume = volume * 0.01;
  });

  const { songId } = playState;
  const { data: { data } = { data: { data: [] } } } = useSongUrl(songId);
  const {
    data: {
      songs: [
        {
          al: { name, picUrl },
          ar: [{ name: authName }],
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(songId);

  const { data: { lrc: { lyric } } = { lrc: { lyric: "" } } } =
    useSonglyric(songId);

  const { data: comment } = useSongComment(songId);

  const changePaly = (play: boolean) => {
    setPlay(play);
  };

  const changeOpen = (open: boolean) => {
    setOpen(open);
    if (!open) {
      musicRef.current.volume = 0;
      setVolume(0);
      return;
    }
  };

  const handeChangeType = (type: number) => {
    dispatch({ type });
  };
  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={() => handeChangeType(PlayType.dan)}
            theme="outline"
            size="24"
            fill="#333"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={() => handeChangeType(PlayType.shun)}
            theme="outline"
            size="24"
            fill="blue"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={() => handeChangeType(PlayType.liexun)}
            theme="outline"
            size="24"
            fill="green"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={() => handeChangeType(PlayType.sui)}
            theme="outline"
            size="24"
            fill="yellow"
          />
        );

      default:
        break;
    }
  };

  const musicTime = () => {
    const audio = musicRef.current;
    const timeCount = Math.floor(audio.currentTime); // 总时长秒数
    const minutes = parseInt(audio.duration / 60 + ""); // 获取总时长分钟
    const seconds = parseInt((audio.duration % 60) + ""); // 获取总时长秒数
    const timeMinute = Math.floor(timeCount / 60); // 当前播放进度 分
    const timeDisplay = Math.floor(audio.currentTime % 60); // 当前播放进度 秒
    const secondsTime = timeDisplay < 10 ? "0" + timeDisplay : timeDisplay; // 秒

    const t = timeMinute < 10 ? "0" + timeMinute : timeMinute;
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    return [t + ":" + secondsTime, "/", m + ":" + s] as const;
  };

  // 随着音乐播放，进度条自动行进
  useInterVal(() => {
    play ? setDuration((dura) => dura + 1) : null;
  }, 1000);

  const audioTimeUpdate = () => {
    const { currentTime = 0 } = musicRef.current;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    const timeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    setTime(timeStr);
  };

  const songAndAuth = () => {
    return name + "-" + authName;
  };

  const DrawerConfig = {
    picUrl: picUrl,
    name: name,
    musicRef: musicRef,
    lyric: lyric,
  };

  return (
    <Container>
      <Progress>
        <Slider
          value={duration}
          onChange={(dura) => {
            setDuration(dura);
            musicRef.current.currentTime = dura;
          }}
          tooltip={{ open: false }}
          min={0}
          max={musicRef.current?.duration}
          step={1}
          style={{ height: "85%", bottom: "none" }}
        />
      </Progress>
      <DivOne>
        {picUrl ? (
          <div onClick={() => drawerRef.current.changeVisiable()}>
            <img src={picUrl} alt="" />
          </div>
        ) : (
          <div onClick={() => drawerRef.current.changeVisiable()}>
            <p>music</p>
          </div>
        )}
        <div>
          <div title={songAndAuth()} style={{ cursor: "pointer" }}>
            {songAndAuth().length > 16
              ? songAndAuth().slice(0, 16) + "..."
              : songAndAuth()}
          </div>

          {data[0] ? (
            musicTime().map((time, index) => {
              return (
                <span key={index} style={{ margin: "2px" }}>
                  {time}
                </span>
              );
            })
          ) : (
            <>
              <span>00:00</span>
              <span style={{ color: "red" }}>/00:00</span>
            </>
          )}
        </div>
      </DivOne>
      <DivTwo>
        <Like theme="outline" size="24" fill="#333" />
        <GoStart theme="outline" size="24" fill="#333" />
        {!play ? (
          <Play
            onClick={() => {
              changePaly(true);
              playMusic(true);
              console.log("musicTime();", musicTime());
            }}
            theme="outline"
            size="24"
            fill="#333"
          />
        ) : (
          <PauseOne
            onClick={() => {
              changePaly(false);
              playMusic(false);
            }}
            theme="outline"
            size="24"
            fill="yellow"
          />
        )}
        <GoEnd theme="outline" size="24" fill="#333" />
        <ShareOne theme="outline" size="24" fill="#333" />
      </DivTwo>
      <DivThree>
        <Acoustic title="音效" theme="outline" size="24" fill="#333" />
        {getElement(type.type)}
        <ListBottom title="播放列表" theme="outline" size="24" fill="#333" />
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
              fill="#333"
            />
          ) : (
            <VolumeMute
              theme="outline"
              onClick={() => changeOpen(true)}
              size="24"
              fill="#333"
            />
          )}
        </VolumeWrap>
      </DivThree>
      <audio
        controls
        ref={musicRef}
        src={data[0]?.url}
        style={{ display: "none" }}
        onTimeUpdate={audioTimeUpdate}
      />
      <Drawer ref={drawerRef} {...DrawerConfig} />
    </Container>
  );
};

const Container = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.3rem;
  background: aliceblue;
  position: relative;

  .ant-drawer {
    margin-bottom: 4.3rem;
    border: none;
    z-index: -1;
  }

  .ant-drawer-body {
    padding: 0;
  }
`;

const DivOne = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  align-items: center;

  > div:nth-of-type(1) {
    width: 3rem;
    height: 3rem;
    margin-left: 0.9rem;
    border: 1px solid darkblue;
    text-align: center;

    > img:nth-of-type(1) {
      width: 100%;
      height: 100%;
    }
  }

  > div:nth-of-type(2) {
    margin-left: 1rem;

    > div:nth-of-type(1) {
      margin-bottom: 0.3rem;
    }
  }
`;

const DivTwo = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const DivThree = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const VolumeWrap = styled.div`
  position: relative;
  &:hover {
    > div:nth-of-type(1) {
      display: block;
    }
  }

  > div:nth-of-type(1) {
    width: 2rem;
    position: absolute;
    height: 4.5rem;
    background: rgb(236, 44, 100);
    top: -4.5rem;
    border-radius: 0.8rem;
    display: none;
    z-index: 999;

    &:hover {
      display: block;
    }
  }
`;

const Progress = styled.div`
  height: 0.25rem;
  background: rgb(167, 83, 90);
  position: absolute;
  top: 0.1rem;
  left: 0;
  width: 100%;
  z-index: 99;

  .ant-slider {
    margin: 0;
    padding-block: 0;

    .ant-slider-handle {
      top: -2px;
    }
  }
`;

PlayFooter.whyDidYouRender = true;
