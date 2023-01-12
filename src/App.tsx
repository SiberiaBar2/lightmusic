import Entries from "entries";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(239, 71, 93)",
        },
      }}
    >
      <div className="App">
        <Entries />
      </div>
    </ConfigProvider>
  );
}

export default App;
