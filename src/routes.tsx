import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import LoginModal from './shared/layout/home/login-modal';
import Logout from './shared/layout/home/logout';
import RegisterModal from './shared/layout/home/register-modal';
import Home from './shared/layout/home/home';
import ConnectPage from './shared/auth/connect/connect-page';

import Character from 'src/entities/character/character';
import Series from 'src/entities/series/index';
import SeriesModal from 'src/entities/series/series-modal';

const RedirectToHome = () => <Redirect to="/home" />;

const Routes = () => (
  <div id='route-container'>
    <Switch>
      <Route exact path="/" component={RedirectToHome} />
      <Route exact path={['/home', '/home/series/:id', '/login', '/register']}>
        <Home />
      </Route>
      <Route path='/logout'>
        <Logout />
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
      <Route path='/register'>
        <RegisterModal />
      </Route>
      <Route path='/home/series/:id' exact>
        <SeriesModal />
      </Route>
  </div>
);

export default Routes;
