import React from 'react';
import { Card, Image, Input, GridColumn, ButtonProps, InputOnChangeData, Popup } from 'semantic-ui-react'
import { Tab, Label, Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import { Food, Listing, Stall } from './interfaces';

import API from './axiosapi';
import { Moment } from 'moment';

type Props = {
  listing: Listing;
  date: Moment;
  meal: string;
  zone: string;
  match: {
    params: {
      stallId: string;
    }
  }
}

type State = {}

class FoodList extends React.Component<Props, State> {
  state = {
    minQuantity: 0,
    minAmount: 0,
    currentMinAmount: -1,
    currentMinQuantity: -1,
    stall: this.props.listing.stalls[0] // Dummy value
  }

  componentDidMount() {
    let stall: Stall = this.props.listing.stalls[0] // Dummy value
    for (let el of this.props.listing.stalls) {
      if (el.stallId === this.props.match.params.stallId) {
        stall = el;
        break;
      }
    }
    this.setState({ 
      stall: stall,
      minQuantity: stall.minQty,
      minAmount: stall.minPrice
     })
  }

  displayListPosts = () => {
    
    return (
      this.state.stall.food.map((el: Food) => (
        <Card
          image={el.image}
          header={el.name}
          meta={`$${el.price.toFixed(2)}`}
          description={el.description}
          extra={
            <React.Fragment>
              <p>Quantity: </p>
              <Popup
                content={'Key in quantity of food for the day. "-1" indicates no limit.'}
                key={`${el.id}`}
                trigger={
                  <Input
                    style={{ height: '2em', width: '5em' }}
                    type='text'
                    defaultValue={`${el.quantity}`}
                    onChange={
                      (event: React.FormEvent<HTMLInputElement>, data: InputOnChangeData) => {
                        let quantity = Number(data.value)
                        el.quantity = quantity
                      }
                    }
                  >
                    <input type='number' min={-1} max={999} />
                    <Popup
                      content={"The quantity has been successfully changed."}
                      inverted
                      on='click'
                      key={`${el.id}`}
                      trigger={
                        <Button
                          icon='right arrow'
                          onClick={
                            (event: React.FormEvent<HTMLButtonElement>, data: ButtonProps) => {
                              if (Number.isInteger(el.quantity)) {
                                const body = {
                                  "stallId": this.state.stall.stallId,
                                  "foodId": el.id,
                                  "quantity": el.quantity,
                                  "meal": this.props.meal,
                                  "zone": this.props.zone
                                }
                                API.post(`listings/${this.props.date.format("DDMMYYYY")}/quantity`, body)
                                this.forceUpdate()
                              }
                            }
                          }
                        />
                      }
                    />
                  </Input>
                }
              />
            </React.Fragment>
          }
          fluid={true}
        />
      ))
    )
  }

  popupMessage = () => {
    if (Number.isInteger(this.state.currentMinQuantity)) {
      return "The quantity has been successfully changed."
    } else {
      return "Please enter a valid integer."
    }
  }

  displayMinimumOrder = () => {
    return (
      <Grid columns='two' fluid='true'>
        <GridColumn>
          <Header as='h4'>Minimum Order:</Header>
          <Input
            style={{ height: '2em', width: '5em' }}
            type='text'
            defaultValue={`${this.state.minAmount}`}
            onChange={
              (event: React.FormEvent<HTMLInputElement>, data: InputOnChangeData) => {
                let amount = Number(data.value)
                this.setState({ currentMinAmount: amount })
              }
            }
          >
            <input type='number' step="0.01" min={0} max={999} />
            <Popup
              content={`The minimum amount has been successfully changed.`}
              inverted
              on='click'
              key={'minAmount'}
              trigger={
                <Button
                  disabled={this.state.currentMinAmount === -1}
                  icon='right arrow'
                  onClick={
                    (event: React.FormEvent<HTMLButtonElement>, data: ButtonProps) => {
                      const body = {
                        "date": this.props.date.format("DDMMYYYY"),
                        "minPrice": this.state.currentMinAmount,
                        "stallId": this.props.match.params.stallId,
                        "meal": this.props.meal,
                        "zone": this.props.zone
                      }
                      console.log(body)
                      API.post(`listings/minprice`, body).then(res => console.log(res))
                      this.setState({ minAmount: this.state.currentMinAmount })
                    }
                  }
                />
              }
            />
          </Input>
        </GridColumn>

        <GridColumn>
          <Header as='h4'>Minimum Quantity:</Header>
          <Input
            style={{ height: '2em', width: '5em' }}
            type='text'
            defaultValue={`${this.state.minQuantity}`}
            onChange={
              (event: React.FormEvent<HTMLInputElement>, data: InputOnChangeData) => {
                let quantity = Number(data.value)
                this.setState({ currentMinQuantity: quantity })
              }
            }
          >
            <input type='number' min={0} max={999} />
            <Popup
              content={this.popupMessage()}
              inverted
              on='click'
              key={'minQuantity'}
              trigger={
                <Button
                  disabled={this.state.currentMinQuantity === -1}
                  icon='right arrow'
                  onClick={
                    (event: React.FormEvent<HTMLButtonElement>, data: ButtonProps) => {
                      
                      if (Number.isInteger(this.state.currentMinQuantity)) {
                        const body = {
                          "date": this.props.date.format("DDMMYYYY"),
                          "minQty": this.state.currentMinQuantity,
                          "stallId": this.props.match.params.stallId,
                          "meal": this.props.meal,
                          "zone": this.props.zone
                        }
                        API.post(`listings/minqty`, body).then(res => console.log(res))
                        this.setState({ minQuantity: this.state.currentMinQuantity })
                      }
                    }
                  }
                />
              }
            />
          </Input>
        </GridColumn>
      </Grid>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Container text textAlign="center">
          <Header>{this.props.match.params.stallId}</Header>
          {this.displayMinimumOrder()}
          <Card.Group itemsPerRow="2" stackable>
            {this.displayListPosts()}
          </Card.Group>
        </Container>
      </React.Fragment>
    )
  }
}

export default FoodList