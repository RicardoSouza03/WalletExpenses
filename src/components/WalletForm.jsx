import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { expensesFetch } from '../redux/actions';

const TAG_DEFAULT = 'Alimentação';

class WalletForm extends Component {
  state = {
    id: 0,
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: TAG_DEFAULT,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    const { expensesAdd } = this.props;
    e.preventDefault();
    this.setState(({ id }) => ({
      id: id + 1,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: TAG_DEFAULT,
    }));
    expensesAdd(this.state);
  };

  render() {
    const { wallet: { currencies } } = this.props;

    const currenciesKeys = currencies.length && currencies.map((currencyName, index) => (
      <option key={ index } value={ currencyName }>{currencyName}</option>
    ));

    const expensesActions = [TAG_DEFAULT, 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    const expensesOptions = expensesActions.map((tag, index) => (
      <option key={ index } value={ tag }>{tag}</option>
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
        <button type="submit">Adicionar despesa</button>
      </form>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({
  wallet,
});

const mapDispatchToProps = (dispatch) => ({
  expensesAdd: (expense) => dispatch(expensesFetch(expense)),
});

WalletForm.propTypes = {
  wallet: PropTypes.object,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
