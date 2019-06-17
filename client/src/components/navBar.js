import React from "react";
import { Link } from "react-router-dom";

const navBar = props => {
  return (
    <div>
      <nav className="nav-extended">
        <div className="nav-wrapper blue lighten-3">
          <a href="/" className="brand-logo">
            Pay Now!
          </a>
        </div>
        <div className="nav-content blue lighten-3">
          <ul className="tabs tabs-transparent">
            <li className="tab">
              <Link to="/initiate_transfer">Make Transfer</Link>
            </li>
            <li className="tab">
              <Link to="/beneficiaries">Beneficiaries</Link>
            </li>
            <li className="tab">
              <Link to="/transfer/all">All Transfers</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default navBar;
