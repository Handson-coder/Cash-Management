import axios from "axios";
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

const baseUrl = "http://localhost:3000";

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

export const fetchEvents = (payload) => {
  return {
    type: FETCH_EVENTS,
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

export const fetchEvent = (payload) => {
  return {
    type: FETCH_EVENT,
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

export const deleteEvent = (payload) => {
  return {
    type: DELETE_EVENT,
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

export const fetchingEvent = (id) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/events/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(({ data }) => {
        dispatch(fetchEvent(data));
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

export const processSubEvent = (volume, id) => {
  return (dispatch) => {
    return axios.put(
      `${baseUrl}/sub-events/${id}`,
      { volume },
      {
        headers: {
          access_token: localStorage.access_token,
        },
      }
    );
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
    return axios.post(`${baseUrl}/histories/logout`, {riwayat}, {
      headers: {
        access_token: localStorage.access_token,
      },
    });
  };
};
