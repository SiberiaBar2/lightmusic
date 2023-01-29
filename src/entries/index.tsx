import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter, Header as BodyHeader } from "body";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import {
  Recommend,
  Ranking,
  SongList,
  Recent,
  Search,
  Ilike,
  SongSheet,
} from "pages";
import { Provider } from "react-redux";
import { Affix } from "antd";
import store, { persist } from "../store";
import { ReactQueryDevtools } from "react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";

const Entries = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
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
                    <Route path="recommend" element={<Recommend />} />
                    <Route path="ranking" element={<Ranking />} />
                    <Route path="songList/:id" element={<SongList />} />
                    <Route path="recent" element={<Recent />} />
                    <Route path="search/:searchparam" element={<Search />} />
                    <Route path="ilike" element={<Ilike />} />
                    <Route path="songsheet" element={<SongSheet />} />
                    <Route
                      path="/"
                      element={<Navigate to={"recommend"} replace />}
                    />
                  </Routes>
                </Section>
              </Main>
              <AntAffix
                style={{ position: "fixed", bottom: "2rem", zIndex: 1 }}
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
`;

const Header = styled.header`
  height: 3.75rem;
  background: rgb(241, 147, 155);
`;

const Aside = styled.aside`
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
`;

const Section = styled.section`
  flex: 1;
  overflow-y: auto;
  /* background: rgb(240, 161, 168); */
`;

const AntAffix = styled(Affix)`
  width: 100%;
  height: 2rem;
`;
