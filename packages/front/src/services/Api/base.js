import axios from 'axios';
import authHeader from './auth-header';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(
  ({ header, ...config }) => ({
    ...config,
    headers: {
      ...authHeader(),
      ...header,
    },
  }),
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  // (response) => response,
  (response) => {
    // check redirection
    // eslint-disable-next-line no-console
    console.log(response?.request?.status, response?.headers?.['content-type']);
    if (
      ([301, 302, 307, 308, 310].includes(response?.request?.status) || response?.headers?.['content-type'].includes('text/html;'))
      && (window?.location?.href !== response?.request?.responseURL)
    ) {
      window.location.href = response?.request?.responseURL;
      return null;
    }
    return response;
  },
  async (error) => {
    if (axios.isCancel(error)) return Promise.reject(error.message);
    return Promise.reject(error);
  },
);

const {
  get, post, put, delete: destroy,
} = apiClient;

export {
  get, post, put, destroy, axios,
};
