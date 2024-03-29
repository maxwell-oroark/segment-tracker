import { Table } from "antd";

export default function SegmentsTable({
  segments,
  activeSegment,
  setActiveSegment,
}) {
  return (
    <Table
      size="small"
      locale={{
        emptyText: "No segments synced",
      }}
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
        { title: "Segment", dataIndex: "name", ellipsis: true },
        { title: "City", dataIndex: "city" },
      ]}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => {
            if (record.id === activeSegment?.id) {
              setActiveSegment(null);
            } else {
              setActiveSegment(record);
            }
          },
        };
      }}
      dataSource={segments}
    ></Table>
  );
}
