import { useEffect, useState } from "react";
import { Table } from "antd";
import { StarFilled } from "@ant-design/icons";
import { pb } from "./pocketbase";

export default function Segments({ user }) {
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
      bordered
      title={() => (
        <div
          style={{
            display: "flex",
            color: "white",
            justifyContent: "center",
            alignItems: "center",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          <StarFilled /> segments
        </div>
      )}
      pagination={{ position: ["bottomCenter"] }}
      rowKey="id"
      columns={[
        { title: "Name", dataIndex: "name", ellipsis: true },
        { title: "City", dataIndex: "city" },
      ]}
      dataSource={segments}
    ></Table>
  );
}
