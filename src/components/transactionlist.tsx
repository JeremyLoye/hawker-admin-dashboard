import 'react-dates/initialize';
import React from "react";
import { List, DropdownProps, Button, Header, Grid, Radio, CheckboxProps, CardProps, Popup, Modal, Divider, ButtonProps } from 'semantic-ui-react'
import { Dropdown } from "semantic-ui-react";
import { Link, Route } from 'react-router-dom';
import moment, { Moment } from 'moment';

import API from './axiosapi';

import 'react-dates/lib/css/_datepicker.css';
import { User, Transaction } from './interfaces';
import { TransactionContext } from './appcontexts';
import FoodList from './foodlist';
import Transactions from '../views/transactions/transactions';

type Props = {
  pathName: string;
}

type State = {}

let userData:{ [id: string]: User } = {};


class TransactionList extends React.Component<Props, State> {
  state = {
    userData: userData
  }

  getUserData = async (Transactions: Transaction[]) => {
    Transactions.forEach(async el => {
      let res = await API.post(`/users/${el.awsId}`)
      let newUserData: any = this.state.userData
      newUserData[el.awsId] = res["data"]
      this.setState({ userData: newUserData })
    })
  }

  getPhoneNumber = (id: string) => {
    if (Object.keys(this.state.userData).length === 0) {
      return ""
    } else {
      return this.state.userData[id].phone
    }
  }

  getDate = (date: string) => {
    let datetime = new Date(date)
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minuteString = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = hours + ':' + minuteString + ' ' + ampm;
    return datetime.getDate() + "/" + datetime.getMonth() + "/" + datetime.getFullYear() + " " + strTime
  }

  renderList = (transactions: Transaction[], date: Moment) => {
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
                  ${item['price'].toFixed(2)}
                </List.Content>
                <List.Content>
                  {item['name']}
                </List.Content>
              </List.Item>
            ))}
          </List>
          <Divider />
          <List>
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

  getButtonText = (isPaid: boolean) => {
    return isPaid ? "Paid" : "Unpaid"
  }

  postToggledTransaction = (id: string, isPaid: boolean) => {
    const body = {
      "_id": id,
      "paid": isPaid
    }
    API.post(`transactions/update`, body)
  }

  renderTransactions = (transactions: Transaction[], date: Moment,
    filter: string, filteredTransactions: Transaction[], update: () => void) => {
    this.getUserData(transactions)
    if (filter !== 'all') {
      transactions = filteredTransactions
    }
    return (
      <List relaxed animated selection divided>
        {this.renderList(transactions, date)}
      </List>
    )
  }


  render() {
    return (
      <TransactionContext.Consumer>
        {({ date, transactions, filter, filteredTransactions, update }) => (
          <React.Fragment>
            <Route exact path={`${this.props.pathName}`}>
              {this.renderTransactions(transactions, date, filter, filteredTransactions, update)}
            </Route>
          </React.Fragment>
        )}
      </TransactionContext.Consumer>
    )
  }
}

TransactionList.contextType = TransactionContext

export default TransactionList