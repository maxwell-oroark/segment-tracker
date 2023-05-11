import { pb } from "./pocketbase";
import Strava from "./Strava";

class User {
  constructor({ record, athlete }) {
    this.userId = record.id;
    this.firstName = athlete.firstname;
    this.lastName = athlete.lastname;
    this.location = athlete.city;
    this.profilePicture = athlete.profile;
    this.ftp = athlete.ftp;
  }

  async sync() {
    try {
      this.syncUser({
        name: `${this.firstName} ${this.lastName}`,
        location: this.location,
        profilePicture: this.profilePicture,
        ftp: this.ftp,
      });
      this.syncSegments();
    } catch (error) {
      console.log(
        "something went wrong while attempting to update user record"
      );
      console.log(error);
    }
  }

  async syncUser(data) {
    pb.collection("users").update(this.userId, data);
  }

  async syncSegments() {
    try {
      console.log("copying segments from strava to db...");
      const sc = new Strava();
      const segments = await sc.fetchSegments();
      const promises = segments.map((segment) => {
        return pb.collection("segments").create(
          {
            segment_id: segment.id,
            name: segment.name,
            city: segment.city,
            start_latlng: segment.start_latlng,
            end_latlng: segment.end_latlng,
            distance: segment.distance,
            user_id: this.userId,
          },
          { $autoCancel: false }
        );
      });
      await Promise.all(promises);
      console.log("segments synced");
    } catch (err) {
      console.warn("something went wrong while attempting to sync segments");
      console.error(err);
    }
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
