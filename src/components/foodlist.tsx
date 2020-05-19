import React from 'react';
import { Card, Image, Input, GridColumn, ButtonProps, InputOnChangeData, Popup } from 'semantic-ui-react'
import { Tab, Label, Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import { Food, Listing, Stall } from './interfaces';

import API from './axiosapi';
import { Moment } from 'moment';

type Props = {
  listing: Listing;
  date: Moment;
  match: {
    params: {
      stallId: string;
    }
  }
}

class FoodList extends React.Component<Props> {

  displayListPosts = () => {
    let stall: Stall = this.props.listing.stalls[0] // Dummy value
    for (let el of this.props.listing.stalls) {
      if (el.stallId === this.props.match.params.stallId) {
        stall = el;
        break;
      }
    }
    return (
      stall.food.map((el: Food) => (
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
                    placeholder={`${el.quantity}`}
                    onChange={
                      (event: React.FormEvent<HTMLInputElement>, data: InputOnChangeData) => {
                        console.log(data.value)
                        let quantity = Number(data.value)
                        el.quantity = quantity
                      }
                    }
                  >
                    <input type='number' min={-1} max={999}/>
                    <Popup
                      content={`The quantity has been successfully change to ${el.quantity}.`}
                      inverted
                      on='click'
                      key={`${el.id}`}
                      trigger={
                        <Button
                          icon='right arrow'
                          onClick={
                            (event: React.FormEvent<HTMLButtonElement>, data: ButtonProps) => {
                              const body = {
                                "stallId": stall.stallId,
                                "foodId": el.id,
                                "quantity": el.quantity
                              }
                              API.post(`listings/${this.props.date.format("DDMMYYYY")}/quantity`, body)
                              this.forceUpdate()
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

  render() {
    return (
      <React.Fragment>
        <Container text textAlign="center">
          <Card.Group itemsPerRow="2" stackable>
            {this.displayListPosts()}
          </Card.Group>
        </Container>
      </React.Fragment>
    )
  }
}

export default FoodList