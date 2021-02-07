import axios from 'axios';
import { BASE_MARVEL_URL } from 'src/shared/reducers/api-urls';
import MD5 from 'src/shared/util/md5';
import { AUTH_TOKEN_KEY } from './constans';

axios.interceptors.request.use(
  (config) => {
    if (!config.url?.includes(BASE_MARVEL_URL)) {
      const JWT = localStorage.getItem(AUTH_TOKEN_KEY);
      console.log(JWT);
      return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${JWT}`,
        }
      };
    }
    const PRIV_KEY = localStorage.getItem('PRIVATE_API_KEY') || '';
    const PUBLIC_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
    const ts = new Date().getTime();
    const hash = MD5(ts + PRIV_KEY + process.env.REACT_APP_MARVEL_PUBLIC_KEY).toString();
    return {
      ...config,
      params: { ...config.params, ts, apikey: PUBLIC_KEY, hash },
    };
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (!response?.config?.url?.includes(BASE_MARVEL_URL)) return response;
    // caching response
    const parsedURL = encodeURI(response.config.url || '');
    localStorage.setItem(parsedURL, JSON.stringify(response));
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
