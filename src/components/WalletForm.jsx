import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WalletForm extends Component {
  state = {
    expenseValue: '',
    expenseDescription: '',
    currencie: 'USD',
    paymentMethod: 'Dinheiro',
    expense: 'Alimentação',
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  render() {
    const { wallet: { currencies } } = this.props;

    const currenciesKeys = currencies.length && currencies.map((currencyName, index) => (
      <option key={ index } value={ currencyName }>{currencyName}</option>
    ));

    const expensesActions = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    const expensesOptions = expensesActions.map((expense, index) => (
      <option key={ index } value={ expense }>{expense}</option>
    ));

    const { expenseValue, expenseDescription,
      currencie, expense, paymentMethod } = this.state;
    return (
      <form>
        <input
          type="number"
          data-testid="value-input"
          name="expenseValue"
          value={ expenseValue }
          onChange={ this.handleChange }
        />
        <input
          type="text"
          data-testid="description-input"
          name="expenseDescription"
          value={ expenseDescription }
          onChange={ this.handleChange }
        />
        <select
          name="currencie"
          data-testid="currency-input"
          value={ currencie }
          onChange={ this.handleChange }
        >
          {currenciesKeys}
        </select>
        <select
          name="paymentMethod"
          value={ paymentMethod }
          onChange={ this.handleChange }
          data-testid="method-input"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
        <select
          name="expense"
          data-testid="tag-input"
          value={ expense }
          onChange={ this.handleChange }
        >
          {expensesOptions}
        </select>
      </form>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({
  wallet,
});

// const mapDispatchToProps = (dispatch) => ({
//   currenciesFetch: () => dispatch(fecthCoin()),
// });

WalletForm.propTypes = {
  wallet: PropTypes.object,
}.isRequired;

export default connect(mapStateToProps)(WalletForm);
