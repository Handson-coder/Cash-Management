import axios from "axios";
import {
  FETCH_EVENTS,
  FETCH_CASH,
  FETCH_SUB_EVENTS,
  DELETE_EVENT,
  FETCH_SUB_EVENT,
  DELETE_SUB_EVENT,
  DELETE_CHILD_EVENT,
  DELETE_FATHER_EVENT,
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
} from "../keys";

// const baseUrl = "http://localhost:3000";
const baseUrl = "https://cash-management-bpom.herokuapp.com";

export const setIsLoggedIn = (payload) => {
  return {
    type: SET_IS_LOGGED_IN,
    payload,
  };
};

export const setUserLogin = (payload) => {
  return {
    type: SET_USER_LOGIN,
    payload,
  };
};

export const setFatherKode = (payload) => {
  return {
    type: SET_FATHER_KODE,
    payload,
  };
};

export const setChildKode = (payload) => {
  return {
    type: SET_CHILD_KODE,
    payload,
  };
};

export const setEventKode = (payload) => {
  return {
    type: SET_EVENT_KODE,
    payload,
  };
};

export const setCurrentBalance = (payload) => {
  return {
    type: SET_CURRENT_BALANCE,
    payload,
  };
};

export const fetchEvents = (payload) => {
  return {
    type: FETCH_EVENTS,
    payload,
  };
};

export const fetchFatherEvents = (payload) => {
  return {
    type: FETCH_FATHER_EVENTS,
    payload,
  };
};

export const fetchChildEvents = (payload) => {
  return {
    type: FETCH_CHILD_EVENTS,
    payload,
  };
};

export const fetchCash = (payload) => {
  return {
    type: FETCH_CASH,
    payload,
  };
};

export const fetchSubEvents = (payload) => {
  return {
    type: FETCH_SUB_EVENTS,
    payload,
  };
};

export const fetchEventForEditEventPage = (payload) => {
  return {
    type: FETCH_EVENT_FOR_EDIT_EVENT_PAGE,
    payload,
  };
};

export const fetchEventForTableSubEvent = (payload) => {
  return {
    type: FETCH_EVENT_FOR_TABLE_SUB_EVENT,
    payload,
  };
};

export const fetchSubEvent = (payload) => {
  return {
    type: FETCH_SUB_EVENT,
    payload,
  };
};

export const fetchHistories = (payload) => {
  return {
    type: FETCH_HISTORIES,
    payload,
  };
};

export const deleteSubEvent = (payload) => {
  return {
    type: DELETE_SUB_EVENT,
    payload,
  };
};

export const deleteChildEvent = (payload) => {
  return {
    type: DELETE_CHILD_EVENT,
    payload,
  };
};

export const deleteFatherEvent = (payload) => {
  return {
    type: DELETE_FATHER_EVENT,
    payload,
  };
};

export const deleteEvent = (payload) => {
  return {
    type: DELETE_EVENT,
    payload,
  };
};

export const setFatherEvent = (payload) => {
  return {
    type: SET_FATHER_EVENT,
    payload,
  };
};

export const setChildEvent = (payload) => {
  return {
    type: SET_CHILD_EVENT,
    payload,
  };
};

export const setEvent = (payload) => {
  return {
    type: SET_EVENT,
    payload,
  };
};

export const fetchingSubEvent = (id) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/sub-events/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchSubEvent(data));
        if (
          data &&
          data.Event &&
          data.Event.ChildEvent &&
          data.Event.ChildEvent.FatherEvent
        ) {
          dispatch(setEventKode(data.Event.kode));
          dispatch(setChildKode(data.Event.ChildEvent.kode));
          dispatch(setFatherKode(data.Event.ChildEvent.FatherEvent.kode));
        }
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingHistories = () => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/histories`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchHistories(data));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingFatherEvents = () => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/father-events`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchFatherEvents(data));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingFatherEvent = (id) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/father-events/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(setFatherEvent(data));
        dispatch(fetchChildEvents(data.ChildEvents));
      })
      .catch((err) => console.log(err));
  };
};

export const findOneChildEvent = (ChildEventId) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/child-events/${ChildEventId}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(setChildEvent(data));
        dispatch(fetchEvents(data.Events));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingSubEvents = (id) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/sub-events/from-event/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchSubEvents(data));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingCash = () => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/cash`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchCash(data.cash));
        dispatch(setCurrentBalance(data.currentBalance));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingEvents = () => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/events`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchEvents(data));
      })
      .catch((err) => console.log(err));
  };
};

export const fetchingEvent = (eventId) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/events/${eventId}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(setEvent(data.eventForTableSubEvent));
        dispatch(fetchEventForTableSubEvent(data.eventForTableSubEvent));
        dispatch(fetchEventForEditEventPage(data.eventForEditEventPage));
        dispatch(fetchSubEvents(data.eventForTableSubEvent.SubEvents));
      })
      .catch((err) => console.log(err));
  };
};

export const login = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/users/login`, data);
  };
};

export const creatingEvent = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/events/add-event`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const creatingFatherEvent = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/father-events/create`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const createNewChildEvent = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/child-events/create`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const deletingEvent = (id) => {
  return (dispatch) => {
    return axios.delete(`${baseUrl}/events/${id}`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const editingCash = (cash) => {
  return (dispatch) => {
    return axios.patch(
      `${baseUrl}/cash/edit-balance`,
      {
        cash,
      },
      {
        headers: {
          access_token: localStorage.access_token,
        },
      }
    );
  };
};

export const addingCash = (nominalToAdd) => {
  return (dispatch) => {
    return axios.patch(
      `${baseUrl}/cash/add-balance`,
      {
        nominalToAdd,
      },
      {
        headers: {
          access_token: localStorage.access_token,
        },
      }
    );
  };
};

export const updatingEvent = (data, id) => {
  return (dispatch) => {
    return axios.put(`${baseUrl}/events/edit-event/${id}`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const processSubEvent = (jumlahBiaya, id) => {
  return (dispatch) => {
    return axios.put(
      `${baseUrl}/sub-events/${id}`,
      { jumlahBiaya },
      {
        headers: {
          access_token: localStorage.access_token,
        },
      }
    );
  };
};

export const deletingChildEvent = (childEventId) => {
  return (dispatch) => {
    return axios.delete(`${baseUrl}/child-events/${childEventId}`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const deletingFatherEvent = (fatherEventId) => {
  return (dispatch) => {
    return axios.delete(`${baseUrl}/father-events/${fatherEventId}`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const deletingSubEvent = (id) => {
  return (dispatch) => {
    return axios.delete(`${baseUrl}/sub-events/${id}`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const editingSubEvent = (data, id) => {
  return (dispatch) => {
    return axios.put(`${baseUrl}/sub-events/edit/${id}`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const addingSubEvent = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/sub-events/add`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const logout = (riwayat) => {
  return (dispatch) => {
    return axios.post(
      `${baseUrl}/histories/logout`,
      { riwayat },
      {
        headers: {
          access_token: localStorage.access_token,
        },
      }
    );
  };
};

export const uploadingEvents = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/events/upload`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const editingProfile = (data) => {
  return (dispatch) => {
    return axios.put(`${baseUrl}/profiles/edit`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const downloadingFile = (data) => {
  return (dispatch) => {
    return axios.get(`${baseUrl}/events/download`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const registeringUser = (data) => {
  return (dispatch) => {
    return axios.post(`${baseUrl}/profiles/register`, data, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};

export const checkUserList = () => {
  return (dispatch) => {
    return axios.get(`${baseUrl}/profiles/lists`, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};
