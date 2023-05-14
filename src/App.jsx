import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Layout } from "antd";
import Map, { Marker } from "react-map-gl";

import Profile from "./Profile";
import Segments from "./Segments";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const user = useAuth();
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [activeSegment, setActiveSegment] = useState(null);

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Sider theme="light" width={500}>
        <div
          style={{
            margin: 16,
            display: "flex",
          }}
        >
          <Profile user={user} />
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              fontSize: 20,
              justifyContent: "center",
              fontFamily: "prompt, sans-serif",
            }}
          ></div>
        </div>
        <Segments
          setHoveredSegment={setHoveredSegment}
          setActiveSegment={setActiveSegment}
          user={user}
        />
      </Layout.Sider>

      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "50%" }}>
          <Map
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken="pk.eyJ1IjoibWF4d2VsbG8iLCJhIjoiY2xobWR0cXc3MWFsODNxbzNmZW1ycjl5YyJ9.wi7NOlHfj0CuevTx9FvEyg"
          >
            {hoveredSegment && (
              <Marker
                latitude={hoveredSegment.start_latlng[0]}
                longitude={hoveredSegment.start_latlng[1]}
                anchor="bottom"
              ></Marker>
            )}
          </Map>
        </div>
        <div style={{ height: "50%" }}>
          {activeSegment && (
            <>
              <div>{activeSegment.name}</div>
              <div>{activeSegment.distance}</div>
            </>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default App;
