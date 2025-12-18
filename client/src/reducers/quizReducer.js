import {
  GET_QUIZZES,
  GET_QUIZ,
  QUIZ_ERROR,
  CLEAR_QUIZ
} from '../actions/types';

const initialState = {
  quizzes: [],
  currentQuiz: null,
  questions: [],
  loading: true,
  error: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_QUIZZES:
      return {
        ...state,
        quizzes: payload,
        loading: false,
        error: null
      };
    case GET_QUIZ:
      return {
        ...state,
        currentQuiz: payload.quiz,
        questions: payload.questions,
        loading: false,
        error: null
      };
    case CLEAR_QUIZ:
      return {
        ...state,
        currentQuiz: null,
        questions: []
      };
    case QUIZ_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

