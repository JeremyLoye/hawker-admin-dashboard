import * as React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
/** Components */
import AppRouter from './navigation/routes';

import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default withAuthenticator(App);