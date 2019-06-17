import React, { Component } from "react";
import axios from 'axios';
import BankList from "./bankList";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state={}
    }

onClick = (e) => {
    const value = e.target.value
    const fieldName = e.target.id
    this.setState({[fieldName]:value})
}

async handleSubmit(e){
    e.preventDefault()
   const res = await axios.post('/api/newCustomer', this.state)
   console.log(res.data)
}


  render() {
    return (
      <div>
          <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
        <div className="row">
          <div className="input-field col s12">
            <input
              placeholder="Name"
              id="first_name"
              type="text"
              className="validate"
              onChange={this.onClick}
            />
          </div>
        </div>




        {/* <div className="row">
          <div className="input-field col s12">
            <input
              placeholder="Bank"
              id="bankName"
              type="text"
              className="validate"
              onChange={this.onClick}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              placeholder="Amount"
              id="amount"
              type="text"
              className="validate"
              onChange={this.onClick}
            />
          </div>
        </div> */}
        <button type="submit" className="waves-effect waves-light btn">button</button>
        </form>
       
      </div>
    );
  }
}

export default Form;
