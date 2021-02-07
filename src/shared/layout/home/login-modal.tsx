import React, { useEffect, useState } from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Modal,
  Form,
  ModalHeader,
  ModalBody,
  Alert,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  ModalFooter,
  Button,
} from 'reactstrap';

import { IRootState } from 'src/shared/reducers';
import { login } from 'src/shared/reducers/authentication';
import { strapiUrl } from 'src/shared/reducers/api-urls';

import './login.scss';

export interface ILoginModalProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps {}

const LoginModal: React.FC<ILoginModalProps> = (props) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const AUTH_TOKEN_KEY = 'mcread-authenticationToken';

  useEffect(() => {
    if (
      sessionStorage.getItem('mcread-authenticationToken') !== null ||
      localStorage.getItem('mcread-authenticationToken') !== null
    ) {
      props.history.push('/');
    }
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setInvalidPassword(false);
    setInvalidUsername(false);
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setLoginData({
      ...loginData,
      rememberMe: e.target.checked,
    });
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    props.history.push('/');
  };

  const handleSubmit = () => {
    const { username, password } = loginData;
    if (!username) {
      setInvalidUsername(true);
      return;
    }
    if (!password) {
      setInvalidPassword(true);
      return;
    }
    props.login(username, password);
  };

  const loginGoogle = () => {
    window.location.href = strapiUrl + 'connect/google';
  };

  const loginDiscord = () => {
    window.location.href = strapiUrl + 'connect/discord';
  };

  useEffect(() => {
    if (props.loginSuccess) {
      if (loginData.rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, props.idToken);
      } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, props.idToken);
      }

      setTimeout(() => handleClose(null), 1000);
    }
  }, [props.loginError, props.loginSuccess]);

  return (
    <Modal
      isOpen
      toggle={handleClose}
      backdrop
      id='login-modal'
      autoFocus={false}
    >
      <Form id='login-form' onSubmit={handleSubmit}>
        <ModalHeader id='login-title' toggle={handleClose}>
          Login
        </ModalHeader>
        <ModalBody>
          <div className='pre-login-form'>
            <div className='providers'>
              <img
                id='login-google'
                onClick={loginGoogle}
                style={{ width: 191, height: 46 }}
                src={`${process.env.PUBLIC_URL}/providers/google.png`}
                alt='login with google'
              />
              <img
                id='login-discord'
                onClick={loginDiscord}
                style={{ width: 191, height: 46 }}
                src={`${process.env.PUBLIC_URL}/providers/discord.png`}
                alt='login with discord'
              />
            </div>
            <div className='text-or'>or</div>
          </div>
          {props.loginError ? (
            <Alert color='danger'>
              <strong>Errore nel Login</strong> Per favore controlla le
              credenziali.
            </Alert>
          ) : props.loginSuccess ? (
            <Alert color='success'>
              <strong>Login success!</strong>
              <br />
              Redirecting to homepage.
            </Alert>
          ) : null}
          <FormGroup>
            <Label for='login-username'>Username</Label>
            <Input
              autoFocus
              type='text'
              name='username'
              id='login-username'
              placeholder='username'
              invalid={invalidUsername}
              value={loginData.username}
              onChange={handleInputChange}
            />
            <FormFeedback>Should not be empty</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for='login-password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='login-password'
              placeholder='password'
              invalid={invalidPassword}
              value={loginData.password}
              onChange={handleInputChange}
            />
            <FormFeedback>Should not be empty</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Input
              type='checkbox'
              name='rememberMe'
              id='login-remember-me'
              checked={loginData.rememberMe}
              onChange={handleRememberMeChange}
            />
            <Label id='login-remember-me-label' for='login-remember-me'>
              Remember me
            </Label>
          </FormGroup>
          {/*
          <Alert color="warning">
            <Link to="/reset/request">Hai dimenticato la tua password?</Link>
          </Alert>
          */}
          <Alert color='warning'>
            <span>Non sei ancora registrato?</span>{' '}
            <Link to='/register'>Registrati subito</Link>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button
            type='button'
            color='secondary'
            onClick={handleClose}
            tabIndex={1}
            disabled={props.loginSuccess}
          >
            Annulla
          </Button>{' '}
          <Button
            color='primary'
            type='button'
            onClick={handleSubmit}
            disabled={props.loginSuccess}
          >
            Login
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  idToken: authentication.idToken,
  user: authentication.user,
  loginError: authentication.loginError,
  loginSuccess: authentication.loginSuccess,
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginModal)
);
