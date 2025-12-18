import axios from 'axios';
import { GET_QUIZZES, GET_QUIZ, QUIZ_ERROR, CLEAR_QUIZ } from './types';
import { getApiUrl } from '../config';

// Get all quizzes
export const getQuizzes = () => async (dispatch) => {
  try {
    const res = await axios.get(getApiUrl('/api/quizzes'));
    dispatch({
      type: GET_QUIZZES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: QUIZ_ERROR,
      payload: err.response?.data?.message || 'Error loading quizzes'
    });
  }
};

// Get single quiz with questions
export const getQuiz = (id) => async (dispatch) => {
  try {
    const res = await axios.get(getApiUrl(`/api/quizzes/${id}`));
    dispatch({
      type: GET_QUIZ,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: QUIZ_ERROR,
      payload: err.response?.data?.message || 'Error loading quiz'
    });
  }
};

// Clear current quiz
export const clearQuiz = () => (dispatch) => {
  dispatch({ type: CLEAR_QUIZ });
};

