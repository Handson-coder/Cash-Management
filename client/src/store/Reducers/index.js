import {
  FETCH_EVENTS,
  FETCH_CASH,
  FETCH_SUB_EVENTS,
  DELETE_EVENT,
  FETCH_EVENT,
  FETCH_SUB_EVENT,
  DELETE_SUB_EVENT,
  SET_IS_LOGGED_IN,
  SET_USER_LOGIN,
  FETCH_HISTORIES,
} from "../keys";

const initialState = {
  events: [],
  cash: 0,
  subEvents: [],
  event: {},
  subEvent: {},
  isLoggedIn: false,
  userLogin: {},
  histories: [],
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EVENTS:
      return { ...state, events: payload };
    case FETCH_CASH:
      return { ...state, cash: payload };
    case FETCH_SUB_EVENTS:
      return { ...state, subEvents: payload };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((L) => L.id !== payload),
      };
    case FETCH_EVENT:
      return { ...state, event: payload };
    case FETCH_SUB_EVENT:
      return { ...state, subEvent: payload };
    case DELETE_SUB_EVENT:
      return {
        ...state,
        subEvents: state.subEvents.filter((L) => L.id !== payload),
      };
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: payload };
    case SET_USER_LOGIN:
      return { ...state, userLogin: payload };
    case FETCH_HISTORIES:
      return { ...state, histories: payload };
    default:
      return state;
  }
}

export default reducer;
