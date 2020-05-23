import 'react-dates/initialize';
import React from "react";
import { Card, DropdownProps, Button, Header, Grid, Radio, CheckboxProps, CardProps, Popup } from 'semantic-ui-react'
import { Dropdown } from "semantic-ui-react";
import { Link, Route } from 'react-router-dom';
import moment, { Moment } from 'moment';

import API from './axiosapi';

import 'react-dates/lib/css/_datepicker.css';
import { Listing, Stall } from './interfaces';
import { ListingContext } from './appcontexts';
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
  meal: string;
  zone: string;
}

type State = {
  hawkerCodes: HawkerCode[];
  hawker: string;
  meal: string;
  zone: string;
  isAvailable: boolean;
}

class StoreList extends React.Component<Props, State> {
  state = {
    hawkerCodes: [],
    hawker: '',
    meal: this.props.meal,
    zone: this.props.zone,
    isAvailable: true
  }

  changeChecked = (isAvail: boolean) => {
    this.forceUpdate();
  }

  renderCards = (listing: Listing, date: Moment) => {
    return listing.stalls.map((stall: Stall) => (
      <Popup
        content={"Stall set to not available for this day"}
        disabled={stall.available}
        inverted
        on='click'
        key={`${stall.stallId}`}
        trigger={
          <Card
            as={Link}
            to={`${this.props.pathName}/stall/${stall.stallId}`}
            key={stall.stallId + " " + date.format("DDMMYYYY")}
            childKey={stall.stallId + " " + date.format("DDMMYYYY")}
            image={stall.image}
            header={stall.name}
            meta={stall.stallId}
            fluid={true}
            onClick={
              (event: React.MouseEvent<HTMLElement>, data: CardProps) => {
                if (!stall.available) {
                  event.preventDefault();
                }
              }
            }
            extra={
              <Radio
                key={stall.stallId + " " + date.format("DDMMYYYY")}
                label="Availability"
                checked={stall.available}
                toggle
                floated="right"
                onChange={
                  async (event: React.FormEvent<HTMLElement>, data: CheckboxProps) => {
                    event.preventDefault();
                    let stallId = stall.stallId;
                    let isAvailable: any = data.checked;
                    stall.available = isAvailable;
                    this.changeChecked(isAvailable)
                    let body = {
                      "stallId": stallId,
                      "available": isAvailable,
                      "meal": this.state.meal,
                      "zone": this.state.zone
                    }
                    await API.post(`/listings/${date.format("DDMMYYYY")}/availability`, body)
                  }
                }
              />} />
        }
      />
    ))
  }

  componentDidMount() {
  console.log("Post hawker code")
  API.get('/hawkercodes').then((res: any) => {
      const codes: HawkerCode[] = res['data'];
      this.setState({ hawkerCodes: codes })
    })
  }

  postHawkerChoice = async (date: Moment, meal: string, zone: string) => {
    const body = {
      "code": this.state.hawker,
      "meal": meal,
      "zone": zone
    }
    await API.post(`/listings/${date.format("DDMMYYYY")}/add`, body)
  }

  deleteHawkerChoice = async (date: Moment, meal: string, zone: string) => {
    await API.post(`/listings/${date.format("DDMMYYYY")}/${meal}/${zone}/delete`)
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
    let options: Options[] = [];
    this.state.hawkerCodes.map((hawkerCode: HawkerCode) => {
      options.push({
        key: hawkerCode.code,
        text: hawkerCode.name,
        value: hawkerCode.code
      })
    });
    return (
      <Dropdown
        placeholder='Select Hawker Centre'
        fluid
        className="huge"
        selection
        options={options}
        onChange={this.onHawkerSelect}
      />
    )
  }

  renderListing = (listing: Listing | null, date: Moment, update: () => void, meal: string, zone: string) => {
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
              this.postHawkerChoice(date, meal, zone).then(res => update())
            }}>
            Select
          </Button>
        </React.Fragment>)
    } else {
      return (
        <React.Fragment>
          <Grid columns='two' fluid='true'>
            <Grid.Column width={11}>
              <Header floated='left'>{listing.name}</Header>

            </Grid.Column>
            <Grid.Column width={5}>
              <Button
                floated="right"
                onClick={() => {
                  this.deleteHawkerChoice(date, meal, zone).then(res => update())
                }}>
                X
              </Button>
            </Grid.Column>
          </Grid>
          <Card.Group itemsPerRow="2" stackable style={{ paddingTop: '2em' }}>
            {this.renderCards(listing!, date)}
          </Card.Group>
        </React.Fragment>
      )
    }
  }


  render() {
    return (
      <ListingContext.Consumer>
        {({ date, listing, update, meal, zone }) => (
          <React.Fragment>
            <Route exact path={`${this.props.pathName}`}>
              {this.renderListing(listing, date, update, meal, zone)}
            </Route>
            <Route path={`${this.props.pathName}/stall/:stallId`} render={(props) => <FoodList zone={this.state.zone} meal={this.state.meal} date={date} listing={listing!} {...props} />} />

          </React.Fragment>
        )}
      </ListingContext.Consumer>
    )
  }
}

StoreList.contextType = ListingContext

export default StoreList