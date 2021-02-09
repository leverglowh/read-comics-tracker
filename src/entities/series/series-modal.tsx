import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/shared/reducers';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useHistory, useParams } from 'react-router-dom';
import { updateUser } from 'src/shared/reducers/authentication';
import { getEntity as getSeriesById, getSeriesComics, resetSeriesComics } from 'src/entities/series/series.reducer';
import { IMAGE_VARIANT } from 'src/shared/reducers/api-urls';
import { ISeries } from 'src/shared/model/series.model';
import { IComic } from 'src/shared/model/comic.model';

export interface ISeriesModalProps extends StateProps, DispatchProps {}

interface IComicListState {
  [key: string]: {
    readonly data: ReadonlyArray<IComic>;
  };
}

const SeriesModal: React.FC<ISeriesModalProps> = (props) => {
  const [activeKey, setActiveKey] = useState('0');
  const [selectedSeries, setSelectedSeries] = useState<ISeries>();
  const { id } = useParams() as any;
  const history = useHistory();
  const [comics, setComics] = useState<IComicListState>({});
  const [totalComicsCount, setTotalComicsCount] = useState(0);
  const [firstIssue, setFirstIssue] = useState(0);
  const [readList, setReadList] = useState(props.me.comics?.find((s) => s.series === Number(id))?.issues || []);
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

    return () => {
      props.resetSeriesComics();
    };
  }, []);

  useEffect(() => {
    if (props.fetchedSeries?.id === Number(id)) {
      setSelectedSeries(props.fetchedSeries);
    }
  }, [props.fetchedSeries]);

  useEffect(() => {
    if (selectedSeries?.id) {
      props.getSeriesComics(selectedSeries.id, 0);
    }
  }, [selectedSeries]);

  useEffect(() => {
    if (props.comics?.data?.length > 0) {
      setComics({
        ...comics,
        ['offset' + props.comics.offset]: {
          data: props.comics.data,
        },
      });
      if (props.comics.offset === 0) setFirstIssue(props.comics.data[0].issueNumber || 1);
    }
    setTotalComicsCount(props.comics.count || 0);
  }, [props.comics]);

  useEffect(() => {
    if (props.me) {
      setReadList(props.me.comics?.find((s) => s.series === Number(id))?.issues || []);
    }
  }, [props.me]);

  const handleRowCheck = (e) => {
    e.persist();
    const id = Number(e.target.id);
    const newList = readList.slice(0);
    const index = newList.indexOf(id);
    if (e.target.checked === true) {
      // selecting
      index <= -1 && newList.push(id);
    } else {
      // unselecting
      index > -1 && newList.splice(index, 1);
    }
    setReadList(newList);
  };

  const saveReadComics = () => {
    const oldListWithoutCurrent = props.me.comics?.filter((s) => s.series !== Number(id)) || [];
    props.updateUser({
      ...props.me,
      comics: [
        ...oldListWithoutCurrent,
        {
          series: Number(id),
          datetime: (new Date).toISOString(),
          issues: readList,
        },
      ],
    });
  };

  const handleExpand = (eventKey: string) => {
    if (activeKey === eventKey) {
      // closing
      setActiveKey('-1');
      return;
    }

    if (!comics[`offset${eventKey}`] && selectedSeries?.id) {
      props.getSeriesComics(selectedSeries.id, Number(eventKey));
    }
    setActiveKey(eventKey);
  };

  return (
    <Modal show onHide={goBack} backdrop='static' keyboard={false}>
      {props.loading || !selectedSeries ? (
        <div className='modal-loading-section'>
          <Spinner style={{ width: '2rem', height: '2rem' }} animation='grow' />
        </div>
      ) : (
        <>
          <Modal.Header closeButton>{selectedSeries?.title}</Modal.Header>
          <Modal.Body>
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
            {[...Array(Math.ceil(totalComicsCount / 20))].map((el, index) => (
              <Accordion key={index} activeKey={activeKey}>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey={index + ''} onClick={() => handleExpand(index + '')}>
                    Issues #{index * 20 + firstIssue} - #
                    {Math.min(index * 20 + (firstIssue + 19), totalComicsCount)}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + ''}>
                    <Card.Body>
                      <Table hover responsive>
                        <thead>
                          <tr>
                            <th>Read</th>
                            <th>Issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comics['offset' + index * 20] &&
                            comics['offset' + index * 20].data.map((c) => (
                              <tr key={c.id}>
                                <th scope='row'>
                                  <Form.Check
                                    custom
                                    id={c.id + ''}
                                    checked={readList.includes(c.id || -1)}
                                    onChange={handleRowCheck}
                                  />
                                </th>
                                <th className='label-th'>
                                  <label htmlFor={c.id + ''}>{c.title}</label>
                                </th>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            ))}
          </Modal.Body>
        </>
      )}
      <Modal.Footer>
        {props.comicsLoading && (
          <div className='modal-loading-section'>
            <Spinner style={{ width: '2rem', height: '2rem' }} animation='grow' />
          </div>
        )}
        <Button variant='secondary' onClick={goBack}>
          Cancel
        </Button>
        <Button variant='primary' onClick={saveReadComics}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = ({ authentication, series }: IRootState) => ({
  me: authentication.user,
  updateSuccess: authentication.updateSuccess,
  seriesList: series.entities,
  fetchedSeries: series.entity,
  comics: series.comics,
  loading: series.loading,
  comicsLoading: series.comicsLoading,
});

const mapDispatchToProps = {
  updateUser,
  getSeriesById,
  getSeriesComics,
  resetSeriesComics,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(SeriesModal);
