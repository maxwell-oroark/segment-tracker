import { pb } from "./pocketbase";
import { useAuth, useAuthDispatch } from "./AuthContext";
import { Layout } from "antd";

import User from "./User";
import Strava from "./Strava";
import Segments from "./Segments";

import "./App.css";
import Profile from "./Profile";

const { Content, Sider } = Layout;

function App() {
  const dispatch = useAuthDispatch();
  const user = useAuth();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={400}>
        <div
          style={{
            margin: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Profile user={user} />
        </div>
      </Sider>
      <Content>
        <Segments user={user} />
      </Content>
    </Layout>
  );
}

export default App;
