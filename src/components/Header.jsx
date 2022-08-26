import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    return (
      <main>
        <div data-testid="email-field">
          { email }
        </div>
        <div data-testid="total-field">{ expenses.length === 0 ? 0 : expenses }</div>
        <span data-testid="header-currency-field">BRL</span>
      </main>
    );
  }
}

const mapStateToProps = ({ user: { email }, wallet: { expenses } }) => ({
  email,
  expenses,
});

Header.propTypes = {
  email: PropTypes.string,
  expenses: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, null)(Header);
