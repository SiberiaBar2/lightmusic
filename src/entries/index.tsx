import styled from "@emotion/styled";
import { Aside as BodyAside, PlayFooter } from "body";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import { Recommend, Ranking, RadioStation, SongList, Recent } from "pages";
import { Provider } from "react-redux";
import { Affix } from "antd";
import store from "../store";
// import { ReactQueryDevtools } from "react-query-devtools";

const Entries = () => {
  return (
    <Provider store={store}>
      <Container>
        <QueryPrivider client={new QueryClient()}>
          <Router>
            <Header>Header</Header>
            <Main>
              <Aside>
                <BodyAside />
              </Aside>
              <Section>
                <Routes>
                  <Route path="recommend" element={<Recommend />} />
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="radioStation" element={<RadioStation />} />
                  <Route path="songList/:id" element={<SongList />} />
                  <Route path="recent" element={<Recent />} />
                  <Route path="/" element={<Recommend />} />
                </Routes>
              </Section>
            </Main>
            <AntAffix style={{ position: "fixed", bottom: "2rem", zIndex: 1 }}>
              <PlayFooter />
            </AntAffix>
          </Router>
        </QueryPrivider>
        {/* <ReactQueryDevtools /> */}
      </Container>
    </Provider>
  );
};

export default Entries;

const Container = styled.div`
  height: 100%;
`;

const Header = styled.header`
  height: 3.75rem;
  background: honeydew;
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
  height: 100%;
`;

const Section = styled.section`
  flex: 1;
  overflow-y: auto;
`;

const AntAffix = styled(Affix)`
  width: 100%;
  height: 2rem;
`;
