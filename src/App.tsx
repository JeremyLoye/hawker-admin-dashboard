import * as React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
/** Components */
import AppRouter from './navigation/routes';

import './App.css';

Amplify.configure(aws_exports);

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default withAuthenticator(App);