import { Spin } from "antd";

export default function Loading() {
  return (
    <div
      style={{
        height: 450,
        width: "100%",
        backgroundColor: "rgb(0 0 0 / .3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Lazy loading map" size="large">
        <div
          style={{
            padding: "100px",
            borderRadius: "4px",
          }}
        />
      </Spin>
    </div>
  );
}
