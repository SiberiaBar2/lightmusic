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
  songsState: any;
};
const cookie = localStorage.getItem("cookie");

export class BasicPlayer {
  // public time = "";
  // public volume = 0;
  // public duration = "";
  public retry = 0;
  public playUrl = "";
  public oldPlayUrl = "";
  public playList: any[] = [];
  public songDetail: any = {};
  public noCopyRight = false;
  public currentTime: number | undefined = 0;
  public audio: HTMLAudioElement | null = null;
  public prevornext = "";
  public song: number | string = "";
  public songsState: any = {};
  public upDadeTime = {
    time: 0,
    timeStr: "00:00",
  };
  public duraTionTime = {
    time: 0,
    timeStr: "00:00",
  };
  public toneQuality = "";
  public setRenderCurrentTime: (({ time, timeStr }: TimeType) => void) | null =
    null;
  public saveRenderTime = (h: typeof this.setRenderCurrentTime) => {
    this.setRenderCurrentTime = h;
  };
  constructor() {
    this.initAudio();
  }
  public initAudio = (url?: string) => {
    console.log(
      "store.getState",
      store.getState?.()?.toneQuality?.toneQuality?.key
    );

    this.toneQuality =
      store.getState?.()?.toneQuality?.toneQuality?.key || "standard";

    if (!this.audio) {
      this.audio = new Audio(url);
      // this.audio.load();
      this.audio.volume = 0.5;
      this.audio.controls = true;
      this.audio.preload = "auto";
      this.audio.setAttribute(
        "style",
        `{
        display: "none",
      }`
      );
      this.audio.ontimeupdate = this.ontimeUpdate;
    }
  };

  public saveSongDetail = (data: any) => {
    this.songDetail = data;
  };
  public savePlayList = (list: any[]) => {
    this.playList = list;
  };
  public changeUrl = (url: string, isOld?: boolean) => {
    if (this.audio) {
      this.retry = 0;
      this.playList = [];
      this.songDetail = {};
      this.audio.src = url;
      this.setRenderCurrentTime = null;
      isOld ? (this.currentTime = 0) : null;
    }
  };

