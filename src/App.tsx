import Entries from "entries";
import { ConfigProvider } from "antd";
import { QueryClientProvider as QueryPrivider, QueryClient } from "react-query";

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
          colorPrimary: "rgb(251, 236, 222)",
        },
      }}
    >
      <div className="App">
        <QueryPrivider client={queryClients}>
          <Entries />
        </QueryPrivider>
      </div>
    </ConfigProvider>
  );
}

export default App;
