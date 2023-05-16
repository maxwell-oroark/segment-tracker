import { useState, useRef } from "react";
import { useStore, useStoreDispatch } from "./store/StoreContext";
import { Layout, Button } from "antd";
import { StarFilled, SyncOutlined } from "@ant-design/icons";

import Map, { Source, Layer } from "react-map-gl";

import Strava from "./models/Strava";
import { syncSegments, fetchSegments } from "./models/User";

import Profile from "./Profile";
import SegmentsTable from "./SegmentsTable";
import SegmentDetail from "./SegmentDetail";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const map = useRef();
  const dispatch = useStoreDispatch();
  const { session, segments, sync, active } = useStore();

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
              <Profile user={session} />
            </div>
            <SegmentsTable
              segments={segments.data}
              activeSegment={active.data}
              setActiveSegment={(segment) => {
                map.current.fitBounds(segment.bbox, {
                  padding: 150,
                  duration: 0,
                });
                dispatch({ type: "UPDATE_ACTIVE_SEGMENT", payload: segment });
              }}
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
              <Button
                onClick={async () => {
                  try {
                    dispatch({
                      type: "UPDATE_SYNC_SEGMENTS",
                      payload: { status: "pending" },
                    });
                    console.log("syncing segments");
                    const sc = new Strava();
                    console.time("segments/sync");
                    const userSegmentIds = await fetchSegments().then((res) =>
                      // TODO segment_id should be number in db
                      res.map((s) => Number(s.segment_id))
                    );
                    const stravaSegmentIds = await sc.fetchSegmentIds();
                    const newStravaSegmentIds = stravaSegmentIds.filter(
                      (o) => userSegmentIds.indexOf(o) === -1
                    );
                    // update db when user unstars segments?
                    // const deletedStravaSegments = userSegmentIds.filter(
                    //   (o) => stravaSegmentIds.indexOf(o) === -1
                    // );
                    const newSegments = await Promise.all(
                      newStravaSegmentIds.map((id) =>
                        sc.fetchSegmentDetails(id)
                      )
                    );
                    await syncSegments(newSegments, session.data.id);

                    console.timeEnd("segments/sync");
                    dispatch({
                      type: "UPDATE_SYNC_SEGMENTS",
                      payload: { status: "fulfilled", updatedAt: Date.now() },
                    });
                  } catch (err) {
                    dispatch({
                      type: "UPDATE_SYNC_SEGMENTS",
                      payload: { status: "failed" },
                    });
                  }
                }}
                type="primary"
                shape="circle"
                icon={<SyncOutlined />}
              />
            </div>
            <div style={{ width: "33%", textAlign: "center" }}>
              {(() => {
                if (sync.status === "pending") {
                  return "syncing segments...";
                } else if (sync.status === "failed") {
                  return "syncing segments failed";
                } else if (sync.status === "fulfilled") {
                  return `updated ${sync.data.updatedAt}`;
                }
              })()}
            </div>
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
            {active.data && (
              <Source
                key={active.data.id}
                type="geojson"
                data={active.data.geojson}
              >
                <Layer
                  type="line"
                  id={active.data.id}
                  paint={{ "line-color": "#91caff", "line-width": 5 }}
                />
              </Source>
            )}
          </Map>
        </div>
        <div>{active.data && <SegmentDetail segment={active.data} />}</div>
      </Layout.Content>
    </Layout>
  );
}

export default App;
