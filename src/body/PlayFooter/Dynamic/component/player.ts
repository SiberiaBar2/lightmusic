// eslint-disable-next-line prefer-const
let count = 1;

export function initAudio(ele: HTMLAudioElement) {
  console.log("dadasdsa", ele);

  ele.onerror = function (e) {
    console.log("播放失败", e);
  };
}
