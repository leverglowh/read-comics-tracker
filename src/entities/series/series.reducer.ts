import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'src/shared/reducers/action-type.util';
import { ISeries, defaultValue as defaultSeries } from 'src/shared/model/series.model';
import { BASE_MARVEL_URL } from 'src/shared/reducers/api-urls';
import { IComic } from 'src/shared/model/comic.model';

export const ACTION_TYPES = {
  FETCH_SERIES_LIST: 'series/FETCH_SERIES_LIST',
  FETCH_COMIC_LIST: 'series/FETCH_COMIC_LIST',
  FETCH_SERIES: 'series/FETCH_SERIES',
  RESET_ENTITY_COMICS: 'series/RESET_ENTITY_COMICS',
  RESET: 'series/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  totalCount: 0,
  entities: [] as ReadonlyArray<ISeries>,
  comics: {
    count: 0,
    offset: 0,
    data: [] as ReadonlyArray<IComic>
  },
  comicsLoading: false,
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
    case REQUEST(ACTION_TYPES.FETCH_COMIC_LIST):
      return {
        ...state,
        errorMessage: null,
        comicsLoading: true,
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
    case FAILURE(ACTION_TYPES.FETCH_COMIC_LIST):
      return {
        ...state,
        errorMessage: action.payload,
        comicsLoading: false
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
          totalCount: action.payload.data?.data?.total,
          loading: false
        }
      case SUCCESS(ACTION_TYPES.FETCH_COMIC_LIST):
        return {
          ...state,
          comics: {
            data: action.payload.data?.data?.results,
            count: action.payload.data.data.total,
            offset: action.payload.data.data.offset
          },
          comicsLoading: false
        }
    case SUCCESS(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data?.data?.results?.[0],
      };
    case ACTION_TYPES.RESET_ENTITY_COMICS:
      return {
        ...initialState,
        entities: state.entities,
        totalCount: state.totalCount,
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

export const getEntities = (titleStartsWith: string = '', page: number = 0) => {
  const requestUrl = apiUrl + `?titleStartsWith=${titleStartsWith.trim()}&offset=${page * 20}`;
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

export const getMySeries = (comicsList: number[]) => {
  const requestUrl = apiUrl + `?comics=${comicsList.join('%2C')}`;
  return {
    type: ACTION_TYPES.FETCH_SERIES_LIST,
    payload: axios.get<ISeries>(requestUrl),
  };
}

export const getSeriesComics = (seriesId: number, page: number = 0) => {
  if (!seriesId) {
    alert('seriesId error');
    return;
  }
  const requestUrl = apiUrl + `/${seriesId}/comics?noVariants=true&orderBy=issueNumber&offset=${page * 20}`;
  const encodedUrl = encodeURI(requestUrl);
  const localCopy = localStorage.getItem(encodedUrl);
  if (localCopy) {
    console.log('Using local');
    return {
      type: SUCCESS(ACTION_TYPES.FETCH_COMIC_LIST),
      payload: JSON.parse(localCopy),
    };
  }
  return {
    type: ACTION_TYPES.FETCH_COMIC_LIST,
    payload: axios.get<IComic>(requestUrl),
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

export const resetSeriesComics = () => ({
  type: ACTION_TYPES.RESET_ENTITY_COMICS,
})

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
