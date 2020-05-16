import React from "react";

import moment from 'moment';

import { Listing } from "./interfaces";

const listing: Listing | null = null;

export const ListingContext = React.createContext({
  focused: false,
  date: moment(),
  listing: listing,
  visible: false,
  update: () => {}
})