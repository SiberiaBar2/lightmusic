import { GoEnd, GoStart, Play, VolumeSmall } from "@icon-park/react";
import { Slider, message } from "antd";
import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  Progress,
} from "./style";

export const StaticFooter = () => {
  const tips = () => {
    message.error("请先选择音乐！", 2);
  };
  return (
    <Container onClick={tips}>
      <Progress>
        <Slider
          value={0}
          tooltip={{ open: false }}
          step={1}
          style={{ height: "85%", bottom: "none" }}
        />
      </Progress>
      <DivOne>
        <div>
          <p>music</p>
        </div>
        <div>
          <span>00:00 / 00:00</span>
        </div>
      </DivOne>
      <DivTwo>
        <GoStart
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        <Play
          theme="filled"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        <GoEnd
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        {/* <Like songId={songId} /> */}
      </DivTwo>
      <DivThree>
        {/* <Acoustic
              title="音效"
              theme="outline"
              size="24"
              fill="rgb(237, 195, 194)"
            /> */}
        {/* {getElement(type.type)} */}
        {/* <ListBottom
              title="播放列表"
              theme="outline"
              size="24"
              fill="rgb(237, 195, 194)"
            /> */}
        <VolumeWrap>
          <div>
            <Slider
              vertical
              value={0}
              style={{ height: "85%", bottom: "none" }}
            />
          </div>
          <VolumeSmall theme="outline" size="24" fill="rgb(237, 195, 194)" />
        </VolumeWrap>
      </DivThree>
      <audio controls style={{ display: "none" }} />
    </Container>
  );
};
