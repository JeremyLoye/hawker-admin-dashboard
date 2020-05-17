import React from 'react';
import { Card, Image } from 'semantic-ui-react'
import { Tab, Label, Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import { Food, Listing } from './interfaces';

type Props = {
  listing: Listing;
  match: {
    params: {
      stallId: string;
    }
  }
}

class FoodList extends React.Component<Props> {

  displayListPosts = () => {
    let stall;
    for (let el of this.props.listing.stalls) {
      if (el.stallId === this.props.match.params.stallId) {
        stall = el;
        break;
      }
    }
    return (
      stall?.food.map((el: Food) => (
        <Card
          image={el.image}
          header={el.name}
          meta={`$${el.price.toFixed(2)}`}
          description={el.description}
          extra={`Quantity:${el.quantity}`}
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