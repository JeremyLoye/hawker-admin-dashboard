import 'react-dates/initialize';
import React from "react";
import { Card, DropdownProps, Button } from 'semantic-ui-react'
import { Dropdown } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';

import API from './axiosapi';

import 'react-dates/lib/css/_datepicker.css';
import { Listing, Stall } from './interfaces';
import { ListingContext } from './listingcontex';

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
}

class StoreList extends React.Component<Props, State> {
  state = {
    hawkerCodes: [],
    hawker: ''
  }

  // componentDidMount() {
  //   this.fetchProducts(this.state.date).then( (res: any) => {
  //     const products: Product[] = res['data']['products']
  //     this.setState({ products })
  //     this.setState({ visible: true})
  //   })
  // }

  renderCards = (listing: Listing) => {
    return listing.stalls.map((stall: Stall) => (
      <Card
        as={Link}
        to={`${this.props.pathName}/stall/${stall.stallId}`}
        childKey={stall.stallId}
        header={stall.name}
        meta={stall.stallId}
        fluid={true}
        extra={"Availability:" + stall.available} />
    ))
  }

  fetchHawkerCodes = () => {
    const promise: Promise<HawkerCode[]> = API.get('/hawkercodes');

    return promise;
  }

  onChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let value: any = data.value;
    this.setState({ hawker: value })
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
    return (<Dropdown
      placeholder='Select Hawker Centre'
      fluid
      className="huge"
      selection
      options={options}
      onChange={this.onChange}
    />
    )
  }

  postHawkerChoice = async (date: Moment) => {
    console.log(this.state.hawker)
    const body = {
      "code": this.state.hawker,
      "meal": "lunch"
    }
    await API.post(`/listings/${date.format("DDMMYYYY")}/add`, body)
  }

  renderListing = (listing: Listing | null, date: Moment, update: () => void) => {
    if (listing == null) {
      return (
        <React.Fragment>
          {this.renderDropDownSelection()}
          <Button
            size="huge"
            onClick={() => {
              this.postHawkerChoice(date).then(res => update())
            }}>
            Select
          </Button>
        </React.Fragment>)
    } else {
      return (
      <Card.Group itemsPerRow="2" stackable>
        {this.renderCards(listing!)}
      </Card.Group>
      )
    }
  }


  render() {
    return (
      <ListingContext.Consumer>
        {({ focused, date, listing, visible, update }) => (
          <React.Fragment>
            <p>Here</p>
            {this.renderListing(listing, date, update)}
          </React.Fragment>
        )}
      </ListingContext.Consumer>
    )
  }

  // return (
  //   <div>

  //       <Transition visible={this.state.visible} animation='scale' duration={500}>
  //       <div>
  //       { this.state && this.state.products &&
  //        <Card.Group itemsPerRow="2" stackable>
  //        {this.renderCards()}
  //      </Card.Group>}
  //       </div>
  //       </Transition>
  //     </Container>
  //   </div>
  // );

}

StoreList.contextType = ListingContext

export default StoreList