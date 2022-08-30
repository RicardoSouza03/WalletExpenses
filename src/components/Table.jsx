import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Table extends Component {
  render() {
    const { expenses } = this.props;
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
            <td>apagar/editar</td>
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

Table.propTypes = {
  expenses: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, null)(Table);
