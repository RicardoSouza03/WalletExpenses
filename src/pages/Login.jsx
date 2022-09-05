import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Box, Grid, Typography, Button } from '@mui/material';
import { connect } from 'react-redux';
import { loginAction } from '../redux/actions';

const PASSWORD_MIN_LENGTH = 6;

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    disableButton: true,
  };

  changeHandler = ({ target }) => {
    const { value, name } = target;
    this.setState({ [name]: value }, this.verifyLogin);
  };

  verifyLogin = () => {
    const { email, password } = this.state;
    // regex para validação, site: https://www.horadecodar.com.br/2020/09/13/como-validar-email-com-javascript/;
    const emailVerify = !email.match(/\S+@\S+\.\S+/);
    const passwordVerify = password.length < PASSWORD_MIN_LENGTH; // true até ser 6

    this.setState({ disableButton: emailVerify || passwordVerify });
  };

  buttonHandler = () => {
    const { email } = this.state;
    const { history, userEmail } = this.props;
    userEmail(email);
    history.push('/carteira');
  };

  render() {
    const { email, password, disableButton } = this.state;

    return (
      <Grid
        container
        spacing={ 0 }
        alignItems="center"
        justifyContent="center"
        style={ { minHeight: '100vh' } }
      >
        <Box
          sx={ {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            border: '2px solid gray',
            borderRadius: 4,
            px: 7,
            py: 6,
          } }
        >
          <Typography variant="h4" sx={ { textDecoration: 'underline' } }>
            Login
          </Typography>
          <TextField
            type="email"
            name="email"
            onChange={ this.changeHandler }
            label="Email"
            variant="outlined"
            value={ email }
            data-testid="email-input"
            sx={ { fontSize: '50px' } }
          />
          <TextField
            type="password"
            name="password"
            onChange={ this.changeHandler }
            label="Senha"
            variant="outlined"
            value={ password }
            data-testid="password-input"
          />
          <Button
            type="button"
            variant="contained"
            onClick={ this.buttonHandler }
            disabled={ disableButton }
            sx={ { minWidth: '100%' } }
          >
            Entrar
          </Button>
        </Box>
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userEmail: (email) => dispatch(loginAction(email)),
});

Login.propTypes = {
  history: PropTypes.array,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
