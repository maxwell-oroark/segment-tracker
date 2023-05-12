import { useAuth } from "./AuthContext";
import { Layout } from "antd";

import Profile from "./Profile";
import Segments from "./Segments";

import "./App.css";

function App() {
  const user = useAuth();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider width={400}>
        <div
          style={{
            margin: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Profile user={user} />
        </div>
      </Layout.Sider>
      <Layout.Content>
        <Segments user={user} />
      </Layout.Content>
    </Layout>
  );
}

export default App;
