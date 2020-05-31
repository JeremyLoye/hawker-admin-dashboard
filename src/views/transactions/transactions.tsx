import 'react-dates/initialize';
import React from "react";
import { Container, Transition, Grid, Radio, Dropdown, DropdownProps, List, Modal, Button, Divider, ButtonProps } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker } from 'react-dates';

import API from "../../components/axiosapi";

import { Transaction, User, CartItem } from "../../components/interfaces";

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

let userData: { [id: string]: User } = {};

class Transactions extends React.Component<Props, State> {
  state = {
    focused: false,
    date: moment(this.props.match.params.date, "DDMMYYYY"),
    transactions: transactions,
    visible: false,
    filter: 'all',
    mealType: 'lunch',
    zone: 'Cinnamon',
    userData: userData
  }

  componentDidMount() {
    this.fetchTransactions(this.state.date, this.state.mealType, this.state.zone)
  }

  marginTotal = (cart: CartItem[]) => {
    let cost = 0;
    let el;
    for (el of cart) {
      cost += el.margin * el.quantity;
    }
    return cost;
  }


  dateChange = (date: Moment) => {
    if (this.state.date.format("DDMMYYYY") !== date.format("DDMMYYYY")) {
      this.props.history.push(`/dashboard/transactions/${date.format("DDMMYYYY")}`)
      this.setState({ date })
      this.setState({ visible: false })
      this.fetchTransactions(date, this.state.mealType, this.state.zone)
    }
  }

  selectMealType = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let mealString: any = data.value
    if (mealString !== this.state.mealType) {
      this.setState({ visible: false })
      this.setState({ mealType: mealString })
      this.fetchTransactions(this.state.date, mealString, this.state.zone)
    }
  }

  filterChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let filterString: any = data.value
    if (filterString !== this.state.filter) {
      this.setState({ filter: filterString })
    }
  }

  selectZone = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let zoneString: any = data.value
    if (zoneString !== this.state.zone) {
      this.setState({ visible: false })
      this.setState({ zone: zoneString })
      this.fetchTransactions(this.state.date, this.state.mealType, zoneString)
    }
  }
  

  fetchTransactions = (date: Moment, mealType: string, zone: string) => {
    API.post('/transactions/get/' + date.format("DDMMYYYY") + `/${mealType}`+ `/${zone}`).then((res: any) => {
      let transactions: Transaction[] = res['data']['transactions']
      this.setState({ transactions: transactions })
      this.setState({ visible: true })
      transactions.forEach(el => {
        API.post(`/users/${el.awsId}`).then(res => {
          let newUserData: any = this.state.userData
          newUserData[el.awsId] = res["data"]
          this.setState({ userData: newUserData })
          this.setState({ visible: true })
        })
      })
    })
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

  getName = (id:string) => {
    if (id in this.state.userData) {
      return this.state.userData[id].name
    } else {
      return ""
    }
  }

  getPhoneNumber = (id: string) => {
    if (id in this.state.userData) {
      return this.state.userData[id].phone
    } else {
      return ""
    }
  }

  getDate = (date: string) => {
    let datetime = new Date(date)
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minuteString = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minuteString + ' ' + ampm;
    return datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear() + " " + strTime
  }

  postToggledTransaction = (id: string, isPaid: boolean) => {
    const body = {
      "_id": id,
      "paid": isPaid
    }
    API.post(`transactions/update`, body)
  }

  getButtonText = (isPaid: boolean) => {
    return isPaid ? "Paid" : "Unpaid"
  }

  renderList = () => {
    let transactions: Transaction[] = this.state.transactions;
    if (this.state.filter !== 'all') {
      transactions = this.filterTransactions(this.state.filter === 'paid')
    }
    return transactions.map((transaction: Transaction) => (
      <Modal trigger={
        <List.Item>
          <List.Content floated="right">
            ${transaction.totalPrice.toFixed(2)}
          </List.Content>
          <List.Content floated='left'>
            <List.Header>{this.getDate(transaction.dateTime)} </List.Header>
            <p>{this.getPhoneNumber(transaction.awsId)}</p>
          </List.Content>
          <List.Header>
            {transaction.paymentUsername} ({transaction.paymentMethod})
          </List.Header>
          {this.getName(transaction.awsId)}
          <List.Content floated="right">
            <Button
              toggle
              style={{ background: 'red', color: 'white' }}
              active={transaction.paid}
              onClick={
                (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
                  event.stopPropagation();
                  transaction.paid = !transaction.paid
                  this.postToggledTransaction(transaction._id, transaction.paid)
                  this.forceUpdate()
                }
              }>
              {this.getButtonText(transaction.paid)}
            </Button>
          </List.Content>
        </ List.Item>
      }>
        <Modal.Header>
          Order on {moment(transaction.date, "DDMMYYYY").format("DD-MM-YYYY")} ({transaction.meal})
          </Modal.Header>
        <Modal.Content>
          <List ordered>
            {transaction.cart.map((item) => (
              <List.Item>
                <List.Content floated='right'>
                  <List.Header>${item['price'].toFixed(2)}</List.Header>
                  ${(item['margin']).toFixed(2)}
                </List.Content>
                <List.Content>
                  <List.Header>{item['quantity']}x {item['name']}</List.Header>
                  {item['stallId']}
                </List.Content>
                <Divider />
              </List.Item>
            ))}
          </List>
          <List>
            <List.Item>
              <List.Content floated="right">
                ${this.marginTotal(transaction.cart).toFixed(2)}
              </List.Content>
              <List.Content>
                Service Fee:
              </List.Content>
            </List.Item>
            <Divider />
            <List.Item>
              <List.Content floated="right">
                ${transaction.totalPrice.toFixed(2)}
              </List.Content>
              <List.Content>
                Total Cost:
              </List.Content>
            </List.Item>
          </List>
        </Modal.Content>
      </Modal>
    ))
  }

  renderTransactions = () => {
    return <List relaxed animated selection divided>
      {this.renderList()}
    </List>
  }

  render() {
    return (
      <div>
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
                isOutsideRange={() => false}
                displayFormat="DD/MM/YYYY"
                small={true}>
              </SingleDatePicker>
            </p>
          
        <Grid columns='three' fluid>
          <Grid.Column>
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
          <Grid.Column>
            <Dropdown
              key={2}
              placeholder='Zone'
              fluid
              defaultValue='Cinnamon'
              className="huge"
              selection
              options={[
                {
                  key: 'Cinnamon',
                  text: 'Cinnamon',
                  value: 'Cinnamon'
                },
                {
                  key: 'Tembusu',
                  text: 'Tembusu',
                  value: 'Tembusu'
                }
              ]}
              onChange={this.selectZone}
            />
          </Grid.Column>
          <Grid.Column>
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
            {this.renderTransactions()}
          </div>
        </Transition>
      </div>
    );
  }
}

export default Transactions