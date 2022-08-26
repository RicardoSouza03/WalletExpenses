import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import { fecthCoin } from '../redux/actions';

class Wallet extends React.Component {
  componentDidMount() {
    const { currenciesFetch } = this.props;
    currenciesFetch();
  }

  render() {
    return (
      <div>
        <Header />
        <WalletForm />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  currenciesFetch: () => dispatch(fecthCoin()),
});

Wallet.propTypes = {
  customElements: PropTypes.func,
}.isRequired;

export default connect(null, mapDispatchToProps)(Wallet);
