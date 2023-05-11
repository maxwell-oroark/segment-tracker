import { useAuth } from "./AuthContext";

export default function Card() {
  const auth = useAuth();
  return <div className="card">{JSON.stringify(auth)}</div>;
}
