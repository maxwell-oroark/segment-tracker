import PocketBase from "pocketbase";
import User from "./User";
import Strava from "./Strava";

export const pb = new PocketBase("https://segment-tracker.dev");
export const reviveSession = (dispatch) => {
  const destroy = pb.authStore.onChange(async (_token, record) => {
    if (record) {
      console.log("reviving session...");
      dispatch({ status: "pending", data: null });
      const sc = new Strava();
      const athlete = await sc.fetchAthlete();
      const user = new User({
        athlete,
        record,
      });
      dispatch({ status: "success", data: user.serialize() });
    }
  }, true);
  return destroy;
};

export async function signIn() {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "strava" });
  // save strava tokens before attempting to syncronize user
  const sc = new Strava(authData.meta.accessToken, authData.meta.refreshToken);
  sc.saveTokens(authData.meta.accessToken, authData.meta.refreshToken);
  const user = new User({
    record: authData.record,
    athlete: authData.meta.rawUser,
  });
  console.time("segments/sync");
  const segments = await sc.fetchSegments();
  await user.syncSegments(segments);
  console.timeEnd("segments/sync");
  return;
}

export function signOut(dispatch) {
  dispatch({ status: "idle", data: null });
  pb.authStore.clear();
}

// TODO
// make app as least dependent on strava api as possible. grab everything you need up front.
// take out athlete from User model. keep it in store as separate key.
