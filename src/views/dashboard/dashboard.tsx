import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Route } from 'react-router-dom';

import { Container, Header } from "semantic-ui-react";

import './dashboard.css';

import API from '../../components/axiosapi';

import Menubar from "../../components/menubar";

import DailyListing from "../dailylisting/dailylisting";

import Hawker from "../hawker/hawker";

import Store from "../store/store";
import Transactions from "../transactions/transactions";

type State = {};

type Props = {
    match: {
      path: string;
      url: string;
    }
}

class Dashboard extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className="App">
        <Menubar pathName={this.props.match.url}></Menubar>
        <Container  text textAlign="center">
          <Route exact path={`${this.props.match.url}`}>
            <Header size="huge">Welcome to Admin Dashboard!</Header>
            <p className="lead">
              Use the links above to navigate the dashboard
            </p>
          </Route>
          <Route path={`${this.props.match.url}/dailylisting/:date`} render={(props) => <DailyListing {...props}/>}/>
          <Route exact path={`${this.props.match.url}/hawker`}>
            <Hawker/>
          </Route>
          <Route path={`${this.props.match.path}/stall`} render={(props) => <Store {...props}/>}/>
          <Route path={`${this.props.match.url}/transactions/:date`} render={(props) => <Transactions {...props}/>}/>
        </Container>
      </div>
    );
  }
}

export default Dashboard;