import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { email, expensesTotalValue } = this.props;

    return (
      <main>
        <div data-testid="email-field">
          { email }
        </div>
        <div data-testid="total-field">{ expensesTotalValue.toFixed(2) }</div>
        <span data-testid="header-currency-field">BRL</span>
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
