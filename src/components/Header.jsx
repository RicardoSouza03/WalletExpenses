import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';

class Header extends Component {
  render() {
    const { email, expensesTotalValue } = this.props;

    return (
      <AppBar
        position="static"
        style={ { background: '#0A0A0A' } }
      >
        <Toolbar>
          <Typography
            data-testid="email-field"
            variant="h5"
            component="div"
            sx={ { flexGrow: 1 } }
          >
            { email }
          </Typography>
          <Box
            sx={ { display: 'flex', gap: 1 } }
          >
            <Typography data-testid="total-field" variant="h6">
              Total:
              {' '}
              { expensesTotalValue.toFixed(2) }
            </Typography>
            <Typography data-testid="header-currency-field" variant="h6">BRL</Typography>
          </Box>
        </Toolbar>
      </AppBar>
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
