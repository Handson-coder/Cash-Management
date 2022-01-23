import {
  FETCH_EVENTS,
  FETCH_CASH,
  FETCH_SUB_EVENTS,
  DELETE_EVENT,
  FETCH_SUB_EVENT,
  DELETE_SUB_EVENT,
  SET_IS_LOGGED_IN,
  SET_USER_LOGIN,
  FETCH_HISTORIES,
  FETCH_CHILD_EVENTS,
  SET_FATHER_KODE,
  SET_CHILD_KODE,
  SET_EVENT_KODE,
  FETCH_EVENT_FOR_EDIT_EVENT_PAGE,
  FETCH_EVENT_FOR_TABLE_SUB_EVENT,
  FETCH_FATHER_EVENTS
} from "../keys";

const initialState = {
  events: [],
  fatherEvents: [],
  childEvents: [],
  cash: 0,
  subEvents: [],
  eventForTableSubEvent: {},
  eventForEditEventPage: {},
  subEvent: {},
  isLoggedIn: false,
  userLogin: {},
  histories: [],
  eventLength: 0,
  fatherKode: "",
  childKode: "",
  eventKode: "",
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EVENTS:
      return { ...state, events: payload, eventLength: payload.length };
    case FETCH_CASH:
      return { ...state, cash: payload };
    case FETCH_FATHER_EVENTS:
      return { ...state, fatherEvents: payload };
    case FETCH_CHILD_EVENTS:
      return { ...state, childEvents: payload };
    case FETCH_SUB_EVENTS:
      return { ...state, subEvents: payload };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((L) => L.id !== payload),
      };
    case FETCH_EVENT_FOR_TABLE_SUB_EVENT:
      return { ...state, eventForTableSubEvent: payload };
    case FETCH_EVENT_FOR_EDIT_EVENT_PAGE:
      return { ...state, eventForEditEventPage: payload };
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
    case SET_FATHER_KODE:
      return { ...state, fatherKode: payload };
    case SET_CHILD_KODE:
      return { ...state, childKode: payload };
    case SET_EVENT_KODE:
      return { ...state, eventKode: payload };
    default:
      return state;
  }
}

export default reducer;
