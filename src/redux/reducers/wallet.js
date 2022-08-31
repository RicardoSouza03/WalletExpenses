import {
  REQUEST_FAILURE,
  REQUEST_SUCCESS,
  ADDING_NEW_EXPENSE,
  REMOVING_EXPENSE,
  EDITING_EXPENSE,
  EXPENSE_HAS_BEEN_EDITED,
  FORMS_STATUS_EDITING,
} from '../actions/actionsTypes';

const ALL_STATUS_FORM = {
  readyToAddExpense: 0,
  readyToEdit: 1,
  editing: 2,
};

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
  errorMessage: '',
  expensesTotalValue: 0,
  formStatus: ALL_STATUS_FORM.readyToAddExpense,
};

const SWITCH_CASES = {
  REQUEST_SUCCESS: (state, action) => {
    const currenciesKeys = Object.keys(action.payload[0])
      .filter((currency) => currency !== 'USDT');
    return { ...state, currencies: currenciesKeys };
  },

  REQUEST_FAILURE: (state, action) => ({ ...state, errorMessage: action.error }),

  ADDING_NEW_EXPENSE: (state, action) => {
    const { value, exchangeRates, currency } = action.payload;
    return { ...state,
      expenses: [...state.expenses, action.payload],
      expensesTotalValue: state.expensesTotalValue + (parseFloat(value)
      * parseFloat(exchangeRates[currency].ask)),
    };
  },

  REMOVING_EXPENSE: (state, action) => {
    const expensesWithItemRemoved = state.expenses
      .filter(({ id }) => id !== action.expense.id);
    const { exchangeRates, currency, value } = action.expense;
    return {
      ...state,
      expenses: expensesWithItemRemoved,
      expensesTotalValue: expensesWithItemRemoved.length === 0 ? 0
        : state.expensesTotalValue - (parseFloat(parseFloat(value
          * exchangeRates[currency].ask).toFixed(2))
        ),
    };
  },

  EDITING_EXPENSE: (state, action) => ({
    ...state,
    editor: true,
    idToEdit: action.id,
    formStatus: ALL_STATUS_FORM.readyToEdit,
  }),

  EXPENSE_HAS_BEEN_EDITED: (state, action) => {
    const expensesEdited = state.expenses.map((expense) => {
      if (expense.id === state.idToEdit) return action.expense;
      return expense;
    });

    const { value, exchangeRates, currency, id } = action.expense;
    const expensesValue = state.expenses.reduce((total, expense) => {
      total += parseFloat(expense.value)
      * parseFloat(expense.exchangeRates[expense.currency].ask);
      if (expense.id === id) {
        return total - parseFloat(expense.value)
        * parseFloat(expense.exchangeRates[expense.currency].ask);
      }
      return total;
    }, 0);
    const expenseNewValue = parseFloat(value) * parseFloat(exchangeRates[currency].ask);
    return {
      ...state,
      expenses: expensesEdited,
      editor: false,
      formStatus: ALL_STATUS_FORM.readyToAddExpense,
      expensesTotalValue: expensesValue + expenseNewValue,
    };
  },

  FORMS_STATUS_EDITING: (state) => (
    { ...state, formStatus: ALL_STATUS_FORM.editing }
  ),
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_SUCCESS: return SWITCH_CASES.REQUEST_SUCCESS(state, action);
  case REQUEST_FAILURE: return SWITCH_CASES.REQUEST_FAILURE(state, action);
  case ADDING_NEW_EXPENSE: return SWITCH_CASES.ADDING_NEW_EXPENSE(state, action);
  case REMOVING_EXPENSE: return SWITCH_CASES.REMOVING_EXPENSE(state, action);
  case EDITING_EXPENSE: return SWITCH_CASES.EDITING_EXPENSE(state, action);
  case EXPENSE_HAS_BEEN_EDITED: return SWITCH_CASES
    .EXPENSE_HAS_BEEN_EDITED(state, action);
  case FORMS_STATUS_EDITING: return SWITCH_CASES.FORMS_STATUS_EDITING(state);
  default:
    return state;
  }
};

export default wallet;
