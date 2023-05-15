import { StarFilled } from "@ant-design/icons";
import { Col, Row, Statistic } from "antd";

const SegmentDetail = ({ segment }) => (
  <div style={{ margin: "16px" }}>
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
        <Statistic title="Distance" value={segment.distance} suffix="km" />
      </Col>
    </Row>
    <Row gutter={8}>
      <Col span={12}>
        <Statistic
          title="Star Count"
          value={segment.star_count}
          prefix={<StarFilled />}
        />
      </Col>
      <Col span={12}>
        <Statistic title="Total Efforts" value={segment.effort_count} />
      </Col>
    </Row>
  </div>
);
export default SegmentDetail;
