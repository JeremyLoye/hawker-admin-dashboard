import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from '../views/dashboard/dashboard';


class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
          <Route path="/dashboard" render={(props) => <Dashboard {...props}/>}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default AppRouter;