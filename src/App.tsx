import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import Routes from './routes';

import Header from './shared/layout/header/header';
import { loadIcons } from './config/icon-loader';
import { updateCache } from './shared/util/api-utils';
import { ToastContainer } from 'react-toastify';
import { saveItemToLocalStorage } from 'src/shared/util/general-utils';

import './App.scss';

function App() {
  useEffect(() => {
    console.log('hello');
    let private_key = localStorage.getItem('PRIVATE_API_KEY');
    let public_key = localStorage.getItem('PUBLIC_API_KEY');
    const regex = /^[a-z0-9]+$/;
    if (!public_key) {
      while (!public_key) {
        public_key = prompt('Need API public key');
      }
      saveItemToLocalStorage('PUBLIC_API_KEY', public_key);
    }
    if (!private_key) {
      while (!private_key) {
        private_key = prompt('Need API private key');
        if (!private_key || private_key.length < 40 || !regex.test(private_key)) private_key = null;
      }
      saveItemToLocalStorage('PRIVATE_API_KEY', private_key);
    }

    updateCache();
  }, []);

  loadIcons();

  return (
    <div className='App'>
      <Router>
        <Header />
        <>
          <Routes />
          <ToastContainer
            position='top-left'
            autoClose={2000}
            progressClassName="toast-progress"
            bodyClassName="toast-body"
          />
        </>
      </Router>
    </div>
  );
}

export default connect()(App);
