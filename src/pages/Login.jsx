import React from 'react';
import PropTypes from 'prop-types';
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
      <main>
        <input
          type="email"
          name="email"
          onChange={ this.changeHandler }
          value={ email }
          data-testid="email-input"
        />
        <input
          type="password"
          name="password"
          onChange={ this.changeHandler }
          value={ password }
          data-testid="password-input"
        />
        <button
          type="button"
          onClick={ this.buttonHandler }
          disabled={ disableButton }
        >
          Entrar
        </button>
      </main>
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
