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
}) => {
  // 切歌时重置播放进度
  useMemo(() => {
    setDuration(0);
    localStorage.setItem("currentTime", "0");
  }, [songId]);

  // 使用策略模式替换 if else
  const songsType = useMemo(
    () => ({
      [PlayType.dan]: function () {
        setParam(changePlay({ play: "play" }));
      },
      [PlayType.shun]: function () {
        goPrevorNext("next");
      },
      [PlayType.liexun]: function () {
        goPrevorNext("next", "reback");
      },
      [PlayType.sui]: function () {
        goPrevorNext("next", "random");
      },
    }),
    [setParam, goPrevorNext, changePlay]
  );

  useEffect(() => {
    if (duration >= musicRef.current?.duration) {
      songsType[type]();
      // 重置播放进度从新播放
      setDuration(0);
      // 播放完毕 清除 currentTime 记忆值
      localStorage.setItem("currentTime", "0");
    }
  }, [setDuration, duration, musicRef.current?.duration, songsType]);

  return (
    <>
      <Progress>
        <Slider
          value={duration}
          onChange={(dura) => {
            setDuration(dura);
            setParam(changePlay({ play: "play" }));
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
