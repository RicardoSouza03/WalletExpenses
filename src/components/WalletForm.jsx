import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Box,
  Grid,
  Button,
  MenuItem,
} from '@mui/material';
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
    value: 0,
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    disableButton: false,
  };

  componentDidUpdate() {
    const {
      wallet: { expenses, editor, formStatus, idToEdit },
      changeStatusToEditing,
    } = this.props;

    // É feita uma verificação dupla, para que não ocorra um looping infinito na atualização.
    if (editor && formStatus === 1) {
      // É feito este fetch para alterar o status do form, para que não ocorra um looping.
      changeStatusToEditing();
      const expenseToEdit = expenses.find(({ id }) => id === idToEdit);
      const { id, value, description, currency, method, tag } = expenseToEdit;
      this.setState({ id, value, description, currency, method, tag });
    }
  }

  handleChange = ({ target: { name, value } }) => this
    .setState({ [name]: value }, this.buttonHandlerDisable);

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
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: EXPENSE_TAGS[0],
    });

    const expenseToEdit = expenses.find((expense) => expense.id === idToEdit);
    if (wallet.editor) return editExpense({ ...expenseToEdit, ...this.state });

    addNewExpense(this.state);
  };

  buttonHandlerDisable = () => {
    const { value } = this.state;

    this.setState({ disableButton: value === '' });
  };

  render() {
    const { wallet: { currencies, editor } } = this.props;

    const currenciesKeys = currencies.length ? currencies.map((currencyName) => (
      <MenuItem
        key={ currencyName }
        value={ currencyName }
      >
        {currencyName}
      </MenuItem>
    )) : (<MenuItem>Error</MenuItem>);

    const expensesOptions = EXPENSE_TAGS.map((tag) => (
      <MenuItem key={ tag } value={ tag }>
        {tag}
      </MenuItem>
    ));

    const { value, description, currency, tag, method, disableButton } = this.state;
    return (
      <Grid
        container
        spacing={ 0 }
        alignItems="center"
        justifyContent="center"
        style={ { backgroundColor: '#212121' } }
        sx={ { p: 2 } }
      >
        <Box
          component="form"
          onSubmit={ this.handleSubmit }
          sx={ {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            p: 2,
            border: '2px solid #7D7D7D',
            borderRadius: 3,
          } }
          style={ { backgroundColor: 'white' } }
        >
          <TextField
            type="number"
            label="Valor"
            data-testid="value-input"
            name="value"
            value={ value }
            onChange={ this.handleChange }
            helperText="Adicione um valor"
          />
          <TextField
            type="text"
            label="Descrição"
            data-testid="description-input"
            name="description"
            value={ description }
            onChange={ this.handleChange }
            helperText="Adicione uma descrição sobre o gasto"
          />
          <TextField
            name="currency"
            select
            data-testid="currency-input"
            value={ currency }
            onChange={ this.handleChange }
            helperText="Selecione uma moeda"
          >
            {currenciesKeys}
          </TextField>
          <TextField
            name="method"
            select
            value={ method }
            onChange={ this.handleChange }
            data-testid="method-input"
            helperText="Método de pagamento"
          >
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            <MenuItem value="Cartão de crédito">Cartão de crédito</MenuItem>
            <MenuItem value="Cartão de débito">Cartão de débito</MenuItem>
          </TextField>
          <TextField
            select
            name="tag"
            data-testid="tag-input"
            value={ tag }
            onChange={ this.handleChange }
            helperText="Onde foi gasto?"
          >
            {expensesOptions}
          </TextField>
          <Button
            disabled={ disableButton }
            variant="contained"
            type="submit"
            sx={ { height: '55px' } }
          >
            {editor ? 'Editar despesa' : 'Adicionar despesa'}
          </Button>
        </Box>
      </Grid>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({ wallet });

const mapDispatchToProps = (dispatch) => ({
  addNewExpense: (expense) => dispatch(expensesFetch(expense)),
  editExpense: (expense) => dispatch(expenseHasBeenEdited(expense)),
  changeStatusToEditing: () => dispatch(changeFormsStatusToEditing),
});

WalletForm.propTypes = { wallet: PropTypes.object }.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
