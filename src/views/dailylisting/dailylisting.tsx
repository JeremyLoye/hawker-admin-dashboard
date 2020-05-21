import 'react-dates/initialize';
import React from "react";
import { Container, Transition, Dropdown, DropdownProps } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker } from 'react-dates';

import API from "../../components/axiosapi";

import { Listing } from "../../components/interfaces";

import { ListingContext } from "../../components/appcontexts";

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
      meal: string
      zone: string
    }
  }
}

class DailyListing extends React.Component<Props, State> {
  state = {
    focused: false,
    date: moment(this.props.match.params.date, "DDMMYYYY"),
    meal: this.props.match.params.meal,
    zone: this.props.match.params.zone,
    listing: null,
    visible: false,
    update: () => {
      this.props.history.push(`/dashboard/dailylisting/${this.state.date.format("DDMMYYYY")}/${this.state.meal}/${this.state.zone}`)
      this.setState({ visible: false })
      this.fetchListing(this.state.date, this.state.meal, this.state.zone).then((res: any) => {
        if (res['data'] == null) { 
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
    this.fetchListing(this.state.date, this.state.meal, this.state.zone).then((res: any) => {
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
      this.props.history.push(`/dashboard/dailylisting/${date.format("DDMMYYYY")}/${this.state.meal}/${this.state.zone}`)
      this.setState({ date })
      this.setState({ visible: false })
      this.fetchListing(date, this.state.meal, this.state.zone).then((res: any) => {
        if (res['data'] == null) { 
          this.setState({ listing: null })
        } else {
          this.setState({ listing: res['data'] })
        }
        this.setState({ visible: true })
      })
    }
  }

  onMealSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let mealString: any = data.value
    this.props.history.push(`/dashboard/dailylisting/${this.state.date.format("DDMMYYYY")}/${mealString}/${this.state.zone}`)
    this.setState({ meal: data.value })
    this.setState({ visible: false })
    this.fetchListing(this.state.date, mealString, this.state.zone).then((res: any) => {
      if (res['data'] == null) { 
        this.setState({ listing: null })
      } else {
        this.setState({ listing: res['data'] })
      }
      this.setState({ visible: true })
    })
  }

  onZoneSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let zoneString: any = data.value
    this.props.history.push(`/dashboard/dailylisting/${this.state.date.format("DDMMYYYY")}/${this.state.meal}/${zoneString}`)
    this.setState({ zone: data.value })
    this.setState({ visible: false })
    this.fetchListing(this.state.date, this.state.meal, zoneString).then((res: any) => {
      if (res['data'] == null) { 
        this.setState({ listing: null })
      } else {
        this.setState({ listing: res['data'] })
      }
      this.setState({ visible: true })
    })
  }

  fetchListing = (date: Moment, meal: string, zone: string) => {
    let promise: Promise<Listing> = API.get('/listings/get/' + date.format("DDMMYYYY") + "/" + meal + "/" + zone);
    return promise;
  }

  render() {
    let mealOptions = [
      {
        key: 'lunch',
        text: 'lunch',
        value: 'lunch'
      },
      {
        key: 'dinner',
        text: 'dinner',
        value: 'dinner'
      }
    ]

    let zoneOptions = [
      {
        key: 'Tembusu',
        text: 'Tembusu',
        value: 'Tembusu'
      },
      {
        key: 'Cinnamon',
        text: 'Cinnamon',
        value: 'Cinnamon'
      }
    ]

    return (
      <div>
          <p className="lead">
            Select stall for
            <Dropdown
            style={{"marginLeft": "5px"}}
            placeholder='Select Meals'
            compact
            selection
            defaultValue={this.state.meal}
            options={mealOptions}
            onChange={this.onMealSelect}
          /> at
          <Dropdown
            style={{"marginLeft": "5px"}}
            compact
            placeholder='Select Zone'
            selection
            defaultValue={this.state.zone}
            options={zoneOptions}
            onChange={this.onZoneSelect}
          /> on&nbsp;
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
           <StoreList pathName={this.props.match.url} meal={this.state.meal} zone={this.state.zone}/>
          </ListingContext.Provider>
          </div>
          </Transition>
      </div>
    );
  }
}

export default DailyListing