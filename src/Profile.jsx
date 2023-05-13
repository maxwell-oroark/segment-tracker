import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { signIn, signOut } from "./pocketbase";
import { useAuthDispatch } from "./AuthContext";

import "./Profile.css";

const Profile = ({ user }) => {
  const dispatch = useAuthDispatch();
  if (user.data) {
    return (
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Avatar
              style={{ background: "gray" }}
              shape="square"
              size={64}
              src={user.data?.profilePicture}
            >
              <UserOutlined style={{ fontSize: 64, background: "gray" }} />
            </Avatar>
          </div>
          <div className="flip-card-back">
            <Button
              type="primary"
              style={{ width: 64, height: 64 }}
              onClick={() => signOut(dispatch)}
            >
              <div style={{ whiteSpace: "normal", textTransform: "uppercase" }}>
                log off
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Button
        type="primary"
        style={{ width: 64, height: 64 }}
        onClick={() => signIn(dispatch)}
      >
        <div style={{ whiteSpace: "normal", textTransform: "uppercase" }}>
          log in
        </div>
      </Button>
    );
  }
};

export default Profile;
