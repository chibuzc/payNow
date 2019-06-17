import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import "./../index.css";

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountNumber: null,
      accountName: null,
      transferReciept: null,
      saveBeneficiary: false
    };
  }

  resolveAccountName = async () => {
    // e.preventDefault()
    await this.setState(
      { bankCode: this.props.location.beneficiaryBank.code }
    );
    const res = await axios.post(
      "/api/paystack/verifyaccount",
      this.state
    );
    this.setState({ accountName: res.data.account_name }
    );
  };

  handleChange = e => {
    const accountNumber = e.target.value;
    this.setState({ accountNumber });
    if (/^[0-9]{10}$/.test(e.target.value)) {
      this.resolveAccountName();
    }
  };

  handleAmountChange = e => {
    const amount = e.target.value;
    this.setState({ amount });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.accountName) {
      const reciept = await axios.post(
        "/api/paystack/transferReciept",
        this.state
      );
      this.setState({ transferReciept: reciept.data.data });
    }
  };

  handleCheckbox = e => {
    if(e.target.checked){
      this.setState({saveBeneficiary: true})
    }
  }

  renderNameField = () => {
    if (this.state.accountName) {
      return (
        <div>
          <div className="row">
            <div className="input-field col s6">
              <input
                placeholder="Account Name"
                id="accountName"
                type="text"
                className="validate"
                value={this.state.accountName}
                
              />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                placeholder="Amount"
                id="amount"
                type="text"
                className="validate"
                onChange={this.handleAmountChange}
              />
            </div>
          </div>
          <p>
            <label>
              <input type="checkbox" className="filled-in" onChange={this.handleCheckbox}/>
              <span>Save as Beneficiary</span>
            </label>
          </p>
          <button type="submit" className="waves-effect waves-light btn">
            Next
          </button>
        </div>
      );
    }
  };

  renderContent() {
    if (!this.props.location.beneficiaryBank) {
      return <Redirect to="/" />;
    } else if (this.state.transferReciept) {
      return (
        <Redirect
          to={{
            pathname: "/transfer/confirmation",
            transferDetails: this.state
          }}
          push
        />
      );
    }
    return (
      <div classNameName = "transfer">
        <form className="col s6" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s6">
              <input
                placeholder="Bank"
                id="Bank"
                type="text"
                className="validate"
                value={this.props.location.beneficiaryBank.name}
                // onChange={this.onClick}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                placeholder="Account Number"
                id="Account Number"
                type="text"
                className="validate"
                onChange={this.handleChange}
                value={this.state.accountNumber}
              />
            </div>
          </div>
          {this.renderNameField()}
        </form>
      </div>
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default Transfer;
