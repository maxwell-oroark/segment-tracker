import { useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { Layout, Button } from "antd";
import { StarFilled, SyncOutlined } from "@ant-design/icons";

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
        <Layout>
          <Layout.Content style={{ backgroundColor: "#D8D8D8" }}>
            <div
              style={{
                margin: 16,
                display: "flex",
              }}
            >
              <Profile user={user} />
            </div>
            <Segments
              setActiveSegment={(segment) => {
                map.current.fitBounds(segment.bbox, {
                  padding: 150,
                  duration: 0,
                });
                setActiveSegment(segment);
              }}
              activeSegment={activeSegment}
              user={user}
            />
          </Layout.Content>
          <Layout.Footer
            style={{
              position: "fixed",
              left: 0,
              bottom: 0,
              display: "flex",
              width: 500,
              backgroundColor: "#D8D8D8",
              color: "white",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "uppercase",
              padding: "20px 16px",
              fontSize: "12px",
            }}
          >
            <div style={{ width: "33%", textAlign: "center" }}>
              <StarFilled /> <span>segments</span>
            </div>
            <div
              style={{
                width: "33%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button type="primary" shape="circle" icon={<SyncOutlined />} />
            </div>
            <div style={{ width: "33%", textAlign: "center" }}>updated</div>
          </Layout.Footer>
        </Layout>
      </Layout.Sider>
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "450px" }}>
          <Map
            ref={map}
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: "450px" }}
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
