import { LOGIN, REQUEST } from '../actions';

// Esse reducer será responsável por tratar as informações da pessoa usuária
const INITIAL_STATE = {
  email: '',
  isFetching: false,
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST:
    return { ...state, isFetching: true };
  case LOGIN:
    return { ...state, email: action.email, isFetching: false };
  default:
    return state;
  }
};

export default user;
