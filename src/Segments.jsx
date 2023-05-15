import { useEffect, useState } from "react";
import { Table } from "antd";
import { StarFilled } from "@ant-design/icons";
import { pb } from "./pocketbase";

export default function Segments({
  user,
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
            your <StarFilled style={{ padding: "0px 5px" }} />{" "}
            <span>segments</span>
          </div>
          <div>
            last updated:{" "}
            {segments.length &&
              new Date(segments[0].created).toLocaleDateString()}
          </div>
        </div>
      )}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 15,
        showSizeChanger: false,
      }}
      rowKey="id"
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-dark"
      }
      columns={[
        { title: "Name", dataIndex: "name", ellipsis: true },
        { title: "City", dataIndex: "city" },
      ]}
      onRow={(record, rowIndex) => {
        return {
          onMouseEnter: () => setHoveredSegment(record), // mouse enter row
          onClick: () => setActiveSegment(record),
        };
      }}
      dataSource={segments}
    ></Table>
  );
}
