import React from "react";
import { List, Container, Loader } from "semantic-ui-react";
import API from '../../components/axiosapi'

class NewUsersPage extends React.Component {

    state = {
        users: [],
        loaded: false
    }

    componentDidMount() {
        API.get('/users/new').then(res=>{
            this.setState({users:res.data['users'], loaded: true})
        })
    }

    render() {
        if (this.state.loaded) {
            return (
                <Container textAlign="left">
                    <p className="lead">
                        The list displays all new users since 23rd May who have made <strong>0</strong> orders
                    </p>
                    <List divided relaxed>
                        {this.state.users.map((user) => {
                            return (
                                <List.Item>
                                    <List.Content>
                                        <List.Header>
                                            {user['name']}
                                        </List.Header>
                                        <List.Description>
                                            Phone number: {user['phone']}
                                        </List.Description>
                                        <List.Description>
                                            Email: {user['email']}
                                        </List.Description>
                                        <List.Description>
                                            Join Date: {user['dateJoined']}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            )
                        })}
                    </List>
                </Container>
            )
        } else {
            return <div><Loader style={{backgroundColor: "white"}} active>Loading</Loader></div>
        }
        
    }
}

export default NewUsersPage