import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import { Provider } from "react-redux";
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
import store, { persist } from "../store";
import { debounce } from "utils/utils";
// import { ReactQueryDevtools } from "react-query-devtools";

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
  // 为什么写为true就能触发？
  // document.addEventListener("scroll", handelScroll, true);
  const queryClients = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

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
    <Provider store={store}>
      <PersistGate persistor={persist}>
        {/* {getScrollBarColor} */}
        <Container onClick={debounce(xuanlan, 300)}>
          <QueryPrivider client={queryClients}>
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
                      <Route
                        path="recommendsongs"
                        element={<RecommendSongs />}
                      />
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
                      style={{ bottom: "12.5rem" }}
                      target={() =>
                        document.getElementById("section") as HTMLElement
                      }
                    />
                  </Section>
                </Main>
                <PlayFooter />
              </CenterContent>
            </Router>
          </QueryPrivider>
          {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        </Container>
      </PersistGate>
    </Provider>
  );
};

export default Entries;

const Container = styled.div`
  height: 100%;
  overflow-y: hidden;
`;

const Header = styled.header`
  height: 5.5rem;
  /* background: rgb(241, 147, 1 55); */
  box-shadow: 0 0.1rem 0.1rem #ccc;
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
`;

const Main = styled.main`
  display: flex;
  height: calc(100% - 10.9rem);
  background: rgb(250, 250, 252);
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
