import Entries from "entries";
import { ConfigProvider } from "antd";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { RootState, persist } from "store";
import { https, useHttp } from "utils";
// import { useRequest } from "hooks/useRequest";
import { useQuery } from "@karlfranz/reacthooks";
import { LoginState } from "store/login";

// 为什么写为true就能触发？
// document.addEventListener("scroll", handelScroll, true);
const queryClients = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(48, 22, 28)", // rgb(59, 129, 140)
          // colorPrimary: "rgb(59, 129, 140)", // rgb(59, 129, 140)
          // colorPrimary: "#fff",
          colorText: "rgb(249, 241, 219)",
        },
        components: {
          Slider: {
            trackHoverBg: "rgba(0, 0, 0, 0.6)",
            trackBg: "rgba(0, 0, 0, 0.6)",
            railBg: "rgba(0, 0, 0, 0.4)",
            railHoverBg: "rgba(0, 0, 0, 0.4)",
          },
          Message: {
            contentBg: "rgba(0, 0, 0, 0.6)",
            colorSuccess: "red",
          },
        },
      }}
    >
      <div className="App">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persist}>
            <QueryPrivider client={queryClients}>
              <Entries />
            </QueryPrivider>
          </PersistGate>
        </Provider>
      </div>
    </ConfigProvider>
  );
}

export default App;
