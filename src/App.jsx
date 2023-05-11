import { pb } from "./pocketbase";
import { useAuth, useAuthDispatch } from "./AuthContext";
import { Avatar, Button, Layout } from "antd";
import User from "./User";
import Strava from "./Strava";
import Segments from "./Segments";

import "./App.css";

const { Content, Sider } = Layout;

function App() {
  const dispatch = useAuthDispatch();
  const user = useAuth();

  async function signIn() {
    const authData = await pb
      .collection("users")
      .authWithOAuth2({ provider: "strava" });
    console.log("AUTH DATA:");
    console.log(authData);
    // save strava tokens before attempting to syncronize user
    const sc = new Strava(
      authData.meta.accessToken,
      authData.meta.refreshToken
    );
    sc.saveTokens(authData.meta.accessToken, authData.meta.refreshToken);
    const user = new User({
      record: authData.record,
      athlete: authData.meta.rawUser,
    });
    await user.sync();
    dispatch(user.serialize());
  }

  async function signOut() {
    dispatch(null);
    await pb.authStore.clear();
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Avatar shape="square" size={64} src={user?.profilePicture} />
          {user ? (
            <Button type="primary" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <Button type="primary" onClick={signIn}>
              Sign In
            </Button>
          )}
        </div>
      </Sider>
      <Content>
        <Segments user={user} />
      </Content>
    </Layout>
  );
}

export default App;
