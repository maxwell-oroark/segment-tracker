import { StarFilled } from "@ant-design/icons";
import { Col, Row, Statistic } from "antd";

const SegmentDetail = ({ segment }) => (
  <div style={{ display: "flex" }}>
    <div style={{ margin: 20, flexGrow: 1 }}>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic title="Name" value={segment.name} />
        </Col>
        <Col span={12}>
          <Statistic title="Attempts" value={segment.attempts} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic title="PR" value={segment.pr} />
        </Col>
        <Col span={12}>
          <Statistic
            title="PR Recorded"
            value={new Date(segment.pr_date).toLocaleDateString()}
          />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic title="City" value={segment.city} />
        </Col>
        <Col span={12}>
          <Statistic title="Distance" value={segment.distance} suffix="m" />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic
            title="Star Count"
            value={segment.star_count}
            suffix={<StarFilled />}
          />
        </Col>
        <Col span={12}>
          <Statistic title="Total Efforts" value={segment.effort_count} />
        </Col>
      </Row>
    </div>
    <div
      style={{
        alignSelf: "stretch",
        margin: "15px 0px",
        width: "1px",
        background: "#d3d3d3",
      }}
    />
    <div
      style={{
        margin: 20,
        alignSelf: "stretch",
        flexGrow: 1,
      }}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Statistic
            title="Wind Speed"
            value={Math.floor(Math.random() * 10)}
            suffix={"m/s"}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Wind Direction"
            value={Math.floor(Math.random() * 360)}
            suffix={"°"}
          />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic
            title="Bearing"
            value={segment.bearing.toFixed(2)}
            suffix={"°"}
          />
        </Col>
        <Col span={12}>
          <Statistic title="H3 Hex" value={segment.hex} />
        </Col>
      </Row>
    </div>
  </div>
);
export default SegmentDetail;
