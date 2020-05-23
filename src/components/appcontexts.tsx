import React from "react";

import moment from 'moment';

import { Listing, Transaction } from "./interfaces";

const listing: Listing | null = null;

export const ListingContext = React.createContext({
  focused: false,
  date: moment(),
  listing: listing,
  visible: false,
  meal: '',
  zone: '',
  update: () => {}
})

const transactions: Transaction[] = []

export const TransactionContext = React.createContext({
  focused: false,
  date: moment(),
  transactions: transactions,
  visible: false,
  filter: 'all',
  filteredTransactions: transactions,
  mealType: 'lunch',
  update: () => {}
})