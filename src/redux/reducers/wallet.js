import {
  REQUEST_FAILURE,
  REQUEST_SUCCESS,
  ADDING_EXPENSE,
  REMOVING_EXPENSE,
} from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
  isFetching: false,
  errorMessage: '',
  expensesTotalValue: 0,
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_SUCCESS: {
    const currenciesKeys = Object.keys(action.payload[0])
      .filter((currency) => currency !== 'USDT');
    return { ...state, currencies: currenciesKeys };
  }

  case REQUEST_FAILURE:
    return { ...state, errorMessage: action.error };

  case ADDING_EXPENSE: {
    const { value, exchangeRates, currency } = action.payload;
    return { ...state,
      expenses: [...state.expenses, action.payload],
      expensesTotalValue: state.expensesTotalValue + (parseFloat(value)
      * parseFloat(exchangeRates[currency].ask)) };
  }

  case REMOVING_EXPENSE: {
    const expensesWithItemRemoved = state.expenses
      .filter(({ id }) => id !== action.expense.id);

    const { exchangeRates, currency, value } = action.expense;
    return {
      ...state,
      expenses: expensesWithItemRemoved,
      expensesTotalValue: state.expensesTotalValue - (
        parseFloat(parseFloat(value * exchangeRates[currency].ask).toFixed(2))
      ),
    };
  }
  default:
    return state;
  }
};

export default wallet;
