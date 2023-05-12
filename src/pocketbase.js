import PocketBase from "pocketbase";
import User from "./User";
import Strava from "./Strava";

export const pb = new PocketBase("https://segment-tracker.dev");
export const reviveSession = (dispatch) => {
  const destroy = pb.authStore.onChange(async (_token, record) => {
    if (record) {
      const sc = new Strava();
      const athlete = await sc.fetchAthlete();
      const user = new User({
        athlete,
        record,
      });
      dispatch(user.serialize());
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
  await user.sync();
  dispatch(user.serialize());
}

export async function signOut() {
  dispatch(null);
  await pb.authStore.clear();
}
