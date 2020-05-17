import React, { Component } from "react";
import API from '../../components/axiosapi';
import { Input, Form, DropdownProps, Button, Header, Grid, Radio, Dropdown } from 'semantic-ui-react'

import './hawker.css';

type State = {};

interface HawkerCode {
  code: string;
  name: string;
}

class Hawker extends Component<State> {
  state = {
    hawkerOptions: [],
    operation: "update",
    hawker: {
      name: "",
      code: "",
      address: "",
      image: "",
    }
  };

  fetchHawkerCodes = () => {
    const promise: Promise<HawkerCode[]> = API.get('/hawkercodes');
    return promise;
  }

  fetchHawkerInfo = (hawkerCode: string) => {
    const promise: Promise<any> = API.get(`/hawkers/${hawkerCode}`);
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
    this.fetchHawkerInfo(hawkerCentre).then((res)=>{
      this.setState({hawker: res['data']})
    })
  }

  handleHawkerNameChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let hawker = this.state.hawker
    this.setState({hawker})
}

  render() {
    return (
      <React.Fragment>
        <Dropdown
          placeholder='Select Hawker Centre'
          fluid
          className="huge"
          selection
          options={this.state.hawkerOptions}
          onChange={this.onHawkerSelect}/>
          <Form.Group>
            <Form.Field
              value={this.state.hawker.name}
              control={Input}
              label="Hawker Centre Name"
              onChange={this.handleHawkerNameChange}/>
          </Form.Group>
      </React.Fragment>
      
    );
  }
}

export default Hawker;