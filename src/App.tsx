import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import Routes from './routes';

import { loadIcons } from './config/icon-loader';
import Header from './shared/layout/header/header';
import { saveItemToLocalStorage } from 'src/shared/util/general-utils';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {
  useEffect(() => {
    console.log('hello');
    let key = localStorage.getItem('PRIVATE_API_KEY');
    if (key) return;
    const regex = /^[a-z0-9]+$/;
    while (!key) {
      key = prompt('Need API KEY');
      if (!key || key.length < 40 || !regex.test(key)) key = null;
    }
    saveItemToLocalStorage('PRIVATE_API_KEY', key);
  }, []);

  loadIcons();

  return (
    <div className='App'>
      <Router>
        <Header />
        <Routes />
      </Router>
    </div>
  );
}

export default connect()(App);
