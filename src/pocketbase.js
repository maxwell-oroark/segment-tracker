import PocketBase from "pocketbase";
import Strava from "./models/Strava";
import Segment from "./models/Segment";

export const pb = new PocketBase("https://segment-tracker.dev");

export const reviveSession = (dispatch) => {
  try {
    if (pb.authStore.isValid) {
      pb.collection("users")
        .authRefresh()
        .then(({ record }) => {
          dispatch({ type: "ADD_SESSION", payload: record });
        });
    } else {
      pb.authStore.clear(); // after this call pb.authStore.isValid will be false
    }
  } catch (e) {
    pb.authStore.clear(); // after this call pb.authStore.isValid will be false
  }
};

export async function signIn(dispatch) {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "strava" });
  // save strava tokens
  const sc = new Strava();
  sc.saveTokens(authData.meta.accessToken, authData.meta.refreshToken);
  // keep user in pb updated with new oauth metadata from strava
  const stravaDetails = {
    name: authData.meta.name,
    profilePicture: authData.meta.rawUser.profile,
    location: authData.meta.rawUser.city,
    ftp: authData.meta.rawUser.ftp,
  };
  await pb.collection("users").update(authData.record.id, stravaDetails);
  dispatch({
    type: "ADD_SESSION",
    payload: { ...authData.record, ...stravaDetails },
  });
}

export function signOut() {
  pb.authStore.clear();
}

export async function syncSegments(newSegments, userId) {
  console.log(`found ${newSegments.length} new segment(s)`);
  if (newSegments.length > 0) {
    const promises = newSegments.map((segment) => {
      const model = new Segment(segment, userId);
      console.log("serialized segment: ");
      console.log(model.serialize());
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

export async function fetchSegments() {
  return pb.collection("segments").getFullList({ sort: "-created" });
}
