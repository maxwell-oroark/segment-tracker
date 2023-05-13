import { useAuth } from "./AuthContext";
import { Layout } from "antd";
import Map from "react-map-gl";

import Profile from "./Profile";
import Segments from "./Segments";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const user = useAuth();
  return (
    <Layout
      style={{ minHeight: "100vh", maxHeight: "100vh", overflow: "hidden" }}
    >
      <Layout.Sider theme="light" width={500}>
        <div
          style={{
            margin: 16,
            display: "flex",
          }}
        >
          <Profile user={user} />
        </div>
        <Segments user={user} />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <Map
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: 500 }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken="pk.eyJ1IjoibWF4d2VsbG8iLCJhIjoiY2xobWR0cXc3MWFsODNxbzNmZW1ycjl5YyJ9.wi7NOlHfj0CuevTx9FvEyg"
          />
        </Layout.Content>
        <Layout.Footer>Footer content</Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default App;
