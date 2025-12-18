import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    default:
      return state;
  }
}

