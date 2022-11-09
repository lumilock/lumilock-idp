import axios from 'axios';
import authHeader from './auth-header';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: true,
});

apiClient.interceptors.request.use(
  ({ headers, ...config }) => {
    console.log('tessttsest', headers, config);
    return {
      ...config,
      headers: {
        ...authHeader(),
        ...headers,
      },
    };
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  // (response) => response,
  (response) => {
    console.log('here');
    // check redirection
    // eslint-disable-next-line no-console
    console.log(response?.request?.status, response?.headers?.['content-type']);
    if (
      ([301, 302, 307, 308, 310].includes(response?.request?.status) || response?.headers?.['content-type'].includes('text/html;'))
      && (window?.location?.href !== response?.request?.responseURL)
    ) {
      console.log('response?.request?.headers', response);
      // window.open(response?.request?.responseURL, '_self');
      // window.location.href = response?.request?.responseURL;
      // return null;
    }
    return response;
  },
  async (error) => {
    console.log('first', error);
    if (axios.isCancel(error)) return Promise.reject(error.message);
    return Promise.reject(error);
  },
);

const {
  get, post, put, delete: destroy,
} = apiClient;

export {
  get, post, put, destroy,
};
