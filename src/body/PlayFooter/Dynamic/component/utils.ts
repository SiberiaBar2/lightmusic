import { MutableRefObject, useCallback } from "react";
import { useDispatch } from "react-redux";

import store from "store";
import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import { https } from "utils";

interface ToggleSongs {
  play: string | undefined;
  songsState: Pick<songsState, "songId" | "song" | "prevornext">;
  song: string | number;
  prevornext: string;
  musicRef: MutableRefObject<HTMLAudioElement>;
}

export const useToggleSongs = ({
  prevornext,
  song,
  songsState,
  play,
  musicRef,
}: ToggleSongs) => {
  const dispatch = useDispatch();
  return useCallback(
    (key: string, reback?: string) => {
      let copyPlay = "play";
      let togo = key === "prev" ? Number(song) - 1 : Number(song) + 1;
      const getSongsId = prevornext.split(",").map((ele: any) => Number(ele));
      const min = 0;
      const max = getSongsId?.length - 1;

      if (togo < min) {
        togo = max;
      }
      if (togo > max) {
        togo = 0;
      }

      if (key === "autonext") {
        if (reback === "dan") {
          togo = Number(song);
          // musicRef.current.currentTime = 0;
          // musicRef.current?.play();
        }
        if (getSongsId?.length - 1 === 0 && togo === 0 && reback === "liexun") {
          // musicRef.current.currentTime = 0;
          // musicRef.current?.play();
        }

        if (reback === "shun" && getSongsId?.length - 1 === song) {
          copyPlay = "pause";
          togo = Number(song);
        }
        // 生成一个歌曲列表下标数组之内的随机数
        if (reback === "random") {
          togo = Math.round(Math.random() * max);
        }
      }

      if (getSongsId?.length - 1 === 0 && key === "next") {
        // musicRef.current.currentTime = 0;
        // musicRef.current?.play();
      }

      dispatch(
        songsInfo({
          ...songsState,
          songId: getSongsId[togo],
          song: togo,
        })
      );
      localStorage.setItem("musicTime", "0");

      console.log("copyPlay", copyPlay);

      dispatch(changePlay({ play: copyPlay }));
    },
    // 未加依赖项 陷入闭包陷阱 要注意传入的props并非useCallback函数的直接函数参数
    // 因此必须指定依赖项
    [changePlay, songsInfo, prevornext, song, songsState, play]
  );
};

export type TimeType = { time: number; timeStr: string };
type SongConfig = {
  prevornext: string;
  song: string | number;
  // songsState: any;
  songId: number;
};
const cookie = localStorage.getItem("cookie");

const TIME = {
  time: 0,
  timeStr: "00:00",
};

export class BasicPlayer {
  public retry = 0;
  public toneQuality = "";
  public noCopyRight = false;
  public songsState: any = {};
  public songPlayDetail: any = {};
  public getSongsId: number[] = [];
  public currentTime: number | undefined = 0;
  public audio: HTMLAudioElement | null = null;
  public upDadeTime = {
    ...TIME,
  };
  public duraTionTime = {
    ...TIME,
  };

  public setRenderCurrentTime: (({ time, timeStr }: TimeType) => void) | null =
    null;
  public saveRenderTime = (h: typeof this.setRenderCurrentTime) => {
    this.setRenderCurrentTime = h;
  };
  constructor() {
    this.initAudio();
  }
  public initAudio = (url?: string) => {
    this.toneQuality =
      store.getState?.()?.toneQuality?.toneQuality?.key || "standard";

    if (!this.audio) {
      this.audio = new Audio(url);
      this.audio.volume = 0.5;
      this.audio.controls = true;
      this.audio.preload = "auto";
      this.audio.setAttribute(
        "style",
        `{
        display: "none",
      }`
      );
      this.audio.currentTime = this.currentTime!;
      this.audio.ontimeupdate = this.ontimeUpdate;
    }
  };

