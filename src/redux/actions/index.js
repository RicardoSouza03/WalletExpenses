import awsomeApiFetch from '../../Services/fetchAPI';

import {
  LOGIN,
  REQUEST_FAILURE,
  REQUEST_SUCCESS,
  ADDING_NEW_EXPENSE,
  REMOVING_EXPENSE,
  EDITING_EXPENSE,
  EXPENSE_HAS_BEEN_EDITED,
  FORMS_STATUS_EDITING,
} from './actionsTypes';

export const loginAction = (email) => ({ type: LOGIN, email });

export const removingExpense = (expense) => ({ type: REMOVING_EXPENSE, expense });

export const editingExpense = (id) => ({ type: EDITING_EXPENSE, id });

export const changeFormsStatusToEditing = { type: FORMS_STATUS_EDITING };

export const expenseHasBeenEdited = (expense) => ({
  type: EXPENSE_HAS_BEEN_EDITED,
  expense,
});

const requestSuccess = (state) => ({ type: REQUEST_SUCCESS, payload: [state] });

const requestFailure = (error) => ({ type: REQUEST_FAILURE, error });

const addNewExpense = (expense) => ({ type: ADDING_NEW_EXPENSE, payload: expense });

export function expensesFetch(expense) {
  return async (dispatch) => {
    const request = await awsomeApiFetch();
    if (typeof request === 'string') {
      dispatch(requestFailure(request));
    } else {
      // cria uma nova chave dentro do objeto expense, com os valores retornados da API.
      expense.exchangeRates = request;
      dispatch(addNewExpense(expense));
    }
  };
}

export function fecthCoin() {
  return async (dispatch) => {
    const request = await awsomeApiFetch();
    if (typeof request === 'string') {
      dispatch(requestFailure(request));
    } else {
      dispatch(requestSuccess(request));
    }
  };
}
