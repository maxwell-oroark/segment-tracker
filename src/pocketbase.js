import PocketBase from "pocketbase";
import User from "./User";
import Strava from "./Strava";

export const pb = new PocketBase("https://segment-tracker.dev");
export const reviveSession = (dispatch) => {
  const destroy = pb.authStore.onChange(async (_token, record) => {
    const sc = new Strava();
    const athlete = await sc.fetchAthlete();
    const user = new User({
      athlete,
      record,
    });
    dispatch(user.serialize());
  }, true);
  return destroy;
};
