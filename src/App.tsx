import Entries from "entries";
import { ConfigProvider } from "antd";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persist } from "store";

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
        },
        components: {
          Slider: {
            trackHoverBg: "rgba(0, 0, 0, 0.6)",
            trackBg: "rgba(0, 0, 0, 0.6)",
            railBg: "rgba(0, 0, 0, 0.4)",
            railHoverBg: "rgba(0, 0, 0, 0.4)",
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
