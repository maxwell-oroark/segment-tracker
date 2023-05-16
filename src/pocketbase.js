import PocketBase from "pocketbase";
import Strava from "./models/Strava";

export const pb = new PocketBase("https://segment-tracker.dev");

export const reviveSession = (dispatch) => {
  const destroy = pb.authStore.onChange(async (_token, record) => {
    if (record) {
      console.log("...adding session...");
      dispatch({ type: "ADD_SESSION", payload: record });
      const segments = await pb
        .collection("segments")
        .getFullList({ sort: "-created" });

      dispatch({
        type: "ADD_SEGMENTS",
        payload: segments,
      });
    }
  }, true);
  return destroy;
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
  dispatch({ type: "ADD_SESSION", payload: { ...record, ...stravaDetails } });
}

export function signOut() {
  pb.authStore.clear();
}
