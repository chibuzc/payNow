import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { isLoggedIn } from "../helpers/loggedInUser";

class BankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: null,
      redirect: false
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get("/api/paystack/banks");
      this.setState({ banks: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  handleClick = bank => {
    const code = bank.banks.code;
    this.setState({ redirect: true, beneficiaryBank: bank.banks });
  };

  renderContent() {
    if (this.state.banks) {
      
      return this.state.banks.map((banks) => {
        return (
          <ul key={banks.code} className="collection with-header">
            <li
              className="collection-item"
              key={banks.code}
              onClick={() => {
                this.handleClick({ banks });
              }}
            >
              <div>{banks.name}</div>
            </li>
          </ul>
        );
      });
    } else {
      return <div>LOADING.....</div>;
    }
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/transfer",
            beneficiaryBank: this.state.beneficiaryBank
          }}
          push
        />
      );
    }
    return this.renderContent();
  }
}

export default BankList;
