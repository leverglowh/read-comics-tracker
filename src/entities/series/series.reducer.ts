import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'src/shared/reducers/action-type.util';
import { ISeries, defaultValue as defaultSeries } from 'src/shared/model/series.model';
import { strapiUrl, BASE_MARVEL_URL } from 'src/shared/reducers/api-urls';

export const ACTION_TYPES = {
  FETCH_SERIES_LIST: 'series/FETCH_SERIES_LIST',
  FETCH_SERIES: 'series/FETCH_SERIES',
  RESET: 'series/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  totalCount: 0,
  entities: [] as ReadonlyArray<ISeries>,
  entity: defaultSeries
};

export type SeriesState = Readonly<typeof initialState>;

export default (state: SeriesState = initialState, action): SeriesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SERIES_LIST):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_SERIES_LIST):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false
      }
    case FAILURE(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false
      }
      case SUCCESS(ACTION_TYPES.FETCH_SERIES_LIST):
        return {
          ...state,
          entities: action.payload.data?.data?.results,
          loading: false
        }
    case SUCCESS(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data?.data?.results?.[0],
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Actions

const apiUrl = BASE_MARVEL_URL + '/v1/public/series';

export const getEntities = (titleStartsWith: string = '', offset: number = 0) => {
  const requestUrl = apiUrl + `?titleStartsWith=${titleStartsWith.trim()}&offset=${offset}`;
  const encodedUrl = encodeURI(requestUrl);
  const localCopy = localStorage.getItem(encodedUrl);
  if (localCopy) {
    console.log('Using local');
    return {
      type: SUCCESS(ACTION_TYPES.FETCH_SERIES_LIST),
      payload: JSON.parse(localCopy),
    };
  }
  return {
    type: ACTION_TYPES.FETCH_SERIES_LIST,
    payload: axios.get<ISeries>(requestUrl),
  };
};

export const getEntity = (seriesId: number) => {
  const requestUrl = `${apiUrl}/${seriesId}`;
  const encodedUrl = encodeURI(requestUrl);
  const localCopy = localStorage.getItem(encodedUrl);
  if (localCopy) {
    console.log('Using local');
    return {
      type: SUCCESS(ACTION_TYPES.FETCH_SERIES),
      payload: JSON.parse(localCopy),
    };
  }
  return {
    type: ACTION_TYPES.FETCH_SERIES,
    payload: axios.get<ISeries>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
