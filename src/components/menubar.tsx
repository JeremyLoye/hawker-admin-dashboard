import React, { Component } from 'react'

import { Button, Container, Grid, Icon, Menu } from 'semantic-ui-react';

import { Link } from "react-router-dom";

import moment, { Moment } from 'moment';

type State = {};

type Props = {
  pathName: string;
}

class SideMenu extends Component<Props, State> {
  state = {
    activeItem: 'dailylisting',
    dropdownMenuStyle: {
      display: "none"
    }
  };

  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };

  getCurrentDate = () => {
    return moment().format("DDMMYYYY");
  }

  render() {
    return (
      <div>
        <Grid padded className="tablet computer only">
          <Menu borderless fluid inverted size="huge">
            <Container>

              <Link to={`${this.props.pathName}/dailylisting/${this.getCurrentDate()}`}>
                <Menu.Item as='a' active={this.state.activeItem === 'dailylisting'}
                  onClick={() => this.setState({ activeItem: 'dailylisting' })}>
                  Daily Listing
                </Menu.Item>
              </Link>
              <Link to={`${this.props.pathName}/hawker`}>
                <Menu.Item as='a' active={this.state.activeItem === 'hawker'}
                  onClick={() => this.setState({ activeItem: 'hawker' })}>
                  Hawker
                </Menu.Item>
              </Link>

              <Link to={`${this.props.pathName}/store`}>
                <Menu.Item as='a' active={this.state.activeItem === 'store'}
                  onClick={() => this.setState({ activeItem: 'store' })}>
                  Stores
                </Menu.Item>
              </Link>
            </Container>
          </Menu>
        </Grid>
        <Grid padded className="mobile only">
          <Menu borderless fluid inverted size="huge">
            <Menu.Item header as="a" href="/">
              Hawker Deliveries
          </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  icon
                  inverted
                  basic
                  toggle
                  onClick={this.handleToggleDropdownMenu}
                >
                  <Icon name="content" />
                </Button>
              </Menu.Item>
            </Menu.Menu>
            <Menu
              borderless
              fluid
              inverted
              vertical
              style={this.state.dropdownMenuStyle}
            >
              <Link to={`${this.props.pathName}/dailylisting`}>
                <Menu.Item as="a">
                  Daily Listing
              </Menu.Item>
              </Link>
              <Link to={`${this.props.pathName}/hawker`}>
                <Menu.Item as="a">
                  Hawkers
              </Menu.Item>
              </Link>
              <Link to={`${this.props.pathName}/store`}>
                <Menu.Item as="a">
                  Stores
              </Menu.Item>
              </Link>
            </Menu>
          </Menu>
        </Grid>
      </div>
    )
  }
}

export default SideMenu;
