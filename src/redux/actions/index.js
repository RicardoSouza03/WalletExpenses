import awsomeApiFetch from '../../Services/fetchAPI';

export const LOGIN = 'LOGIN';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_FAILURE = 'REQUEST_FAILURE';
export const REQUEST = 'REQUEST';

export const loginAction = (email) => ({
  type: LOGIN,
  email,
});

const requestAction = () => ({
  type: REQUEST,
});

const requestSuccess = (state) => ({
  type: REQUEST_SUCCESS,
  payload: state,
});

const requestFailure = (error) => ({
  type: REQUEST_FAILURE,
  error,
});

export function fecthCoin() {
  return async (dispatch) => {
    dispatch(requestAction());
    const request = await awsomeApiFetch();
    try {
      const data = requestSuccess(request);
      dispatch(data);
    } catch (error) {
      dispatch(requestFailure(error.message));
    }
  };
}
