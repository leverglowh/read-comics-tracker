import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/shared/reducers';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import { updateUser } from 'src/shared/reducers/authentication';
import { getEntity as getSeriesById } from 'src/entities/series/series.reducer';
import { IMAGE_VARIANT } from 'src/shared/reducers/api-urls';
import { ISeries } from 'src/shared/model/series.model';

export interface ISeriesModalProps extends StateProps, DispatchProps {}

const SeriesModal: React.FC<ISeriesModalProps> = (props) => {
  const [selectedSeries, setSelectedSeries] = useState<ISeries>();
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams() as any;
  const history = useHistory();
  const [readList, setReadList] = useState(props.me.comics?.find(s => s.series === Number(id))?.issues || []);
  const goBack = () => {
    history.goBack();
  };

  if (!Number(id)) {
    alert('Error');
    goBack();
  }

  useEffect(() => {
    const series = props.seriesList?.find((s) => s.id === Number(id));
    if (!series) {
      props.getSeriesById(Number(id));
    } else {
      setSelectedSeries(series);
    }
  }, []);

  useEffect(() => {
    if (props.fetchedSeries?.id === Number(id)) {
      setSelectedSeries(props.fetchedSeries);
    }
  }, [props.fetchedSeries]);

  useEffect(() => {
    if (props.me) {
      setReadList(props.me.comics?.find(s => s.series === Number(id))?.issues || []);
    }
  }, [props.me]);

  const handleRowCheck = (e) => {
    e.persist();
    const id = Number(e.target.id);
    const newList = readList.slice(0);
    const index = newList.indexOf(id);
    if (e.target.checked === true) {
      // selecting
      (index <= -1) && newList.push(id);
    } else {
      // unselecting
      (index > -1) && newList.splice(index, 1);
    }
    setReadList(newList);
  };

  const saveReadComics = () => {
    const oldListWithoutCurrent = props.me.comics?.filter(s => s.series !== Number(id)) || [];
    props.updateUser(
      {
        ...props.me,
        comics: [
          ...oldListWithoutCurrent,
          {
            series: Number(id),
            issues: readList
          }
        ]
      });
  };

  return (
    <Modal isOpen toggle={goBack}>
      {props.loading || !selectedSeries ? (
        <div className='loading-section'>
          <Spinner style={{ width: '2rem', height: '2rem' }} type='grow' />
        </div>
      ) : (
        <>
          <ModalHeader toggle={goBack}>{selectedSeries?.title}</ModalHeader>
          <ModalBody>
            <img
              width='100%'
              src={
                selectedSeries?.thumbnail?.path +
                '/' +
                IMAGE_VARIANT.LANDSCAPE.INCREDIBLE +
                '.' +
                selectedSeries?.thumbnail?.extension
              }
            />
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Read</th>
                  <th>Issue</th>
                </tr>
              </thead>
              <tbody>
                {selectedSeries?.comics?.items?.map((c) => {
                  const comicId = Number(c.resourceURI?.slice(c.resourceURI?.lastIndexOf('/') + 1));
                  if (!comicId && comicId !== 0) return null;
                  return (
                    <tr key={comicId}>
                      <th scope='row'>
                        <Input
                          type='checkbox'
                          id={comicId + ''}
                          checked={readList.includes(comicId)}
                          onChange={handleRowCheck}
                        />
                      </th>
                      <th className="label-th">
                        <label htmlFor={comicId + ''}>{c.name}</label>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={saveReadComics}>Save</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ authentication, series }: IRootState) => ({
  me: authentication.user,
  updateSuccess: authentication.updateSuccess,
  seriesList: series.entities,
  fetchedSeries: series.entity,
  loading: series.loading,
});

const mapDispatchToProps = {
  updateUser,
  getSeriesById
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(SeriesModal);
