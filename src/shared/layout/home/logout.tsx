import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logout } from 'src/shared/reducers/authentication';

export interface ILogoutProps extends StateProps, DispatchProps {}

const Logout: React.FC<ILogoutProps> = (props) => {
  const [redirect, setRedirect] = useState(false);
  let id: NodeJS.Timeout;

  useEffect(() => {
    props.logout();
    id = setTimeout(() => setRedirect(true), 2000);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return <div className='p-5'>{redirect ? <Redirect to='/' /> : <h4>Logout success, redirecting..</h4>}</div>;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
