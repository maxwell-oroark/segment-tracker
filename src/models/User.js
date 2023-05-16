import { pb } from "../pocketbase";
import Segment from "./Segment";

//TODO no need for a User model or class...
// strip this down in to individual pocketbase utility functions

class User {
  constructor(record) {
    this.userId = record.id;
    this.profilePicture = record.profilePicture;
  }

  async syncUser(data) {
    pb.collection("users").update(this.userId, data);
  }

  async fetchSegments() {
    return pb.collection("segments").getFullList({ sort: "-created" });
  }

  async syncSegments(userSegments, stravaSegments) {
    const userSegmentIds = userSegments.map((segment) =>
      // TODO change data type of segment_id to number NOT string
      Number(segment.segment_id)
    );
    const newSegments = stravaSegments.filter(
      (stravaSegment) => !userSegmentIds.includes(stravaSegment.id)
    );
    console.log(`found ${newSegments.length} new segment(s)`);
    console.log(newSegments);
    if (newSegments.length > 0) {
      const promises = newSegments.map((segment) => {
        const model = new Segment(segment, this.userId);
        return pb
          .collection("segments")
          .create(model.serialize(), { $autoCancel: false });
      });
      await Promise.all(promises);
      console.log("segments synced");
    } else {
      console.log("no new segments found");
    }
  }

  serialize() {
    return {
      id: this.userId,
      profilePicture: this.profilePicture,
    };
  }
}

const syncSegments = async (uniqueSegments, userId) => {
  console.log(`found ${uniqueSegments.length} new segment(s)`);

  if (uniqueSegments.length > 0) {
    const promises = uniqueSegments.map((segment) => {
      const model = new Segment(segment, userId);
      return pb
        .collection("segments")
        .create(model.serialize(), { $autoCancel: false });
    });
    await Promise.all(promises);
    console.log("segments synced");
  } else {
    console.log("no new segments found");
  }
};

const fetchSegments = async () => {
  return pb.collection("segments").getFullList({ sort: "-created" });
};

export { syncSegments, fetchSegments };

export default User;
