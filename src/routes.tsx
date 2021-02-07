import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginModal from './shared/layout/home/login-modal';
import Logout from './shared/layout/home/logout';
import RegisterModal from './shared/layout/home/register-modal';
import Home from './shared/layout/home/home';
import ConnectPage from './shared/auth/connect/connect-page';

import Character from 'src/entities/character/character';
import Series from 'src/entities/series/index';

const Routes = () => (
  <div id='route-container'>
    <Switch>
      <Route exact path={['/', '/login', '/register']}>
        <Home />
      </Route>
      <Route path='/logout'>
        <Logout />
      </Route>
      <Route path='/register'>
        <RegisterModal />
      </Route>
      <Route exact path='/connect/:provider'>
        <ConnectPage />
      </Route>
      <Route exact path='/characters'>
        <Character />
      </Route>
      <Route path='/series' component={Series} />
    </Switch>
      <Route path='/login'>
        <LoginModal />
      </Route>
  </div>
);

export default Routes;
