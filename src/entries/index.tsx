import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { FloatButton } from "antd";
import confetti from "canvas-confetti";
import {
  RecommendSongSheet,
  Ranking,
  SongList,
  Recent,
  Search,
  Ilike,
  SongSheet,
  RecommendSongs,
  Other,
} from "pages";
import { RootState } from "../store";
import { debounce, stringAdds } from "utils/utils";
import { useNewSongs, useSongDetail } from "body/PlayFooter/utils";
// import { PLAYCONSTANTS } from "body/PlayFooter/contants";
// import { ReactQueryDevtools } from "react-query-devtools";
import { PictState } from "store/picturl";
import { useEffect } from "react";
import { songsInfo, songsState } from "store/songs";
import { PLAYCONSTANTS } from "body/PlayFooter/contants";

localStorage.setItem("zhixue", "false");
const count = 390;
const defaults = {
  origin: { y: 0.7 },
};

function fire(particleRatio: any, opts: any) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

const Entries = () => {
  // const dispatch = useDispatch();
  // const PictState = useSelector<RootState, Pick<PictState, "picturl">>(
  //   (state) => state.picturl
  // );

  // const { picturl: picUrl } = PictState;

  // const songsState = useSelector<
  //   RootState,
  //   Pick<songsState, "songId" | "song" | "prevornext">
  // >((state) => state.songs);
  const { data: { result = [] } = {} } = useNewSongs();
  const getIds = result.map((ele: any) => ele.id);

  // useEffect(() => {
  //   console.log("picUrl", picUrl);

  const {
    data: {
      songs: [
        {
          al: { picUrl },
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(getIds[5]);

  //   !picUrl &&
  //     dispatch(
  //       songsInfo({
  //         ...songsState,
  //         songId: getIds[0],
  //         song: 0,
  //         prevornext: String(getIds),
  //       })
  //     );
  // }, []);

  const xuanlan = () => {
    if (localStorage.getItem("zhixue") === "false") return;
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <Container onClick={debounce(xuanlan, 300)}>
      <ContainerBackGround color={stringAdds(picUrl)} />
      <ContainerMask />
      <Router>
        <CenterContent>
          <Header>
            <BodyHeader />
          </Header>
          <Main id={"main"}>
            <Aside>
              <BodyAside />
            </Aside>
            <Section id={"section"}>
              <Routes>
                <Route
                  path="recommendsongsheet"
                  element={<RecommendSongSheet />}
                />
                <Route path="recommendsongs" element={<RecommendSongs />} />
                <Route path="ranking" element={<Ranking />} />
                <Route path="songList/:id" element={<SongList />} />
                <Route path="recent" element={<Recent />} />
                <Route path="search/:searchparam" element={<Search />} />
                <Route path="ilike" element={<Ilike />} />
                <Route path="songsheet" element={<SongSheet />} />
                <Route path="other" element={<Other />} />
                <Route
                  path="/"
                  element={<Navigate to={"recommendsongsheet"} replace />}
                />
              </Routes>
              <FloatButton.BackTop
                visibilityHeight={20}
                style={{
                  bottom: "12.5rem",
                }}
                target={() => document.getElementById("section") as HTMLElement}
              />
            </Section>
          </Main>
          <PlayFooter />
        </CenterContent>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </Container>
  );
};

export default Entries;

const Container = styled.div`
  height: 100%;
  overflow-y: hidden;
  position: relative;
`;

const ContainerBackGround = styled.div`
  background-image: url(${(props) => props.color});
  z-index: -2;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  -webkit-filter: blur(12px);
  filter: blur(12px);
  opacity: 0.7;
  -webkit-transition: all 0.8s;
  transition: all 0.8s;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
`;
const ContainerMask = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
`;

const Header = styled.header`
  height: 5.5rem;
  box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.2);
  top: 0;
  width: 100%;
  z-index: 99;
  margin-bottom: 2px;
`;

const Aside = styled.aside`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-menu {
    background-color: transparent;
  }
`;

const Main = styled.main`
  display: flex;
  height: calc(100% - 10.9rem);
  position: relative;

  .ant-drawer {
    :focus {
      outline: none !important;
    }
  }
`;

const Section = styled.section`
  width: calc(100% - 20%);
  height: 100%;
  overflow-y: auto;
`;

const CenterContent = styled.div`
  height: 100%;
  position: relative;
`;
