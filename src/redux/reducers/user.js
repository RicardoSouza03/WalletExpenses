import { LOGIN } from '../actions/actionsTypes';

const INITIAL_STATE = {
  email: '',
  isFetching: false,
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN:
    return { ...state, email: action.email };
  default:
    return state;
  }
};

export default user;
