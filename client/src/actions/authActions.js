import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR
} from './types';
import { getApiUrl } from '../config';

// Set auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Load user
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  } else {
    dispatch({
      type: AUTH_ERROR
    });
    return;
  }

  try {
    const res = await axios.get(getApiUrl('/api/auth/me'));
    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(getApiUrl('/api/auth/login'), { email, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.token);
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Login failed'
    });
  }
};

// Signup user
export const signup = (username, email, password, role) => async (dispatch) => {
  try {
    const res = await axios.post(getApiUrl('/api/auth/signup'), {
      username,
      email,
      password,
      role
    });
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.token);
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: err.response?.data?.message || 'Signup failed'
    });
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  setAuthToken(null);
};

