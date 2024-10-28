import { useMemo, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dispatch as reduxDispatch, AnyAction } from "redux";
import { Slider } from "antd";

import { player, PlayType } from "..";
import { changePlay } from "store/play";
import { Progress } from "body/PlayFooter/style";
import { TimeType } from "./utils";

interface FatherHocProps {
  children: React.ReactNode;
  // musicRef: React.MutableRefObject<HTMLAudioElement>;
  songId?: number | string;
  setParam: reduxDispatch<AnyAction>;
  type: PlayType;
  goPrevorNext: (key: string, reback?: string) => void;
  duration: number;
  currentTime: number;
  // setDuration: Dispatch<SetStateAction<number>>;
  play: string | undefined;
  setTime: Dispatch<SetStateAction<TimeType>>;
}

export const FatherHoc: React.FC<FatherHocProps> = ({
  children,
  // musicRef,
  songId,
  setParam,
  type,
  goPrevorNext,
  currentTime,
  duration,
  // setDuration,
  play,
  setTime,
}) => {
  // 使用策略模式替换 if else
  const songsType = useMemo(
    () => ({
      [PlayType.dan]: function () {
        // goPrevorNext("autonext", "dan");
        // player.p
        console.log("单曲播放");
        player.singlePlay();
      },
      [PlayType.shun]: function () {
        // goPrevorNext("autonext", "shun");
        player.loopList();
      },
      [PlayType.liexun]: function () {
        // goPrevorNext("autonext", "liexun");
        // player.
      },
      [PlayType.sui]: function () {
        // goPrevorNext("autonext", "random");
        player.playRandomly();
      },
    }),
    [goPrevorNext]
  );

  const [cur, setCur] = useState(0);
  useEffect(() => {
    console.log("currentTime >>>", currentTime, duration);
    if (currentTime > duration) {
      console.log("播放完毕");
      // setCur(0);
      // console.log("播放完了");
      // localStorage.setItem("currentTime", "0");
      // songsType[type]();
      switch (type) {
        case PlayType.dan:
          console.log("单曲播放");
          player.singlePlay();
          break;
        case PlayType.liexun:
          console.log("列表循环");
          player.loopList();
          break;
        case PlayType.sui:
          console.log("随机播放");
          player.playRandomly();
          break;
        default:
          break;
      }
    }
  }, [type, currentTime, duration]);

  return (
    <>
      <Progress>
        <Slider
          value={currentTime}
          onChange={(cur) => {
            // console.log
            // setTime((t) => {
            //   t.time = cur;
            //   return { ...t };
            // });

            player.setCurrentTime(cur);
            // setCur(cur);
            // play !== "play" && setParam(changePlay({ play: "play" }));
            // musicRef.current.currentTime = dura;
          }}
          tooltip={{ open: false }}
          min={0}
          max={duration}
          step={1}
          style={{ height: "85%", bottom: "none" }}
        />
      </Progress>
      {children}
    </>
  );
};
