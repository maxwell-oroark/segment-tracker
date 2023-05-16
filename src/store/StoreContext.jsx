import { createContext, useReducer, useContext, useEffect } from "react";
import { reviveSession } from "../pocketbase";

export const StoreContext = createContext(null);
export const StoreDispatchContext = createContext(null);

const initialState = {
  session: {
    status: "idle",
    data: null,
  },
  sync: {
    status: "idle",
    data: null,
  },
  segments: {
    status: "idle",
    data: null,
  },
  active: {
    data: null,
  },
};
export function StoreContextProvider({ children }) {
  const [store, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_SESSION": {
        return {
          ...state,
          session: {
            status: "fulfilled",
            data: action.payload,
          },
        };
      }
      case "REMOVE_SESSION": {
        return initialState;
      }
      case "ADD_SEGMENTS": {
        return {
          ...state,
          segments: {
            status: "fulfilled",
            data: action.payload,
          },
        };
      }
      case "UPDATE_SYNC_SEGMENTS": {
        return {
          ...state,
          sync: {
            status: action.payload.status,
            data: action.payload,
          },
        };
      }
      case "UPDATE_ACTIVE_SEGMENT": {
        return {
          ...state,
          active: {
            data: action.payload,
          },
        };
      }

      default: {
        return state;
      }
    }
  }, initialState);

  useEffect(() => {
    const destroy = reviveSession(dispatch);
    return () => destroy();
  }, []);
  return (
    <StoreContext.Provider value={store}>
      <StoreDispatchContext.Provider value={dispatch}>
        {children}
      </StoreDispatchContext.Provider>
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export function useStoreDispatch() {
  return useContext(StoreDispatchContext);
}
