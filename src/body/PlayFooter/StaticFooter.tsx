import { Slider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  GoEnd,
  GoStart,
  ListBottom,
  LoopOnce,
  Play,
  VolumeSmall,
} from "@icon-park/react";

import { Like } from "./Dynamic/component/like";
import { useNewSongs } from "./utils";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";

import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  Progress,
  DivRight,
} from "./style";

export const StaticFooter: React.FC = () => {
  const { data: { result = [] } = {} } = useNewSongs();
  const dispatch = useDispatch();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const getIds = result.map((ele: any) => ele.id);

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
      <DivRight>
        <DivTwo>
          <GoStart
            theme="outline"
            size="24"
            fill="rgb(59, 129, 140)"
            style={{ cursor: "pointer" }}
          />
          <Play
            theme="filled"
            size="24"
            fill="rgb(59, 129, 140)"
            style={{ cursor: "pointer" }}
          />
          <GoEnd
            theme="outline"
            size="24"
            fill="rgb(59, 129, 140)"
            style={{ cursor: "pointer" }}
          />
          <Like songId={""} />
        </DivTwo>
        <DivThree>
          {/* <Acoustic
              title="音效"
              theme="outline"
              size="24"
              fill="rgb(59, 129, 140)"
            /> */}
          {/* {getElement(type.type)} */}
          <LoopOnce
            title="顺序播放"
            theme="outline"
            size="24"
            fill="rgb(59, 129, 140)"
          />
          <ListBottom
            title="播放列表"
            theme="outline"
            size="24"
            fill="rgb(59, 129, 140)"
          />
          <VolumeWrap>
            <div>
              <Slider
                vertical
                value={0}
                style={{ height: "85% !important", bottom: "none" }}
              />
            </div>
            <VolumeSmall theme="outline" size="24" fill="rgb(59, 129, 140)" />
          </VolumeWrap>
        </DivThree>
      </DivRight>
      <audio controls style={{ display: "none" }} />
    </Container>
  );
};
