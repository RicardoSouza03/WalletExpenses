import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  styled,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  Button,
} from '@mui/material';
import TableMui from '@mui/material/Table';
import { connect } from 'react-redux';
import { editingExpense, removingExpense } from '../redux/actions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0A0A0A',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

class Table extends Component {
  render() {
    const { expenses, removeExpense, startEditingExpense } = this.props;

    const expensesCards = expenses && expenses.map((expense) => {
      const { value, description, currency, method, tag, exchangeRates, id } = expense;
      return (
        <StyledTableRow key={ id }>
          <StyledTableCell component="th" scope="row">{ description }</StyledTableCell>
          <StyledTableCell align="center">{ tag }</StyledTableCell>
          <StyledTableCell align="center">{ method }</StyledTableCell>
          <StyledTableCell align="center">
            { parseFloat(value).toFixed(2) }
          </StyledTableCell>
          <StyledTableCell align="center">
            { exchangeRates[currency].name }
          </StyledTableCell>
          <StyledTableCell align="center">
            { parseFloat(exchangeRates[currency].ask).toFixed(2) }
          </StyledTableCell>
          <StyledTableCell align="center">
            { parseFloat(value * exchangeRates[currency].ask).toFixed(2) }
          </StyledTableCell>
          <StyledTableCell align="center">Real</StyledTableCell>
          <StyledTableCell aling="right">
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={ () => removeExpense(expense) }
              data-testid="delete-btn"
              sx={ { width: '80px', p: '4.75px', mr: '2px' } }
            >
              Excluir
            </Button>
            <Button
              type="button"
              variant="contained"
              color="info"
              onClick={ () => startEditingExpense(id) }
              data-testid="edit-btn"
              sx={ { width: '80px', p: '4.75px' } }
            >
              Editar
            </Button>
          </StyledTableCell>
        </StyledTableRow>
      );
    });

    return (
      <TableContainer component={ Paper }>
        <TableMui sx={ { minWidth: 700 } }>
          <TableHead>
            <TableRow>
              <StyledTableCell>Descrição</StyledTableCell>
              <StyledTableCell align="center">Tag</StyledTableCell>
              <StyledTableCell align="center">Método de pagamento</StyledTableCell>
              <StyledTableCell align="center">Valor</StyledTableCell>
              <StyledTableCell align="center">Moeda</StyledTableCell>
              <StyledTableCell align="center">Câmbio utilizado</StyledTableCell>
              <StyledTableCell align="center">Valor convertido</StyledTableCell>
              <StyledTableCell align="center">Moeda de conversão</StyledTableCell>
              <StyledTableCell align="center">Editar/Excluir</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { expensesCards }
          </TableBody>
        </TableMui>
      </TableContainer>
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