  public clearAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
      this.audio = null;
    }
  }

  public playMusic = async () => {
    try {
      await this.getSongState();
      await this.getSongPlayDetail(
        this.getSongsId[this.songsState.song as number] + ""
      );
      console.log("songPlayDetail", this.songPlayDetail);
      if (!this.songPlayDetail?.url) {
        throw new Error("播放地址不存在或无权限");
      }
      this.clearAudio();
      this.initAudio(this.songPlayDetail?.url);
      // 播放
      if (this.audio && this.audio.paused) {
        this.audio.play();
        store.dispatch(changePlay({ play: "play" }));
      }
    } catch (error) {
      console.error("播放出错了", error);
      console.log("播放错误", this.audio?.ended, this.songPlayDetail);
      if (this.retry >= 2) {
        setTimeout(() => {
          this.reset();
          this.getSongState();

          // 如果已经到播放列表的最后一项 停止切换下一曲
          if (
            this.getSongsId[this.songsState.song as number] ===
            this.getSongsId[this.getSongsId?.length - 1]
          ) {
            return;
          } else {
            this.playNext();
          }
        }, 1000);
      } else {
        this.retry += 1;
        setTimeout(() => {
          console.log("重新播放", this.retry);
          this.getSongPlayDetail(this.getSongsId[+this.songsState.song] + "");
          this.playMusic();
        }, 1000);
      }
    }
  };

  public pauseMusic = () => {
    try {
      if (this.audio && !this.audio.paused) {
        this.audio?.pause();
        store.dispatch(changePlay({ play: "pause" }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  public getSongPlayDetail = async (id: string) => {
    const client = https();
    const res = await client("song/url/v1", {
      data: { id, cookie, level: this.toneQuality },
    });
    this.songPlayDetail = res?.data?.[0];
  };

  public setCurrentTime = (time: number) => {
    this.currentTime = time;
    this.audio!.currentTime = time;
    this.ontimeUpdateStr();
    if (this.audio?.paused) this.playMusic();
  };

  public getCurrentIndex = (index: number) => {
    let togo = index;
    const min = 0;
    const max = this.getSongsId?.length - 1;

    if (togo < min) {
      togo = max;
    }
    if (togo > max) {
      togo = 0;
    }

    return togo;
  };

  public getSongState = () => {
    this.songsState = store.getState()?.songs;
    this.getSongsId = this.songsState.prevornext
      ?.split(",")
      .map((ele: any) => Number(ele));
  };
  private changeSong = (index: number) => {
    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: this.getSongsId[index],
        song: index,
      })
    );
    this.reset();
    this.playMusic();
  };
  public playPrev = () => {
    this.clearAudio();
    this.getSongState();
    const prev = this.getCurrentIndex(Number(this.songsState?.song) - 1);
    this.songsState = {
      ...this.songsState,
      song: prev,
    };
    this.changeSong(prev);
  };
  public playNext = () => {
    this.clearAudio();
    this.getSongState();
    const next = this.getCurrentIndex(Number(this.songsState?.song) + 1);
    this.songsState = {
      ...this.songsState,
      song: next,
    };
    this.changeSong(next);
  };
  public changeToneQuality = (toneQuality: string) => {
    this.getSongState();
    this.toneQuality = toneQuality;
    this.currentTime = this.audio?.currentTime;
    const index = +this.songsState.song;
    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: this.getSongsId[index],
        song: index,
      })
    );
    this.playMusic();
  };
  public getDurationTime = (dt: number) => {
    if (dt) {
      const totalSeconds = Math.floor(dt / 1000); // 毫秒转秒
      const minutes = Math.floor(totalSeconds / 60); // 完整分钟
      const seconds = totalSeconds % 60; // 剩余秒数

      const currentTimeStr =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

      this.duraTionTime.time = totalSeconds;
      this.duraTionTime.timeStr = currentTimeStr;
      return this.duraTionTime;
    }
    return this.duraTionTime;
  };
  public changeVolume = (volume: number) => {
    this.audio!.volume = volume;
  };
  // 获取当前播放进度、时长
  public ontimeUpdate = (event: Event) => {
    // 保存播放进度
    if (this.audio?.currentTime) {
      this.currentTime = this.audio?.currentTime;
    }
    // 播放完毕 并且是vip歌曲 表示当前用户不是vip 试听结束
    if (this.audio?.ended && this.songPlayDetail?.fee === 1) {
      this.playNext();
    }
    this.ontimeUpdateStr();
  };

  public ontimeUpdateStr = () => {
    const currentTime = this.audio?.currentTime || 0;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    const currentTimeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    this.upDadeTime.time = currentTime;
    this.upDadeTime.timeStr = currentTimeStr;
    this.setRenderCurrentTime?.({ ...this.upDadeTime }); // ??
  };

  public saveSongConfig = (config: SongConfig) => {
    this.reset();
    this.clearAudio();
    this.songsState = { ...config };
    this.getSongsId = this.songsState.prevornext
      ?.split(",")
      .map((ele: any) => Number(ele));

    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: config.songId,
        song: +this.songsState?.song,
        prevornext: config.prevornext,
      })
    );
    this.getSongPlayDetail(
      this.getSongsId[this.songsState.song as number] + ""
    );
    this.playMusic();
  };
  public reset = () => {
    this.retry = 0;
    this.currentTime = 0;
    this.upDadeTime.time = 0;
    this.upDadeTime.timeStr = "00:00";
    this.setRenderCurrentTime?.({ ...this.upDadeTime });
  };
}

export class Controller extends BasicPlayer {
  public singlePlay = () => {
    this.reset();
    this.playMusic();
  };
  public loopList = () => {
    this.reset();
    this.playNext();
  };
  public playRandomly = () => {
    this.reset();
    this.getSongState();
    const max = this.getSongsId?.length - 1;
    const random = Math.round(Math.random() * max);

    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: this.getSongsId[random],
        song: random,
      })
    );

    this.getSongPlayDetail(this.getSongsId[random] + "");
    this.reset();
    this.playMusic();
  };

  // 喜欢歌曲
  public likeSong = () => {
    // this.audio?.play();
  };
  // 开启心动模式💓
  public openHeartbeat = () => {
    // this.audio?.play();
  };
}
