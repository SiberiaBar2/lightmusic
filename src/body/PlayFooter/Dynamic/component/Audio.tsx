import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { stringAdds } from "utils/utils";
import { AnyAction, Dispatch } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { message } from "antd";

interface AudiosProps {
  musicRef: React.MutableRefObject<HTMLAudioElement>;
  audioTimeUpdate: () => void;
  onDurationChange: () => void;
  play: string | undefined;
  data: any;
  setParam: Dispatch<AnyAction>;
  changePlay: ActionCreatorWithPayload<any, "play/changePlay">;
  goPrevorNext: (key: string, reback?: string | undefined) => void;
}

// 避免受到其他组件渲染的影响
export const Audio: React.FC<AudiosProps> = React.memo(
  ({
    musicRef,
    audioTimeUpdate,
    onDurationChange,
    play,
    data,
    setParam,
    changePlay,
    goPrevorNext,
  }) => {
    console.log("render", dayjs().format("YYYY-MM-DD:HH:mm:ss"));

    const listenFunc = useCallback(() => {
      console.log("刷新");
      localStorage.setItem("currentTime", "0");
    }, []);

    addEventListener("load", listenFunc);
    // 保存上一次的有效currentTime信息
    // 在状态为播放且 currentTime 因重渲重置为零的情况下 恢复之前的 currentTime
    useEffect(() => {
      if (musicRef.current) {
        const { currentTime } = musicRef.current;
        // 只保存不为零的 有效值
        if (currentTime) {
          localStorage.setItem("currentTime", currentTime + "");
        }

        if (
          play === "play" &&
          currentTime === 0 &&
          Number(localStorage.getItem("currentTime"))
        ) {
          // 恢复因为重渲而变为0的 currentTime 并调用 play 重新开始播放
          musicRef.current.currentTime = Number(
            localStorage.getItem("currentTime")
          );
          musicRef.current.play();
          console.log("再赋值", musicRef.current.currentTime);
        }
      }
      return () => {
        removeEventListener("load", listenFunc);
      };
    });

    return (
      <audio
        controls
        ref={musicRef}
        src={stringAdds(data[0].url)}
        preload="auto"
        style={{ display: "none" }}
        onTimeUpdate={audioTimeUpdate}
        onDurationChange={onDurationChange}
        // onWaiting={(e) => {
        //   console.log("onWaiting", e);
        // }}
        onPlay={(e) => {
          console.log("onPlay", e);
          setParam(changePlay({ play: "play" }));
        }}
        onPause={(e) => {
          console.log("onPaste", e, "play", play);
          setParam(changePlay({ play: "pause" }));
        }}
        // onPlaying={(e) => {
        //   console.log("onPlaying", e);
        // }}
        // onWaitingCapture={(e) => {
        //   console.log("onWaitingCapture", e);
        // }}
        // onSuspend={(e) => {
        //   console.log("onSuspend", e);
        // }}
        onError={() => {
          console.log("onError");
          // (async () => {
          //   try {
          //     await (play && musicRef.current && musicRef.current.play());
          //   } catch (error) {
          //     console.log("catch error", error);
          //     message.warning("当前音乐不可播放，已自动播放下一曲");
          //     goPrevorNext("next");
          //   }
          // })();
        }}
      />
    );
  }
);

Audio.whyDidYouRender = true;
