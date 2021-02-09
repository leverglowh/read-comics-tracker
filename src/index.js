import React, { Suspense } from 'react';
import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import loggerMiddleware from 'src/config/logger-middleware';
import rootReducer from 'src/shared/reducers/index';
import 'src/config/axios-interceptor';

import Spinner from 'react-bootstrap/Spinner';

import App from './App';

import './index.css';

const store = createStore(
  rootReducer,
  compose(applyMiddleware(loggerMiddleware, promiseMiddleware))
);

ReactDOM.render(
  <React.Fragment>
    <Suspense
      fallback={
        <div>
          <Spinner style={{ color: 'lightgray' }} />
        </div>
      }
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
