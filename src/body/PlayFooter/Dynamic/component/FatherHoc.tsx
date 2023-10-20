import { useMemo, Dispatch, SetStateAction, useEffect } from "react";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Slider } from "antd";

import { PlayType } from "..";
import { changePlay } from "store/play";
import { Progress } from "body/PlayFooter/style";
import { log } from "console";

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
        console.log("zhixing 单曲");
        musicRef.current.currentTime = 0;
        musicRef.current?.play();
      },
      [PlayType.shun]: function () {
        console.log("zhixing 顺序");
        goPrevorNext("next");
      },
      [PlayType.liexun]: function () {
        console.log("zhixing 列表");
        goPrevorNext("next");
      },
      [PlayType.sui]: function () {
        console.log("zhixing 随机");
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
