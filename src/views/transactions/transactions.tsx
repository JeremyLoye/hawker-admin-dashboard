import 'react-dates/initialize';
import React from "react";
import { Container, Transition, Grid, Radio, Dropdown, DropdownProps } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker } from 'react-dates';

import API from "../../components/axiosapi";

import { Transaction, User } from "../../components/interfaces";

import { TransactionContext } from "../../components/appcontexts";

import TransactionList from "../../components/transactionlist"

import 'react-dates/lib/css/_datepicker.css';

import "semantic-ui-css/semantic.min.css";

import './transactions.css';

type State = {}

type Props = RouteComponentProps & {
  match: {
    url: string
    params: {
      date: string
    }
  }
}

const transactions: Transaction[] = [];

class Transactions extends React.Component<Props, State> {
  state = {
    focused: false,
    date: moment(this.props.match.params.date, "DDMMYYYY"),
    transactions: transactions,
    visible: false,
    filter: 'all',
    filteredTransactions: transactions,
    mealType: 'lunch',
    update: () => {
      this.props.history.push(`/dashboard/transactions/${this.state.date.format("DDMMYYYY")}`)
      this.setState({ visible: false })
      this.fetchTransactions(this.state.date).then((res: any) => {
        if (res['data']['transactions'] == null) { 
          this.setState({ transactions: [] })
        } else {
          this.setState({ transactions: res['data']['transactions'] })
        }
        this.setState({ visible: true })
      })
    }
  }

  componentDidMount() {
    this.setState({ date: moment(this.props.match.params.date, "DDMMYYYY") })
    this.fetchTransactions(this.state.date).then((res: any) => {
      if (res['data']['transactions'] == null) { 
        this.setState({ transactions: [] })
      } else {
        this.setState({ transactions: res['data']['transactions'] })
      }
      this.setState({ visible: true })
    })
  }


  dateChange = (date: Moment) => {
    if (this.state.date.format("DDMMYYYY") !== date.format("DDMMYYYY")) {
      this.props.history.push(`/dashboard/transactions/${date.format("DDMMYYYY")}`)
      this.setState({ date })
      this.setState({ visible: false })
      this.fetchTransactions(date).then((res: any) => {
        if (res['data']['transactions'] == null) { 
          this.setState({ transactions: [] })
        } else {
          this.setState({ transactions: res['data']['transactions'] })
        }
        this.setState({ visible: true })
      })
    }
  }

  selectMealType = async (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let mealString: any = data.value
    if(mealString !== this.state.mealType) {
      await this.setState({ mealType: mealString })
      this.fetchTransactions(this.state.date).then((res: any) => {
        this.setState({ transactions: res['data']['transactions'] })
        this.setState({ visible: true })
      })
    }
  }
  
  filterChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let filterString: any = data.value
    if(filterString !== this.state.filter) {
      this.setState({filter: filterString})
      this.setState({ visible: false })
      if (filterString !== "all") { 
        this.setState({ filteredTransactions: this.filterTransactions(filterString === "paid") })
      }
      this.setState({ visible: true })
    }
  }

  fetchTransactions = (date: Moment) => {
    let promise: Promise<Transaction[]> = API.post('/transactions/datemeal/' + date.format("DDMMYYYY") + `/${this.state.mealType}`);
    return promise;
  }

  filterTransactions = (filterPaid: boolean) => {
    let filteredTransactions: Transaction[] = []
    this.state.transactions.forEach(el => {
      if (el.paid && filterPaid) {
        filteredTransactions.push(el)
      } else if (!el.paid && !filterPaid) {
        filteredTransactions.push(el)
      }
    })
    return filteredTransactions
  }

  render() {
    return (
      <div>
        <Grid columns='two' fluid>
            <Grid.Column width={8}>
          <p className="lead">
            View transactions on:
          <SingleDatePicker
              id="2"
              orientation="horizontal"
              anchorDirection="right"
              date={this.state.date}
              onDateChange={(date) => { if (date) { this.dateChange(date) } }}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              numberOfMonths={1}
              isOutsideRange={()=>false}
              displayFormat="DD/MM/YYYY"
              small={true}>
            </SingleDatePicker>
          </p>
          </Grid.Column>
          <Grid.Column width={4}>
          <Dropdown
            key={1}
            placeholder='Meal Type'
            fluid
            className="huge"
            selection
            defaultValue='lunch'
            options={[
              {
                key: 'lunch',
                text: 'Lunch',
                value: 'lunch'
              },
              {
                key: 'dinner',
                text: 'Dinner',
                value: 'dinner'
              }
            ]}
            onChange={this.selectMealType}
          />
          </Grid.Column>
          <Grid.Column width={4}>
          <Dropdown
            key={2}
            placeholder='Filter'
            fluid
            className="huge"
            selection
            options={[
              {
                key: 'all',
                text: 'All',
                value: 'all'
              },
              {
                key: 'paid',
                text: 'Paid',
                value: 'paid'
              },
              {
                key: 'upaid',
                text: 'Unpaid',
                value: 'unpaid'
              }
            ]}
            onChange={this.filterChange}
          />
          </Grid.Column>
          </Grid>
          <Transition visible={this.state.visible} animation='scale' duration={500}>
          <div>
          <TransactionContext.Provider value={this.state}>
           <TransactionList pathName={this.props.match.url}/>
          </TransactionContext.Provider>
          </div>
          </Transition>
      </div>
    );
  }
}

export default Transactions