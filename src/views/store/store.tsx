import React, { Component } from "react";
import API from '../../components/axiosapi';
import { Card, DropdownProps, Button, Header, Grid, Radio, Dropdown } from 'semantic-ui-react'
import UpdateStall from '../../components/updatestall';
import AddStall from '../../components/addstall'
import './store.css';

const operationOptions = [
  {
    key: "add",
    text: "Add New Stall",
    value: "add"
  },
  {
    key: "update",
    text: "Update/Delete Stall",
    value: "update"
  }
]

interface HawkerCode {
  code: string;
  name: string;
}

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
const emptyStall = {
  name: "",
  stallId: "",
  stallNo: "",
  location: "",
  image: "",
  food: [],
  about: {
    recommended: "",
    description: "",
    images: [],
    urls: []
  },
  contact: {},
  type: []
}

class Store extends Component<Props, State> {
  state = {
    hawkerOptions: [],
    stallOptions: [],
    hawkerCentre: "",
    stall: emptyStall,
    operation: "add",
    stallVisible: false
  };

  fetchHawkerCodes = () => {
    const promise: Promise<HawkerCode[]> = API.get('/hawkercodes');
    return promise;
  }

  fetchStallCodes = (hawkerCode: string) => {
    const promise: Promise<any[]> = API.get(`/stallcodes/${hawkerCode}`)
    return promise
  }

  fetchStall = (stallId: string) => {
    const promise: Promise<any[]> = API.get(`/stalls/${stallId}`)
    return promise
  }

  componentDidMount() {
    this.fetchHawkerCodes().then((res:any) => {
      const options: any = []
      res['data'].map((code: HawkerCode) => {
        options.push({
          key: code.code,
          text: `${code.name} (${code.code})`,
          value: code.code
        })
      })
      this.setState({hawkerOptions: options})
    })
  }

  onHawkerSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const hawkerCentre: any = data.value
    this.setState({hawkerCentre})
    this.fetchStallCodes(hawkerCentre).then((res: any) => {
      const stallOptions: any = []
      res['data']['stalls'].map((code: any) => {
        stallOptions.push({
          key: code.stallId,
          text: `#${code.stallNo} ${code.name}`,
          value: code.stallId
        })
      })
      this.setState({stallOptions, stallVisible: false, stall: emptyStall})
    })
  }

  onStallSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const stallId: any = data.value
    this.setState({stallVisible: false})
    this.fetchStall(stallId).then((res: any) => {
      this.setState({stall: res['data'], stallVisible: true})
    })
  }

  onOperationSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({operation: data.value})
  }

  renderUpdateStall() {
    return <UpdateStall stall={this.state.stall}/>
  }

  renderAddStall() {
    const templateStall = emptyStall
    templateStall['location'] = this.state.hawkerCentre
    return <AddStall stall={templateStall}/>
  }

  render() {
    return (
      <Grid columns='three' fluid>
        <Grid.Column>
          <Dropdown
            placeholder='Select Hawker Centre'
            fluid
            className="huge"
            selection
            options={this.state.hawkerOptions}
            onChange={this.onHawkerSelect}
          />
        </Grid.Column>
        <Grid.Column>
          <Dropdown
            placeholder='Select Operation'
            fluid
            className="huge"
            selection
            options={operationOptions}
            value={this.state.operation}
            onChange={this.onOperationSelect}/>
        </Grid.Column>
        <Grid.Column>
          {this.state.stallOptions.length !== 0  && this.state.operation !== "add" ?
            <Dropdown
              placeholder='Select Stall'
              fluid
              className="huge"
              selection
              options={this.state.stallOptions}
              onChange={this.onStallSelect}
            /> : <p></p> }
        </Grid.Column>
        {this.state.stallVisible && this.state.operation === "update" ? this.renderUpdateStall() : "" }
        {this.state.operation === "add" && this.state.hawkerCentre !== "" ? this.renderAddStall(): ""}
      </Grid>
    );
  }
}

export default Store;