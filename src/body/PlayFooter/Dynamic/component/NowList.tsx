import { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";
import { Drawer } from "antd";

import { useSongDetail } from "body/PlayFooter/utils";
import SongsItem from "components/SongsItem";
import { songsState } from "store/songs";
import { CardList } from "components";
import { RootState } from "store";
import { NowListType } from "..";

export const NowList = forwardRef<NowListType, any>((props, ref) => {
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { prevornext } = songsState;
  const { data: { songs = [] } = {} } = useSongDetail(prevornext);

  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    changeOpen,
  }));

  const changeOpen = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      placement="right"
      onClose={changeOpen}
      getContainer={document.querySelector("#main") as Element}
      open={open}
      closeIcon={null}
      headerStyle={{ display: "none" }}
      maskStyle={{
        background: "transparent",
      }}
      width={500}
      rootStyle={{
        height: "calc(100% - 0.5rem)",
        top: 0,
        position: "absolute",
        background: "transparent",
        boxShadow: "none",
        overflowY: "auto",
      }}
      bodyStyle={{
        boxShadow: "none !important",
        padding: 0,
      }}
    >
      <Container>
        <span>播放列表</span>
        <p>共{songs.length || 0}首</p>
      </Container>
      <CardList dataSource={songs || []}>
        <SongsItem />
      </CardList>
    </Drawer>
  );
});

const Container = styled.div`
  margin: 1rem;
  > span {
    font-weight: 700;
    font-size: 1.8rem;
  }
  > p {
    margin: 1rem 0;
  }
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.4);
`;
