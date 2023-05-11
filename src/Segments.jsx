import { useEffect, useState } from "react";
import { Table } from "antd";
import { pb } from "./pocketbase";

export default function Segments({ user }) {
  const [segments, setSegments] = useState([]);
  useEffect(() => {
    if (user) {
      console.log(`fetching segments for ${user.id}`);
      pb.collection("segments")
        .getFullList({ sort: "-created" })
        .then((results) => {
          console.log("results");
          console.log(results);
          setSegments(results);
        });
    }
  }, [user?.id]);

  return (
    <Table
      bordered
      rowKey="id"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "City", dataIndex: "city" },
      ]}
      dataSource={segments}
    ></Table>
  );
}
