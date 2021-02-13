import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
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
import { register } from 'src/shared/reducers/authentication';

import './login.scss';
import { AUTH_TOKEN_KEY } from 'src/config/constans';

export interface IregisterModalProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps {}

const RegisterModal: React.FC<IregisterModalProps> = (props) => {
  const [registerData, setregisterData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  useEffect(() => {
    if (
      sessionStorage.getItem(AUTH_TOKEN_KEY) !== null ||
      localStorage.getItem(AUTH_TOKEN_KEY) !== null
    ) {
      props.history.push('/');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setInvalidPassword(false);
    setInvalidUsername(false);
    setInvalidEmail(false);
    setregisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    props.history.push('/');
  };

  const handleSubmit = () => {
    const { username, password, email } = registerData;
    if (!username) {
      setInvalidUsername(true);
      return;
    }
    if (!password) {
      setInvalidPassword(true);
      return;
    }
    if (!email) {
      setInvalidEmail(true);
      return;
    }
    props.register(username, password, email);
  };

  useEffect(() => {
    if (props.registerSuccess) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(props.idToken));
      setTimeout(() => handleClose(null), 1000);
    }
  }, [props.registerError, props.registerSuccess]);

  return (
    <Modal
      isOpen
      toggle={handleClose}
      backdrop
      id='register-modal'
      autoFocus={false}
    >
      <Form id='register-form' onSubmit={handleSubmit}>
        <ModalHeader id='register-title' toggle={handleClose}>
          Register
        </ModalHeader>
        <ModalBody>
          {props.registerError ? (
            <Alert color='danger'>
              <strong>Register error</strong>
            </Alert>
          ) : props.registerSuccess ? (
            <Alert color='success'>
              <strong>register success!</strong>
              <br />
              Redirecting to homepage.
            </Alert>
          ) : null}
          <FormGroup>
            <Label for='register-username'>Username</Label>
            <Input
              autoFocus
              type='text'
              name='username'
              id='register-username'
              placeholder='username'
              invalid={invalidUsername}
              value={registerData.username}
              onChange={handleInputChange}
            />
            <FormFeedback>Should not be empty</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for='register-password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='register-password'
              placeholder='password'
              invalid={invalidPassword}
              value={registerData.password}
              onChange={handleInputChange}
            />
            <FormFeedback>Should not be empty</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for='register-email'>Email</Label>
            <Input
              type='email'
              name='email'
              id='register-email'
              placeholder='email'
              invalid={invalidEmail}
              value={registerData.email}
              onChange={handleInputChange}
            />
            <FormFeedback>Should not be empty</FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            type='button'
            color='secondary'
            onClick={handleClose}
            tabIndex={1}
            disabled={props.registerSuccess}
          >
            Cancel
          </Button>{' '}
          <Button
            color='primary'
            type='button'
            onClick={handleSubmit}
            disabled={props.registerSuccess}
          >
            Register
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  idToken: authentication.idToken,
  user: authentication.user,
  registerError: authentication.loginError,
  registerSuccess: authentication.loginSuccess,
});

const mapDispatchToProps = { register };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterModal)
);
