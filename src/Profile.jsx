import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { signIn, signOut } from "./pocketbase";
import { useStoreDispatch } from "./store/StoreContext";

import "./Profile.css";

const Profile = ({ session }) => {
  const dispatch = useStoreDispatch();
  if (session.data) {
    return (
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Avatar
              style={{ background: "gray" }}
              shape="square"
              size={64}
              src={session.data?.profilePicture}
            >
              <UserOutlined style={{ fontSize: 64, background: "gray" }} />
            </Avatar>
          </div>
          <div className="flip-card-back">
            <Button
              danger
              type="primary"
              style={{ width: 64, height: 64 }}
              onClick={() => {
                dispatch({ type: "REMOVE_SESSION" });
                signOut();
              }}
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
