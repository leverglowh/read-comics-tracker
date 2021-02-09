import React, { useEffect } from 'react';
import './home.scss';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { IRootState } from 'src/shared/reducers';
import { getMySeries, reset } from 'src/entities/series/series.reducer';
import SingleSeriesCard from 'src/entities/series/components/series-card';
import { sortReadComicsByDate } from 'src/shared/util/general-utils';
import { ISeries } from 'src/shared/model/series.model';

export interface IHomeProps extends StateProps, DispatchProps {}
const Home: React.FC<IHomeProps> = (props) => {
  useEffect(() =>
     () => {
      props.reset();
    }
  , [])
  useEffect(() => {
    if (props?.me?.comics) {
      props.getMySeries(props.me.comics.sort(sortReadComicsByDate).map((c) => c.issues[0]).slice(0, 9));
    }
  }, [props.me]);

  const sortSereiesBasedOnReadOrder = (a: ISeries, b: ISeries) => {
    if (!props.me.comics) return 0;
    return props.me.comics.findIndex(e => e.series === a.id) - props.me.comics.findIndex(e => e.series === b.id);
  };

  const goToLogin = () => {
    window.location.href = 'login';
  };

  return (
    <div id='home-page'>
      {!props.isAuthenticated ? (
        <>
          or here to{' '}
          <Button variant='primary' type='button' onClick={goToLogin}>
            Login
          </Button>
        </>
      ) : (
        <>
        <h2>Last 10 read:</h2>
        <div id="home-page-body">
          {[...props.seriesList].sort(sortSereiesBasedOnReadOrder).map(s => (
            <SingleSeriesCard series={s} key={s.id}/>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ authentication, series }: IRootState) => ({
  me: authentication.user,
  isAuthenticated: authentication.isAuthenticated,
  seriesList: series.entities,
});

const mapDispatchToProps = {
  getMySeries,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
