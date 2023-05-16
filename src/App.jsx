import { useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { Layout } from "antd";
import Map, { Marker, Source, Layer } from "react-map-gl";
import Profile from "./Profile";
import Segments from "./Segments";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import SegmentDetail from "./SegmentDetail";

function App() {
  const map = useRef();
  const user = useAuth();
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
          setActiveSegment={(segment) => {
            map.current.fitBounds(segment.bbox, { padding: 150, duration: 0 });
            setActiveSegment(segment);
          }}
          activeSegment={activeSegment}
          user={user}
        />
      </Layout.Sider>

      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "500px" }}>
          <Map
            ref={map}
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken="pk.eyJ1IjoibWF4d2VsbG8iLCJhIjoiY2xobWR0cXc3MWFsODNxbzNmZW1ycjl5YyJ9.wi7NOlHfj0CuevTx9FvEyg"
          >
            {activeSegment && (
              <Source
                key={activeSegment.id}
                type="geojson"
                data={activeSegment.geojson}
              >
                <Layer
                  type="line"
                  id={activeSegment.id}
                  paint={{ "line-color": "#91caff", "line-width": 5 }}
                />
              </Source>
            )}
          </Map>
        </div>
        <div>{activeSegment && <SegmentDetail segment={activeSegment} />}</div>
      </Layout.Content>
    </Layout>
  );
}

export default App;
