import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editingExpense, removingExpense } from '../redux/actions';

class Table extends Component {
  render() {
    const { expenses, removeExpense, startEditingExpense } = this.props;

    const expensesCards = expenses && expenses.map((expense) => {
      const { value, description, currency, method, tag, exchangeRates, id } = expense;
      return (
        <tbody key={ id }>
          <tr>
            <td>{ description }</td>
            <td>{ tag }</td>
            <td>{ method }</td>
            <td>{ parseFloat(value).toFixed(2) }</td>
            <td>{ exchangeRates[currency].name }</td>
            <td>{ parseFloat(exchangeRates[currency].ask).toFixed(2) }</td>
            <td>{ parseFloat(value * exchangeRates[currency].ask).toFixed(2) }</td>
            <td>Real</td>
            <td>
              <button
                type="button"
                onClick={ () => removeExpense(expense) }
                data-testid="delete-btn"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={ () => startEditingExpense(id) }
                data-testid="edit-btn"
              >
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      );
    });

    return (
      <table>
        <caption>Despesas gastas</caption>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        { expensesCards }
      </table>
    );
  }
}

const mapStateToProps = ({ wallet: { expenses } }) => ({
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  removeExpense: (expense) => dispatch(removingExpense(expense)),
  startEditingExpense: (id) => dispatch(editingExpense(id)),
});

Table.propTypes = {
  expenses: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Table);
