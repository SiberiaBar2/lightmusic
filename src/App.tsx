import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import store, { persist } from "store";
import Entries from "entries";

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
          colorPrimary: "rgb(48, 22, 28)",
          colorText: "rgb(200, 148, 5)",
        },
        components: {
          Slider: {
            trackHoverBg: "rgb(251, 236, 222)",
            trackBg: "rgb(251, 236, 222)",
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
