import { pb } from "./pocketbase";
import Segment from "./Segment";

class User {
  constructor({ record, athlete }) {
    this.userId = record.id;
    this.firstName = athlete.firstname;
    this.lastName = athlete.lastname;
    this.location = athlete.city;
    this.profilePicture = athlete.profile;
    this.ftp = athlete.ftp;
  }

  async syncUser(data) {
    pb.collection("users").update(this.userId, data);
  }

  async syncSegments(segments) {
    console.log(`copying ${segments.length} segments to db`);
    const promises = segments.map((segment) => {
      const model = new Segment(segment, this.userId);
      return pb
        .collection("segments")
        .create(model.serialize(), { $autoCancel: false });
    });
    await Promise.all(promises);
    console.log("segments synced");
  }

  serialize() {
    return {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePicture: this.profilePicture,
      accessToken: this.accessToken,
      ftp: this.ftp,
    };
  }
}

export default User;
