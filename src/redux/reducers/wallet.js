import { REQUEST_FAILURE, REQUEST_SUCCESS, ADDING_EXPENSE } from '../actions';

// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
const INITIAL_STATE = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
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

  default:
    return state;
  }
};

export default wallet;
