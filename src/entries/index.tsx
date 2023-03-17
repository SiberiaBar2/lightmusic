import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
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
import { Provider, useSelector } from "react-redux";
import { Affix } from "antd";
import store, { persist, RootState } from "../store";
import { ReactQueryDevtools } from "react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoginState } from "store/login";
import _ from "lodash";

const Entries = () => {
  const [scroll, setScroll] = useState(false);
  const handelScroll = useCallback(() => {
    console.log("滚动了");
    setScroll(true);
  }, []);

  const getScrollBarColor = useMemo(() => {
    return scroll ? (
      <Global
        styles={css`
          ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 0.5rem transparent;
            border-radius: 2rem;
            background: transparent;
          }
          ::-webkit-scrollbar {
            width: 0.7rem;
            height: 0.5rem;
          }
          ::-webkit-scrollbar-thumb {
            border-radius: 2rem;
            -webkit-box-shadow: inset 0 0 0.5rem transparent;
            background: rgb(196, 90, 101);
          }
        `}
      />
    ) : (
      <Global
        styles={css`
          ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 0.5rem transparent;
            border-radius: 2rem;
            background: transparent;
          }
          ::-webkit-scrollbar {
            width: 0.7rem;
            height: 0.5rem;
          }
          ::-webkit-scrollbar-thumb {
            border-radius: 2rem;
            -webkit-box-shadow: inset 0 0 0.5rem transparent;
            background: transparent;
          }
        `}
      />
    );
  }, [scroll]);

  // 为什么写为true就能触发？
  document.addEventListener("scroll", handelScroll, true);

  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
        {/* {getScrollBarColor} */}
        <Container>
          <QueryPrivider client={new QueryClient()}>
            <Router>
              <Header>
                <BodyHeader />
              </Header>
              <Main>
                <Aside>
                  <BodyAside />
                </Aside>
                <Section>
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
                </Section>
              </Main>
              <AntAffix
                style={{ position: "fixed", bottom: "3rem", zIndex: 1 }}
              >
                <PlayFooter />
              </AntAffix>
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
  /* position: relative; */
  overflow-y: hidden;
  /* &:hover {
    overflow-y: auto;
  } */
`;

const Header = styled.header`
  height: 4.75rem;
  background: rgb(241, 147, 155);
  /* position: fixed; */
  top: 0;
  width: 100%;
  z-index: 99;
`;

const Aside = styled.aside`
  /* width: 22rem; */
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgb(240, 161, 168); */
`;

const Main = styled.main`
  display: flex;
  height: 100%;
  margin-top: 4.75rem;
`;

const Section = styled.section`
  flex: 1;
  /* width: calc(100% - 22rem); */
  /* overflow-y: hidden; */
  /* &:hover { */
  overflow-y: auto;
  /* } */
`;

const AntAffix = styled(Affix)`
  width: 100%;
  height: 2rem;
`;
