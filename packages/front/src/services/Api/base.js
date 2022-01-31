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
  (response) => response,
  async (error) => {
    console.log('herer');
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
