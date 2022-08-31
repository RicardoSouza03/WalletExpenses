import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { email, expensesTotalValue } = this.props;

    return (
      <main>
        <h2 data-testid="email-field">{ email }</h2>
        <h3 data-testid="total-field">{ expensesTotalValue.toFixed(2) }</h3>
        <h4 data-testid="header-currency-field">BRL</h4>
      </main>
    );
  }
}

const mapStateToProps = ({ user: { email }, wallet: { expensesTotalValue } }) => ({
  email,
  expensesTotalValue,
});

Header.propTypes = {
  email: PropTypes.string,
  expenses: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, null)(Header);
