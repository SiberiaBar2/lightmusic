import {
  GoEnd,
  GoStart,
  // Like,
  LoopOnce,
  Play,
  VolumeSmall,
} from "@icon-park/react";
import { useDispatch, useSelector } from "react-redux";
import { Slider, message } from "antd";

import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  Progress,
} from "./style";
import { Like } from "./like";
import { useNewSongs } from "./utils";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";
import { changePlay } from "store/play";

export const StaticFooter = () => {
  const { data: { result = [] } = {} } = useNewSongs();
  const dispatch = useDispatch();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  // console.log("新歌曲", result);

  const getIds = result.map((ele: any) => ele.id);
  // console.log("getIds", getIds);

  const init = () => {
    // message.success("开始播放最新音乐");
    dispatch(
      songsInfo({
        ...songsState,
        songId: getIds[0],
        song: 0,
        prevornext: String(getIds),
      })
    );
    // dispatch(changePlay({ play: true }));
  };

  return (
    <Container onClick={init}>
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
        <Like songId={""} />
      </DivTwo>
      <DivThree>
        {/* <Acoustic
              title="音效"
              theme="outline"
              size="24"
              fill="rgb(237, 195, 194)"
            /> */}
        {/* {getElement(type.type)} */}
        <LoopOnce
          title="顺序播放"
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
        />
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
