import React, { Component } from "react";

import './store.css';

type State = {};

type Props = {
    match: {
      path: string;
      url: string;
      params: {
          date: string
      }
    }
}

class Store extends Component<Props, State> {
  state = {};

  render() {
    return (
      <p>Under Construction</p>
    );
  }
}

export default Store;