import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { signIn, signOut } from "./pocketbase";

const Profile = ({ user }) => {
  if (user) {
    return (
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Avatar
              style={{ background: "gray" }}
              shape="square"
              size={64}
              src={user?.profilePicture}
            >
              <UserOutlined style={{ fontSize: 64, background: "gray" }} />
            </Avatar>
          </div>
          <div className="flip-card-back">
            <Button
              type="primary"
              style={{ width: 64, height: 64 }}
              onClick={signOut}
            >
              <div style={{ whiteSpace: "normal" }}>Sign Out</div>
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Button type="primary" style={{ width: 64, height: 64 }} onClick={signIn}>
        <div style={{ whiteSpace: "normal" }}>Sign In</div>
      </Button>
    );
  }
};

export default Profile;
