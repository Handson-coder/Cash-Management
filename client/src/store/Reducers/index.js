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
  FETCH_FATHER_EVENTS,
  SET_CURRENT_BALANCE,
  SET_FATHER_EVENT,
  SET_CHILD_EVENT,
  SET_EVENT,
  DELETE_CHILD_EVENT,
  DELETE_FATHER_EVENT
} from "../keys";

const initialState = {
  cash: [],
  fatherEvents: [],
  childEvents: [],
  events: [],
  subEvents: [],
  histories: [],
  fatherEvent: {},
  childEvent: {},
  event: {},
  subEvent: {},
  userLogin: {},
  eventForTableSubEvent: {},
  eventForEditEventPage: {},
  isLoggedIn: false,
  currentBalance: 0,
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
    case DELETE_CHILD_EVENT:
      return {
        ...state,
        childEvents: state.childEvents.filter((L) => L.id !== payload),
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
    case DELETE_FATHER_EVENT:
      return {
        ...state,
        fatherEvents: state.fatherEvents.filter((L) => L.id !== payload),
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
    case SET_CURRENT_BALANCE: 
      return { ...state, currentBalance: payload}
    case SET_FATHER_EVENT:
      return { ...state, fatherEvent: payload };
    case SET_CHILD_EVENT:
      return { ...state, childEvent: payload };
    case SET_EVENT:
      return { ...state, event: payload };
    default:
      return state;
  }
}

export default reducer;
