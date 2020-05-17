import 'react-dates/initialize';
import React from "react";
import { Card, List } from 'semantic-ui-react'
import { Container, Header, Transition } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker } from 'react-dates';

import API from "../../components/axiosapi";

import { Listing } from "../../components/interfaces";

import { ListingContext } from "../../components/listingcontex";

import StoreList from '../../components/storelist';

import 'react-dates/lib/css/_datepicker.css';

import "semantic-ui-css/semantic.min.css";

import './dailylisting.css';

type State = {}

type Props = RouteComponentProps & {
  match: {
    url: string
    params: {
      date: string
    }
  }
}

class DailyListing extends React.Component<Props, State> {
  state = {
    focused: false,
    date: moment(this.props.match.params.date, "DDMMYYYY"),
    listing: null,
    visible: false,
    update: () => {
      this.props.history.push(`/dashboard/dailylisting/${this.state.date.format("DDMMYYYY")}`)
      this.setState({ visible: false })
      this.fetchListing(this.state.date).then((res: any) => {
        if (res['data'] == null) { 
          console.log("Null set")
          this.setState({ listing: null })
        } else {
          this.setState({ listing: res['data'] })
        }
        this.setState({ visible: true })
      })
    }
  }

  componentDidMount() {
    this.setState({ date: moment(this.props.match.params.date, "DDMMYYYY") })
    this.fetchListing(this.state.date).then((res: any) => {
      if (res['data'] == null) { 
        this.setState({ listing: null })
      } else {
        this.setState({ listing: res['data'] })
      }
      this.setState({ visible: true })
    })
  }


  dateChange = (date: Moment) => {
    if (this.state.date.format("DDMMYYYY") !== date.format("DDMMYYYY")) {
      this.props.history.push(`/dashboard/dailylisting/${date.format("DDMMYYYY")}`)
      this.setState({ date })
      this.setState({ visible: false })
      this.fetchListing(date).then((res: any) => {
        if (res['data'] == null) { 
          console.log("Null set")
          this.setState({ listing: null })
        } else {
          this.setState({ listing: res['data'] })
        }
        this.setState({ visible: true })
      })
    }
  }

  fetchListing = (date: Moment) => {
    let promise: Promise<Listing> = API.get('/listings/' + date.format("DDMMYYYY"));
    return promise;
  }

  render() {
    return (
      <div>
        <Container text textAlign="center">
          <p className="lead">
            Select Date to edit:
          <SingleDatePicker
              id="1"
              orientation="horizontal"
              anchorDirection="right"
              date={this.state.date}
              onDateChange={(date) => { if (date) { this.dateChange(date) } }}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              numberOfMonths={1}
              displayFormat="DD/MM/YYYY"
              small={true}>
            </SingleDatePicker>
          </p>
          <Transition visible={this.state.visible} animation='scale' duration={500}>
          <div>
          <ListingContext.Provider value={this.state}>
           <StoreList pathName={this.props.match.url}/>
          </ListingContext.Provider>
          </div>
          </Transition>
        </Container>
      </div>
    );
  }
}

export default DailyListing