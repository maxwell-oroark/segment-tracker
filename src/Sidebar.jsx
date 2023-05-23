import { useStore, useStoreDispatch } from "./store/StoreContext";
import { Layout, Button, Spin } from "antd";
import { SyncOutlined, WarningOutlined } from "@ant-design/icons";
import Strava from "./models/Strava";
import { syncSegments, fetchSegments } from "./pocketbase";

import Profile from "./Profile";
import SegmentsTable from "./SegmentsTable";

export default function Sidebar() {
  const dispatch = useStoreDispatch();
  const { session, segments, sync, active, map } = useStore();
  return (
    <Layout.Sider theme="light" width={400}>
      <Layout>
        <Layout.Content style={{ backgroundColor: "#D8D8D8" }}>
          <div
            style={{
              margin: 16,
              display: "flex",
              justifyContent: "flex-end",
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
            right: 0,
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
                    newStravaSegmentIds.map((id) => sc.fetchSegmentDetails(id))
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
  );
}

export const SidebarFallback = () => (
  <div
    style={{
      width: 400,
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spin tip="Lazy loading sidebar" size="large">
      <div
        style={{
          padding: "100px",
          borderRadius: "4px",
        }}
      />
    </Spin>
  </div>
);
