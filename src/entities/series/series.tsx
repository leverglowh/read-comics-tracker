import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/shared/reducers';
import { getEntities as getSeriesList } from 'src/entities/series/series.reducer';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SingleSeriesCard from './components/series-card';
import './series.scss';

export interface ISeriesProps extends StateProps, DispatchProps {}

const Series: React.FC<ISeriesProps> = (props) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (searchText) props.getSeriesList(searchText);
  };

  const handleKeyPress = (e) => {
    e.persist();
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className='search-div'>
        <Form.Control
          onChange={handleSearchTextChange}
          autoComplete='off'
          value={searchText}
          onKeyPress={handleKeyPress} />
        &nbsp;
        <Button type='submit' variant='secondary' onClick={handleSearch}>
          <FontAwesomeIcon icon='search' />
        </Button>
      </div>
      <div id="series-page-body">
        {props.loading && (
          <div className='loading-section'>
            <Spinner style={{ width: '2rem', height: '2rem' }} animation='grow' />
          </div>
        )}
        {props.seriesList?.map((series) => (
          <SingleSeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = ({ series }: IRootState) => ({
  seriesList: series.entities,
  loading: series.loading,
});

const mapDispatchToProps = {
  getSeriesList,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(Series);
