import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { FloatButton } from "antd";
import ReactLoading from "react-loading";
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
  Login,
} from "pages";
import { debounce, stringAdds } from "utils/utils";
import { useNewSongs, useSongDetail } from "body/PlayFooter/utils";
import { PLAYCONSTANTS } from "body/PlayFooter/contants";
import { useEffect, useRef, useState } from "react";

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
  const { data: { result = [] } = {} } = useNewSongs();
  const getIds = result.map((ele: any) => ele.id);
  const [loading, setLoaing] = useState(false);

  const backRef = useRef<any>(null);
  const {
    data: {
      songs: [
        {
          al: { picUrl },
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(getIds[5]);

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

  const renderLoading = () => (
    <ReactLoading
      type="bars"
      color="rgb(240, 124, 130)"
      height={"7%"}
      width={"7%"}
    />
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoaing(true), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [setLoaing, setTimeout, clearTimeout]);

  const MainView = () => (
    <Main id={"main"}>
      <Aside>
        <BodyAside />
      </Aside>
      <Section id={"section"}>
        <Routes>
          <Route path="recommendsongsheet" element={<RecommendSongSheet />} />
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
  );
  const renderView = () => (
    <View onClick={debounce(xuanlan, 300)}>
      <ContainerMask />
      <Router>
        <CenterContent>
          <Header>
            <BodyHeader />
          </Header>
          <Routes>
            {/* 允许匹配多级路由 */}
            <Route path="main/*" element={<MainView />} />
            <Route path="login/:islogin" element={<Login />} />
            <Route path="/" element={<Navigate to={"main"} replace />} />
          </Routes>
          <PlayFooter />
        </CenterContent>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </View>
  );

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Container>
      <div
        ref={backRef}
        style={{
          backgroundImage: `url(${stringAdds(picUrl)})`,
          zIndex: "-2",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          filter: "blur(12px)",
          opacity: "0.7",
          backgroundPosition: "50%",
        }}
      />
      {console.log(
        "backRef.current?.style?.backgroundImage",
        backRef.current?.style.backgroundImage,
        "地址",
        backRef.current?.style.backgroundImage
      )}
      {loading ? renderView() : renderLoading()}
      {/* {loading && backRef.current?.style.backgroundImage?.includes("https")
        ? renderView()
        : renderLoading()} */}
    </Container>
  );
};

export default Entries;

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
  position: relative;
`;

const View = styled.div`
  width: 100%;
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
  width: 14%;
  height: 100%;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  position: relative;
  .ant-menu {
    background-color: transparent;
  }
`;

const Main = styled.main`
  width: 100%;
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
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const CenterContent = styled.div`
  height: 100%;
  position: relative;
`;
