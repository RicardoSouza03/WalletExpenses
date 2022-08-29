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
    const { errorMessage } = this.props;
    return (
      <div>
        { errorMessage || (
          <div>
            <Header />
            <WalletForm />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ wallet: { errorMessage } }) => ({
  errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  currenciesFetch: () => dispatch(fecthCoin()),
});

Wallet.propTypes = {
  customElements: PropTypes.func,
  errorMessage: PropTypes.string,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
