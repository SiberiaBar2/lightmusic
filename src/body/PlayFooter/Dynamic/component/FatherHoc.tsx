import { useMemo, Dispatch, SetStateAction, useEffect } from "react";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Slider } from "antd";

import { PlayType } from "..";
import { changePlay } from "store/play";
import { Progress } from "body/PlayFooter/style";

interface FatherHocProps {
  children: React.ReactNode;
  musicRef: React.MutableRefObject<HTMLAudioElement>;
  songId?: number | string;
  setParam: reduxDispatch<AnyAction>;
  type: PlayType;
  goPrevorNext: (key: string, reback?: string) => void;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  play: string | undefined;
}

export const FatherHoc: React.FC<FatherHocProps> = ({
  children,
  musicRef,
  songId,
  setParam,
  type,
  goPrevorNext,
  duration,
  setDuration,
  play,
}) => {
  // // 切歌时重置播放进度
  // useMemo(() => {
  //   setDuration(0);
  //   localStorage.setItem("currentTime", "0");
  // }, [songId]);

  // 使用策略模式替换 if else
  const songsType = useMemo(
    () => ({
      [PlayType.dan]: function () {
        goPrevorNext("dan");
      },
      [PlayType.shun]: function () {
        goPrevorNext("next");
      },
      [PlayType.liexun]: function () {
        goPrevorNext("next");
      },
      [PlayType.sui]: function () {
        goPrevorNext("next", "random");
      },
    }),
    [goPrevorNext, musicRef.current?.currentTime]
  );

  useEffect(() => {
    if (duration >= musicRef.current?.duration) {
      setDuration(0);
      console.log("播放完了");
      localStorage.setItem("currentTime", "0");
      songsType[type]();
    }
  }, [setDuration, duration, musicRef.current?.duration, songsType, type]);

  return (
    <>
      <Progress>
        <Slider
          value={duration}
          onChange={(dura) => {
            setDuration(dura);
            play !== "play" && setParam(changePlay({ play: "play" }));
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
