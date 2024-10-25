import { ArrowUpOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
  Login,
} from "pages";
import { debounce, stringAdds } from "utils/utils";
import { useNewSongs, useSongDetail } from "body/PlayFooter/utils";
import { PLAYCONSTANTS } from "body/PlayFooter/contants";
import { useEffect, useRef, useState } from "react";
import { useMountRef, useQuery } from "@karlfranz/reacthooks";
import { getBack } from "./pic";
import { https } from "utils";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useSongs } from "body/PlayFooter/useSongs";
import { songsState } from "store/songs";
import Vibrant from "node-vibrant";
import { useBackGroundColor } from "./utils";

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

const BACK = getBack();

const Entries = () => {
  const { data: { result = [] } = {} } = useNewSongs();
  const getIds = result.map((ele: any) => ele.id);
  const mountStatus = useMountRef();

  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);
  const { songId } = songsState;
  const {
    data: {
      songs: [
        {
          al: { name, picUrl },
          ar: [{ name: authName }],
          dt,
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(songId);

  useBackGroundColor(picUrl, "backgroundDiv");

  console.log("picUrl", picUrl);

  const [isLoadPic, setIsLoadPic] = useState(false);
  console.log("isLoadPic", isLoadPic);
  // window.onload = function () {
  //   console.log("onloadonload");
  //   setIsLoadPic(true);
  // };
  // const backRef = useRef<any>(null);

  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
    loginState;
  // const client = useHttp();
  const client = https();
  // const { run } = useRequest(
  //   () =>
  //     client("user/playlist", {
  //       data: {
  //         uid: userId,
  //         // cookie: localStorage.getItem("cookie"),
  //         timestamp: new Date().getTime(),
  //       },
  //     }),
  //   {
  //     // refreshOnWindowFocus: true,
  //   },
  //   {
  //     success(res) {
  //       console.log("查看用户歌单", res);
  //     },
  //   }
  // );

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
    <div
      style={{
        backgroundColor: "#fff",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: 100,
        display: mountStatus.current && BACK ? "none" : "block",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading>
          <div className="loading"></div>
        </Loading>
      </div>
    </div>
  );

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
          icon={
            <TopIcon>
              <ArrowUpOutlined />
            </TopIcon>
          }
          target={() => document.getElementById("section") as HTMLElement}
        />
      </Section>
    </Main>
  );
  const renderView = () => (
    <View onClick={debounce(xuanlan, 2000)}>
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

  // useMount(() => {
  //   setIsLoadPic(true);
  // });
  // useEffect(() => {
  //   const backgroundDiv = document.getElementById("backgroundDiv");
  //   if (picUrl) {
  //     if (backgroundDiv) {
  //       backgroundDiv.style.backgroundImage = `url(${stringAdds(picUrl)})`;
  //       setIsLoadPic(true);
  //     }
  //   }
  // }, [picUrl]);

  window.onload = function () {
    console.log("aaaaaaaaaaaaaaa");
  };
  return (
    <Container>
      <div
        id="backgroundDiv"
        style={{
          // zIndex: "-2",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          background: "rgb(0, 0, 0.3)",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          filter: "blur(12px)",
          opacity: "0.7",
          backgroundPosition: "50%",
          transition: "all 0.8s",
          scale: "(1,1)",
        }}
      />
      {renderLoading()}
      {renderView()}
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
  background-color: rgba(0, 0, 0, 0.7);
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

const TopIcon = styled.span`
  path {
    color: rgb(240, 124, 130);
  }
`;

const Loading = styled.div`
  @keyframes loading {
    50% {
      transform: rotatez(180deg);
      border-width: 30px;
    }
    100% {
      transform: rotatez(360deg);
    }
  }
  .loading::before {
    content: "";
    color: white;
    height: 30px;
    width: 30px;
    background: transparent;
    border-radius: 50%;
    border: 15px ridge lime;
    border-color: rgb(240, 124, 130) transparent;
    animation: loading 1s infinite;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 20px;
  }
`;
