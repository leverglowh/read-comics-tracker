import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/shared/reducers';
import { getEntities as getSeriesList } from 'src/entities/series/series.reducer';
import { Button, Card, CardBody, CardTitle, Input, Spinner } from 'reactstrap';
import { IMAGE_VARIANT } from 'src/shared/reducers/api-urls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

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
        <Input onChange={handleSearchTextChange} autoComplete='off' value={searchText} onKeyPress={handleKeyPress} />
        &nbsp;
        <Button type='submit' color='secondary' onClick={handleSearch}>
          <FontAwesomeIcon icon='search' />
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px 20px',
        }}
      >
        {props.loading && (
          <div className='loading-section'>
            <Spinner style={{ width: '2rem', height: '2rem' }} type='grow' />
          </div>
        )}
        {props.seriesList?.map((series) => (
          <Card className='single-char' key={series.id}>
            <CardTitle>
              <Link to={`series/${series.id}`}>
                <div>{series.title}</div>
              </Link>
            </CardTitle>
            <CardBody>
              <img
                width='100%'
                src={`${series.thumbnail?.path}/${IMAGE_VARIANT.LANDSCAPE.MEDIUM}.${series.thumbnail?.extension}`}
              />
              {series.description
                ? series.description.substring(0, 80).replace(/\w+$/, '') + '...'
                : 'No available description'}
            </CardBody>
          </Card>
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
