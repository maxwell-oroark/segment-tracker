import { useStore } from "./store/StoreContext";
import { Layout } from "antd";

import Loading from "./Loading";
import { SidebarFallback } from "./Sidebar";
import SegmentDetail from "./SegmentDetail";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import LazyLoad from "./LazyLoad";

function App() {
  const { active } = useStore();
  return (
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "row" }}>
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <LazyLoad load={() => import("./Map")} fallback={Loading} />
        <SegmentDetail segment={active.data} />
      </Layout.Content>
      <LazyLoad load={() => import("./Sidebar")} fallback={SidebarFallback} />
    </Layout>
  );
}

export default App;
