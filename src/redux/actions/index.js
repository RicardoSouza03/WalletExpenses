import awsomeApiFetch from '../../Services/fetchAPI';

export const LOGIN = 'LOGIN';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_FAILURE = 'REQUEST_FAILURE';
export const REQUEST = 'REQUEST';
export const ADDING_NEW_EXPENSE = 'ADDING_NEW_EXPENSE';
export const REMOVING_EXPENSE = 'REMOVING_EXPENSE';
export const EDITING_EXPENSE = 'EDITING_EXPENSE';
export const EXPENSE_HAS_BEEN_EDITED = 'EXPENSE_HAS_BEEN_EDITED';
export const FORMS_STATUS_EDITING = 'FORMS_STATUS_EDITING';

export const loginAction = (email) => ({
  type: LOGIN,
  email,
});

export const removingExpense = (expense) => ({
  type: REMOVING_EXPENSE,
  expense,
});

export const editingExpense = (id) => ({
  type: EDITING_EXPENSE,
  id,
});

export const expenseHasBeenEdited = (expense) => ({
  type: EXPENSE_HAS_BEEN_EDITED,
  expense,
});

export const changeFormsStatusToEditing = { type: FORMS_STATUS_EDITING };

const requestSuccess = (state) => ({
  type: REQUEST_SUCCESS,
  payload: [state],
});

const requestFailure = (error) => ({
  type: REQUEST_FAILURE,
  error,
});

const addExpense = (expense) => ({
  type: ADDING_NEW_EXPENSE,
  payload: expense,
});

export function expensesFetch(expense) {
  return async (dispatch) => {
    const exchangeRates = await awsomeApiFetch();
    try {
      expense.exchangeRates = exchangeRates;
      const data = addExpense(expense);
      dispatch(data);
    } catch (error) {
      dispatch(requestFailure(error.message));
    }
  };
}

export function fecthCoin() {
  return async (dispatch) => {
    const request = await awsomeApiFetch();
    try {
      const data = requestSuccess(request);
      dispatch(data);
    } catch (error) {
      dispatch(requestFailure(error.message));
    }
  };
}
