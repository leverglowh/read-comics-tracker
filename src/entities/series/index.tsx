import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Series from './series';
import SeriesModal from './series-modal';

const Routes = ({ match }) => (
  <>
    <Route path={match.url} component={Series} />
    <Switch>
      <Route path={`${match.url}/:id`} children={<SeriesModal />} />
    </Switch>
  </>
);

export default Routes;
