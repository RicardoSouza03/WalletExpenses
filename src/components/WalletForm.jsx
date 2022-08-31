import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  expensesFetch,
  expenseHasBeenEdited,
  changeFormsStatusToEditing,
} from '../redux/actions';

const EXPENSE_TAGS = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

class WalletForm extends Component {
  state = {
    id: 0,
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  componentDidUpdate() {
    const {
      wallet: { expenses, editor, formStatus, idToEdit },
      changeStatusToEditing,
    } = this.props;

    if (editor && formStatus === 1) {
      changeStatusToEditing();
      const expenseToEdit = expenses.find(({ id }) => id === idToEdit);
      const { id, value, description, currency, method, tag } = expenseToEdit;
      this.setState({ id, value, description, currency, method, tag });
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    const {
      addNewExpense,
      editExpense,
      wallet,
      wallet: { expenses, idToEdit },
    } = this.props;

    const { id } = this.state;
    e.preventDefault();

    const verifyIfIdIsRepeated = expenses.some((expense) => expense.id === id);
    const findLastIdOnExpenses = expenses.reduce((higerNum, expense) => {
      if (higerNum < expense.id) higerNum = expense.id;
      return higerNum;
    }, 0);

    this.setState({
      id: verifyIfIdIsRepeated ? findLastIdOnExpenses + 1 : id + 1,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: EXPENSE_TAGS[0],
    });

    const expenseToEdit = expenses.find((expense) => expense.id === idToEdit);
    if (wallet.editor) return editExpense({ ...expenseToEdit, ...this.state });

    addNewExpense(this.state);
  };

  render() {
    const { wallet: { currencies, editor } } = this.props;

    const currenciesKeys = currencies.length && currencies.map((currencyName) => (
      <option key={ currencyName } value={ currencyName }>{currencyName}</option>
    ));

    const expensesOptions = EXPENSE_TAGS.map((tag) => (
      <option key={ tag } value={ tag }>{tag}</option>
    ));

    const { value, description,
      currency, tag, method } = this.state;
    return (
      <form onSubmit={ this.handleSubmit }>
        <input
          type="number"
          data-testid="value-input"
          name="value"
          value={ value }
          onChange={ this.handleChange }
        />
        <input
          type="text"
          data-testid="description-input"
          name="description"
          value={ description }
          onChange={ this.handleChange }
        />
        <select
          name="currency"
          data-testid="currency-input"
          value={ currency }
          onChange={ this.handleChange }
        >
          {currenciesKeys}
        </select>
        <select
          name="method"
          value={ method }
          onChange={ this.handleChange }
          data-testid="method-input"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
        <select
          name="tag"
          data-testid="tag-input"
          value={ tag }
          onChange={ this.handleChange }
        >
          {expensesOptions}
        </select>
        <button type="submit">
          {editor ? 'Editar despesa' : 'Adicionar despesa'}
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({
  wallet,
});

const mapDispatchToProps = (dispatch) => ({
  addNewExpense: (expense) => dispatch(expensesFetch(expense)),
  editExpense: (expense) => dispatch(expenseHasBeenEdited(expense)),
  changeStatusToEditing: () => dispatch(changeFormsStatusToEditing),
});

WalletForm.propTypes = {
  wallet: PropTypes.object,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
