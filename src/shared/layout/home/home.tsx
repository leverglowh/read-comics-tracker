import React from 'react';
import './home.scss';
import { Button } from 'reactstrap';
import { AUTH_TOKEN_KEY } from 'src/config/constans';

export interface IHomeProps {}
const Home: React.FC<IHomeProps> = (props) => {
  const goToLogin = () => {
    window.location.href = 'login';
  };
  // can also use isAuthenticated from authentication reducer, but it's story for another time
  const isLoggedIn =
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY);

  return (
    <div id='home-page'>
      welcome
      <br />
      this page is empty for now, click links on the toolbar
      &#8593;&#8593;&#8593;!!
      <br />
      {!isLoggedIn && (
        <>
          or here to{' '}
          <Button color='primary' type='button' onClick={goToLogin}>
            Login
          </Button>
        </>
      )}
    </div>
  );
};

export default Home;
