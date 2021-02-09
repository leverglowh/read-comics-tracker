import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/shared/reducers';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

import { getMe } from 'src/shared/reducers/authentication';

import './header.scss';

export interface IHeaderProps extends StateProps, DispatchProps {}

const Header: React.FC<IHeaderProps> = (props) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  useEffect(() => {
    props.getMe();
  }, []);

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!isAccountMenuOpen);
  };

  return (
    <div id='header'>
      <Navbar bg='light' expand>
        <Navbar.Brand href='/'>ComicsREAD</Navbar.Brand>
        <Nav className='mr-auto' navbar>
          <Nav.Item>
            <Link className='nav-link' to='/characters'>
              Characters
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className='nav-link' to='/series'>
              Series
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className='nav-link' to='https://github.com/leverglowh/read-comics-tracker' target='_blank'>
              GitHub
            </Link>
          </Nav.Item>
          {/*
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Option 1
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                Reset
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          */}
        </Nav>
        <div className='header-float-right'>
          {props.isAuthenticated ? (
            <Dropdown navbar show={isAccountMenuOpen} onToggle={toggleAccountMenu}>
              <Dropdown.Toggle id={props.user.username}>{props.user.username}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link className='nav-link' to='/logout'>
                    logout
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div>
              <Link className='nav-link' to='/login'>
                login
              </Link>
            </div>
          )}
        </div>
        {/* <NavbarText>Simple Text</NavbarText> */}
      </Navbar>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  user: authentication.user,
  isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = {
  getMe,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
