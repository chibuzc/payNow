import React, { Component } from "react";
// import Axios from "axios";
import { Redirect } from "react-router";
import axios from "axios";
import { isLoggedIn } from "../helpers/loggedInUser";

class BeneficiaryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transferList: [],
      next: false,
      trueBeneficiaries: null,
      selectedBeneficiaries: null,
      selected: false,
      user: null,
      beneficiaries:null
    };
  }

  async componentDidMount() {
    const res = await axios.get("/api/beneficiary/all");
    const data = res.data.map(d => {
      d.selected = false;
      return d;
    });
    this.setState({ beneficiaries: data });
  }

   beneficiaryText = {
    margin: '40px',
  };

  handleClick = e => {
    e.preventDefault();
    const trueBeneficiaries = this.state.beneficiaries.filter(b => {
      return b.selected;
    });
    if (trueBeneficiaries.length) {
      this.setState({ trueBeneficiaries, next: true });
    }
  };

  handleCheck = (e, details) => {
    const ben = this.state.beneficiaries.map(b => {
      
      if (b._id === details._id) {
        return {
          ...b,
          selected: !b.selected
        };
      }
      return b;
    });
    this.setState({ beneficiaries: ben });
  };



  renderBeneficiaries() {
    
    return this.state.beneficiaries.map((beneficiaries, index) => {
      return (
        <div key={index}>
          <ul className="collection with-header">
           
            <li className="collection-item">
              
              <div>
                <p className="inline">
                  <label>
                    <input
                      type="checkbox"
                      onChange={e => this.handleCheck(e, beneficiaries)}
                    />
                    <span>{beneficiaries.name}</span>
                    <span style={this.beneficiaryText}>{beneficiaries.bank}</span>
                    <span >{beneficiaries.accountNumber}</span>
                  </label>
                </p>
              </div>
            </li>
          </ul>
        </div>
      );
    });
  }

 

  renderButton() {
    return (
      <button
        //   type="submit"
        onClick={this.handleClick}
        className="waves-effect waves-light btn"
      >
        Next
      </button>
    );
  }

  renderContent() {
    if (this.state.next) {
      return (
        <Redirect
          to={{
            pathname: "/bulkpay",
            beneficiaries: this.state.trueBeneficiaries
          }}
          push
        />
      );
    }

    if (this.state.beneficiaries && this.state.beneficiaries.length) {
      return <div>
        <strong>Tick the checkbox to send to single / multiple beneficiaries</strong>
      {this.renderBeneficiaries()}
      {this.renderButton()}
      </div>;
    }if(!this.state.beneficiaries){
      return(
        <div>LOADING.....</div>
      )
    }
    return <div>NO BENEFICIARIES</div>
  }

  render() {
    return (
      <div>
       
        {this.renderContent()}
      </div>
    );
  }
}

export default BeneficiaryList;
