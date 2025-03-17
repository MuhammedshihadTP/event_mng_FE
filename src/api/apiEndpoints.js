const BASE_URL = process.env.REACT_APP_SERVER_URL;

const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGN_UP: `${BASE_URL}/auth/signup`,
    GET_ME:`${BASE_URL}/auth/me`
  },
  EVENTS: {
    GET_ALL: `${BASE_URL}/events`,
    GET_BY_ID: (id) => `${BASE_URL}/events/${id}`,
    CREATE: `${BASE_URL}/events`,
    UPDATE: (id) => `${BASE_URL}/events/${id}`,
    DELETE: (id) => `${BASE_URL}/events/${id}`,
  },
  TASKS: {
    GET_ALL: `${BASE_URL}/tasks`,
    GET_BY_ID: (id) => `${BASE_URL}/tasks/${id}`,
    CREATE: `${BASE_URL}/tasks`,
    UPDATE: (id) => `${BASE_URL}/tasks/${id}`,
    DELETE: (id) => `${BASE_URL}/tasks/${id}`,
  },
  SCHEDULE: {
    COMPUTE: (eventId) => `${BASE_URL}/schedule/${eventId}/compute-schedule`,
  },
};

export default API_ENDPOINTS;
