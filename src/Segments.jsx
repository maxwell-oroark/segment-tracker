import { useEffect, useState } from "react";
import { Table } from "antd";
import { StarFilled, CloudSyncOutlined } from "@ant-design/icons";
import { pb } from "./pocketbase";

export default function Segments({
  user,
  activeSegment,
  setHoveredSegment,
  setActiveSegment,
}) {
  const [segments, setSegments] = useState([]);
  useEffect(() => {
    if (user.data) {
      console.log(`fetching segments for ${user.data.id}`);
      pb.collection("segments")
        .getFullList({ sort: "-created" })
        .then((results) => {
          console.log("results");
          console.log(results);
          setSegments(results);
        });
    }
  }, [user.data?.id]);

  return (
    <Table
      size="small"
      title={() => (
        <div
          style={{
            display: "flex",
            color: "white",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          <div>
            your <StarFilled style={{ margin: "0px 5px" }} />{" "}
            <span>segments</span>
          </div>
          <div>
            <CloudSyncOutlined style={{ marginRight: 5 }} />
            last updated:{" "}
            {segments.length &&
              new Date(segments[0].created).toLocaleDateString()}
          </div>
        </div>
      )}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 14,
        showSizeChanger: false,
      }}
      rowKey="id"
      rowClassName={(record, index) => {
        if (record.id === activeSegment?.id) {
          return "table-row-extra-dark";
        } else if (index % 2 === 0) {
          return "table-row-light";
        } else {
          return "table-row-dark";
        }
      }}
      columns={[
        { title: "Name", dataIndex: "name", ellipsis: true },
        { title: "City", dataIndex: "city" },
      ]}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => setActiveSegment(record),
        };
      }}
      dataSource={segments}
    ></Table>
  );
}
