import _ from "lodash";

import { createVibrantGradient, getMostFrequentColor } from "entries/utils";
import { changePlay } from "store/play";
import { songsInfo } from "store/songs";
import { https } from "utils";
import store from "store";

export type TimeType = { time: number; timeStr: string };
type SongConfig = {
  prevornext: string;
  song: string | number;
  songId: number;
  platList: any[];
};
const cookie = localStorage.getItem("cookie");

const TIME = {
  time: 0,
  timeStr: "00:00",
};

export type SongDetailConfig = Record<
  "picUrl" | "name" | "authName",
  // "picUrl" | "name" | "authName" | "backGroundColor",
  string
> & {
  dt: number;
};
export class BasicPlayer {
  public retry = 0;
  public toneQuality = "";
  public noCopyRight = false;
  public songsState: any = {};
  public songPlayDetail: any = {};
  public getSongsId: number[] = [];
  public timer: NodeJS.Timer | null = null;
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
  public setRenderSongConfig: ((c: SongDetailConfig) => void) | null = null;
  public setSongConfig = (h: React.SetStateAction<any>) => {
    if (!this.setRenderSongConfig) this.setRenderSongConfig = h;
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
      // this.audio.load();
    }
  };

  public clearAudio() {
    try {
      if (this.audio) {
        this.audio?.pause();
        // this.audio.currentTime = 0;
        this.audio.src = "";
        this.audio.load(); // 强制初始化 会重置播放时间

        // 如果在 DOM 中，则移除
        if (this.audio.parentNode) {
          this.audio.remove();
        }
        this.audio = null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getSongUrl = async () => {
    await this.getSongState();
    await this.getSongPlayDetail(
      this.getSongsId[this.songsState.song as number] + ""
    );
  };
  public ensureHttps(url: string): string {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  }
  public checkAudioResource = async (url: string) => {
    try {
      if (url) {
        const response = await fetch(this.ensureHttps(url), { method: "HEAD" }); // 使用 HEAD 请求检查
        // console.log("response 检查资源是否有效", response.ok, response);
      } else {
        throw new Error("无地址");
      }
    } catch (error) {
      await this.getSongUrl();
    }
  };
  public playMusic = async (noCheck?: boolean) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (!noCheck) {
      await this.checkAudioResource(this.songPlayDetail?.url);
    }
    try {
      this.clearAudio();
      if (!this.songPlayDetail?.url) {
        throw new Error("播放地址不存在或无权限");
      }
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
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.getSongUrl();
    }, 900000);
    try {
      if (this.audio && !this.audio.paused) {
        this.audio?.pause();
        store.dispatch(changePlay({ play: "pause" }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  public changeBackGroundColor = (picUrl: string) => {
    return getMostFrequentColor(picUrl).then((color) => {
      const backElement = document.getElementById("backgroundDiv");
      const backGroundColor = createVibrantGradient(color);
      if (backElement) {
        backElement.style.background = backGroundColor;
      }
      return backGroundColor;
    });
  };

  public getSongDetailConfig = async (id: string) => {
    if (id) {
      this.getSongState();
      const nowSongDetail = this.songsState?.platList?.find(
        (ele: any) => ele.id == id
      );
      const dt = _.get(nowSongDetail, "dt");
      const name = _.get(nowSongDetail, "name");
      const picUrl = _.get(nowSongDetail, "al.picUrl");
      const authName = _.get(nowSongDetail, "ar[0].name");
      // const backGroundColor = await this.changeBackGroundColor(picUrl);
      const songDetailConfig = {
        // backGroundColor,
        authName,
        picUrl,
        name,
        dt,
      };
      this.setRenderSongConfig?.(songDetailConfig);
    }
  };
  public getSongPlayDetail = async (id: string) => {
    const client = https();
    const songPlayUrlResult = await client("song/url/v1", {
      data: { id, cookie, level: this.toneQuality },
    });
    this.getSongDetailConfig(id);
    this.songPlayDetail = songPlayUrlResult?.data?.[0];
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
  private changeSong = async (index: number) => {
    store.dispatch(
      songsInfo({
        songId: this.getSongsId[index],
        song: index,
      })
    );
    this.reset();
    await this.getSongUrl();
    this.playMusic();
  };
  public playPrev = async () => {
    await this.clearAudio();
    await this.getSongState();
    const prev = this.getCurrentIndex(Number(this.songsState?.song) - 1);
    this.songsState = {
      ...this.songsState,
      song: prev,
    };
    this.changeSong(prev);
  };
  public playNext = async () => {
    await this.clearAudio();
    await this.getSongState();
    const next = this.getCurrentIndex(Number(this.songsState?.song) + 1);
    this.songsState = {
      ...this.songsState,
      song: next,
    };
    this.changeSong(next);
  };
  public changeToneQuality = async (toneQuality: string) => {
    this.getSongState();
    this.toneQuality = toneQuality;
    this.currentTime = this.audio?.currentTime;
    const index = +this.songsState.song;
    store.dispatch(
      songsInfo({
        songId: this.getSongsId[index],
        song: index,
      })
    );
    await this.getSongUrl();
    this.playMusic(true);
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
  public ontimeUpdate = () => {
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

  public saveSongConfig = async (config: SongConfig) => {
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
        platList: config.platList,
      })
    );
    await this.getSongUrl();
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
  public playOrder = () => {
    this.reset();
    this.getSongState();
    if (
      this.getSongsId[this.songsState.song as number] ===
      this.getSongsId[this.getSongsId?.length - 1]
    ) {
      this.pauseMusic();
    } else {
      this.playNext();
    }
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
        songId: this.getSongsId[random],
        song: random,
      })
    );

    this.getSongPlayDetail(this.getSongsId[random] + "");
    this.reset();
    this.playMusic();
  };

  // 喜欢歌曲
  public likeSong = (param: {
    id: number;
    cookie: string;
    like?: boolean;
    timerstamp: number;
  }) => {
    const client = https();
    return client("like", {
      method: "GET",
      data: param,
    });
  };
  // 开启心动模式💓
  public openHeartbeat = () => {
    // this.audio?.play();
  };
}
