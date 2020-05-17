import 'react-dates/initialize';
import React from "react";
import { Card, DropdownProps, Button, Header, Grid, Radio, CheckboxProps } from 'semantic-ui-react'
import { Dropdown } from "semantic-ui-react";
import { Link, Route } from 'react-router-dom';
import moment, { Moment } from 'moment';

import API from './axiosapi';

import 'react-dates/lib/css/_datepicker.css';
import { Listing, Stall } from './interfaces';
import { ListingContext } from './listingcontex';
import FoodList from './foodlist';

interface HawkerCode {
  code: string;
  name: string;
}

interface Options {
  key: string;
  text: string;
  value: string;
}

type Props = {
  pathName: string;
}

type State = {
  hawkerCodes: HawkerCode[];
  hawker: string;
  meal: string;
}

class StoreList extends React.Component<Props, State> {
  state = {
    hawkerCodes: [],
    hawker: '',
    meal: ''
  }

  setCheck = (isAvailable: boolean) => {
    console.log(isAvailable)
    return isAvailable
  }


  renderCards = (listing: Listing, date: Moment) => {
    console.log(listing)
    return listing.stalls.map((stall: Stall) => (
      <Card
        as={Link}
        to={`${this.props.pathName}/stall/${stall.stallId}`}
        key={stall.stallId + " " + date.format("DDMMYYYY")}
        childKey={stall.stallId + " " + date.format("DDMMYYYY")}
        image={stall.image}
        header={stall.name}
        meta={stall.stallId}
        fluid={true}
        extra={
        <Radio
        key={stall.stallId + " " + date.format("DDMMYYYY")}
        label="Availability"
        checked={this.setCheck(stall.available)}
        toggle
        floated="right"
        onChange={
          async (event: React.FormEvent<HTMLElement>, data: CheckboxProps) => {
            event.preventDefault();
            let stallId = stall.stallId;
            let isAvailable: any = data.checked;
            let body = {
              "stallId": stallId,
              "available": isAvailable
            }
            console.log(body)
            await API.post(`/listings/${date.format("DDMMYYYY")}/availability`, body)
          }
        }
        />} />
    ))
  }

  fetchHawkerCodes = () => {
    const promise: Promise<HawkerCode[]> = API.get('/hawkercodes');

    return promise;
  }

  postHawkerChoice = async (date: Moment) => {
    const body = {
      "code": this.state.hawker,
      "meal": this.state.meal
    }
    await API.post(`/listings/${date.format("DDMMYYYY")}/add`, body)
  }

  deleteHawkerChoice = async (date: Moment) => {
    await API.post(`/listings/${date.format("DDMMYYYY")}/delete`)
  }

  onHawkerSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let value: any = data.value;
    this.setState({ hawker: value })
  }

  onMealSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let value: any = data.value;
    this.setState({ meal: value })
  }

  renderDropDownSelection = () => {
    this.fetchHawkerCodes().then((res: any) => {
      const codes: HawkerCode[] = res['data'];
      this.setState({ hawkerCodes: codes })
    })
    let options: Options[] = [];
    this.state.hawkerCodes.map((hawkerCode: HawkerCode) => {
      options.push({
        key: hawkerCode.code,
        text: hawkerCode.name,
        value: hawkerCode.code
      })
    });
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
    return (
      <Grid columns='two' fluid>
        <Grid.Column>
        <Dropdown
          placeholder='Select Hawker Centre'
          fluid
          className="huge"
          selection
          options={options}
          onChange={this.onHawkerSelect}
        />
        </Grid.Column>
        
        <Grid.Column>
        <Dropdown
          placeholder='Select Meals'
          fluid
          className="huge"
          selection
          options={mealOptions}
          onChange={this.onMealSelect}
        />
        </Grid.Column>
      </Grid>
    )
  }

  renderListing = (listing: Listing | null, date: Moment, update: () => void) => {
    if (listing == null) {
      return (
        <React.Fragment>
          {this.renderDropDownSelection()}
          <Button
            size="huge"
            disabled={
              this.state.hawker === '' ||
              this.state.meal === ''
            }
            onClick={() => {
              this.postHawkerChoice(date).then(res => update())
            }}>
            Select
          </Button>
        </React.Fragment>)
    } else {
      return (
        <React.Fragment>
          <Header>{listing.name}</Header>
          <Button
            className="crossBtn"
            floated="right"
            onClick={() => {
              this.deleteHawkerChoice(date).then(res => update())
            }}>
            X
          </Button>
          <Card.Group itemsPerRow="2" stackable>
            {this.renderCards(listing!, date)}
          </Card.Group>
        </React.Fragment>
      )
    }
  }


  render() {
    return (
      <ListingContext.Consumer>
        {({ focused, date, listing, visible, update }) => (
          <React.Fragment>
            <Route exact path={`${this.props.pathName}`}>
              {this.renderListing(listing, date, update)}
            </Route>
            <Route path={`${this.props.pathName}/stall/:stallId`} render={(props) => <FoodList listing={listing!} {...props} />} />

          </React.Fragment>
        )}
      </ListingContext.Consumer>
    )
  }
}

StoreList.contextType = ListingContext

export default StoreList