  public playMusic = () => {
    try {
      // if (this.noCopyRight) {
      // }
      //长时间暂停可能会导致请求超时或文件缓存失效。浏览器会认为连接已经中断，导致音频无法正常播放。
      if ((!this.audio || this.audio?.ended) && this.playUrl) {
        this.audio = new Audio(this.playUrl); // 创建或重新加载音频文件
      } else if (this.audio?.paused) {
        // 长时间暂停后再恢复播放，音频文件可能已经被浏览器回收，导致后续播放无效
        this.audio?.load(); // 重新加载音频
      }

      // 播放
      if (this.audio && this.audio.paused) {
        console.log("this.currentTime play;", this.currentTime);
        console.log("this.audio.src", this.audio.src, this.song);

        this.audio.currentTime = this.currentTime!;
        this.audio.ontimeupdate = this.ontimeUpdate;
        this.audio.play();
        store.dispatch(changePlay({ play: "play" }));
      }
      console.log("play 1111", this.audio?.currentTime);
    } catch (error) {
      console.error(error);
      this.retry += 1;
      // this.playMusic();
      if (this.retry >= 2) {
        // 播放下一首
        // this.playNext();
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
      this.pauseMusic();
    }
  };

  public getSongUrl = async (id: string, level?: string) => {
    const client = https();
    const res = await client("song/url/v1", { data: { id, cookie, level } });
    return res?.data?.[0]?.url;
  };

  public setCurrentTime = (time: number) => {
    this.pauseMusic();
    // 避开暂停中断播放的错误
    setTimeout(() => {
      this.currentTime = time;

      if (time) {
        this.playMusic();
      }
    }, 200);
  };

  public getCurrentIndex = (index: number) => {
    let togo = index;
    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    const min = 0;
    const max = getSongsId?.length - 1;

    if (togo < min) {
      togo = max;
    }
    if (togo > max) {
      togo = 0;
    }

    return togo;
  };
  public playPrev = () => {
    const prev = this.getCurrentIndex(Number(this.song) - 1);

    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    console.log("getSongsId[prev]", getSongsId[prev], prev);

    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: getSongsId[prev],
        song: prev,
      })
    );
    this.getSongUrl(getSongsId[prev] + "", this.toneQuality).then((url) => {
      if (url) {
        this.changeUrl(url);
        this.playMusic();
      }
    });
  };
  public playNext = () => {
    const next = this.getCurrentIndex(Number(this.song) + 1);
    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    console.log("getSongsId[next]", getSongsId[next]);
    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: getSongsId[next],
        song: next,
      })
    );
    this.getSongUrl(getSongsId[next] + "", this.toneQuality).then((url) => {
      if (url) {
        this.changeUrl(url);
        this.playMusic();
      }
    });
  };
  public changeToneQuality = (toneQuality: string) => {
    this.toneQuality = toneQuality;
    console.log(
      "this.audio?.currentTime changeToneQuality",
      this.audio?.currentTime
    );
    this.currentTime = this.audio?.currentTime;
    // 重新发起请求
    this.pauseMusic();

    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    setTimeout(() => {
      this.getSongUrl(
        getSongsId[this.song as number] + "",
        this.toneQuality
      ).then((url) => {
        console.log("url====>url", url);
        if (url) {
          this.changeUrl(url, true);
          this.playMusic();
        }
      });
    }, 200);
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
    // this.volume = volume;
    this.audio!.volume = volume;
  };
  // 获取当前播放进度、时长
  public ontimeUpdate = (event: Event) => {
    // 保存播放进度
    if (this.audio?.currentTime) {
      console.log("sdsdasdsadas", this.audio?.currentTime);
      this.currentTime = this.audio?.currentTime;
    }

    console.log("this.currentTime=====>", this.currentTime);
    this.ontimeUpdateStr();
  };

  public ontimeUpdateStr = () => {
    const currentTime = this.audio?.currentTime || 0;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    console.log("currentTime", currentTime);

    const currentTimeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    this.upDadeTime.time = currentTime;
    this.upDadeTime.timeStr = currentTimeStr;
    this.setRenderCurrentTime?.({ ...this.upDadeTime }); // ??
  };

  public saveSongConfig = (config: SongConfig) => {
    this.prevornext = config.prevornext;
    this.song = config.song;
    this.songsState = config.songsState;

    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    this.getSongUrl(
      getSongsId[this.song as number] + "",
      this.toneQuality
    ).then((url) => {
      console.log("初始化", url, this.toneQuality);

      if (url) {
        this.changeUrl(url);
      }
    });
  };
}

export class Controller extends BasicPlayer {
  public singlePlay = () => {
    this.currentTime = 0;
    this.upDadeTime.time = 0;
    this.upDadeTime.timeStr = "00:00";
    this.setRenderCurrentTime?.({ ...this.upDadeTime });
    this.playMusic();
  };
  public loopList = () => {
    this.playNext();
  };
  public playRandomly = () => {
    const getSongsId = this.prevornext
      .split(",")
      .map((ele: any) => Number(ele));
    const max = getSongsId?.length - 1;
    const random = Math.round(Math.random() * max);

    store.dispatch(
      songsInfo({
        ...this.songsState,
        songId: getSongsId[random],
        song: random,
      })
    );

    this.getSongUrl(getSongsId[random] + "", "jyeffect").then((url) => {
      if (url) {
        this.changeUrl(url);
        this.playMusic();
      }
    });
  };

  // 喜欢歌曲
  public likeSong = () => {
    // this.audio?.play();
  };
  // 开启心动模式💓
  public openHeartbeat = () => {
    // this.audio?.play();
  };
  // 改变音质
  public chaneToneQuality = () => {
    // this.audio?.play();
  };
}
