import { createContext, useReducer, useContext, useEffect } from "react";
import { reviveSession } from "./pocketbase";

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [auth, dispatch] = useReducer((state, action) => action, null);
  useEffect(() => {
    const destroy = reviveSession(dispatch);
    return () => destroy();
  }, []);
  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}
