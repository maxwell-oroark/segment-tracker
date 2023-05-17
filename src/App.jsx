import { useRef, useMemo } from "react";
import { useStore, useStoreDispatch } from "./store/StoreContext";
import { Layout, Button } from "antd";
import { StarFilled, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { featureCollection } from "@turf/helpers";
import Segment from "./models/Segment";

import Map, { Source, Layer } from "react-map-gl";
import {
  lineLayer,
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./layers";

import Strava from "./models/Strava";
import { syncSegments, fetchSegments } from "./pocketbase";

import Profile from "./Profile";
import SegmentsTable from "./SegmentsTable";
import SegmentDetail from "./SegmentDetail";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const map = useRef();
  const dispatch = useStoreDispatch();
  const { session, segments, sync, active } = useStore();

  const segmentsGeojson = useMemo(() => {
    if (segments.data) {
      console.log("recalc geojson feature collection");
      return featureCollection(
        segments.data.map((s) => new Segment(s).getCentroid())
      );
    } else {
      return null;
    }
  }, [segments.data]);

  console.log(active.data);

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Sider theme="light" width={400}>
        <Layout>
          <Layout.Content style={{ backgroundColor: "#D8D8D8" }}>
            <div
              style={{
                margin: 16,
                display: "flex",
              }}
            >
              <Profile session={session} />
            </div>
            <SegmentsTable
              segments={segments.data}
              activeSegment={active.data}
              setActiveSegment={(segment) => {
                dispatch({ type: "UPDATE_ACTIVE_SEGMENT", payload: segment });
                if (segment && segment.bbox) {
                  map.current.fitBounds(segment.bbox, {
                    padding: 150,
                    duration: 0,
                  });
                }
              }}
            />
          </Layout.Content>
          <Layout.Footer
            style={{
              position: "fixed",
              left: 0,
              bottom: 0,
              display: "flex",
              width: 400,
              backgroundColor: "#D8D8D8",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              textTransform: "uppercase",
              padding: "20px 16px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
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
                    const userSegmentIds = await fetchSegments();
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
                    const refreshedSegments = await fetchSegments();
                    dispatch({
                      type: "ADD_SEGMENTS",
                      payload: refreshedSegments,
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
                disabled={!session.data || sync.status === "pending"}
                icon={<SyncOutlined spin={sync.status === "pending"} />}
              />
              <div>
                {(() => {
                  if (sync.status === "pending") {
                    return "syncing segments...";
                  } else if (sync.status === "failed") {
                    return <WarningOutlined />;
                  } else if (sync.status === "fulfilled") {
                    return `updated ${new Date(
                      sync.data.updatedAt
                    ).toLocaleDateString()}`;
                  } else {
                    return null;
                  }
                })()}
              </div>
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
            {active.data ? (
              <Source
                key={active.data.id}
                type="geojson"
                data={active.data.geojson}
              >
                <Layer id={active.data.id} {...lineLayer} />
              </Source>
            ) : (
              <Source
                id="segments"
                type="geojson"
                data={segmentsGeojson}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
              >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
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
