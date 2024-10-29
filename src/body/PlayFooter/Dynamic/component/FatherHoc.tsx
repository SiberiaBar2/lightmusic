import { useEffect } from "react";
import { Slider } from "antd";

import { Progress } from "body/PlayFooter/style";
import { player, PlayType } from "..";

interface FatherHocProps {
  children: React.ReactNode;
  type: PlayType;
  duration: number;
  currentTime: number;
}

export const FatherHoc: React.FC<FatherHocProps> = ({
  children,
  type,
  currentTime,
  duration,
}) => {
  const curT = parseInt(currentTime + "");
  useEffect(() => {
    if (duration && curT >= duration) {
      switch (type) {
        case PlayType.dan:
          player.singlePlay();
          break;
        case PlayType.shun:
          player.playOrder();
          break;
        case PlayType.liexun:
          player.loopList();
          break;
        case PlayType.sui:
          player.playRandomly();
          break;
        default:
          break;
      }
    }
  }, [type, curT, duration]);

  return (
    <>
      <Progress>
        <Slider
          min={0}
          step={1}
          max={duration}
          value={currentTime}
          tooltip={{ open: false }}
          style={{ height: "85%", bottom: "none" }}
          onChange={(cur) => player.setCurrentTime(cur)}
        />
      </Progress>
      {children}
    </>
  );
};
