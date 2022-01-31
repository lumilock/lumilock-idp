import {
  // eslint-disable-next-line no-unused-vars
  get, post, put, destroy,
} from './base';

const Auth = {
  login: (queryParams, cancel = {}) => {
    const params = new URLSearchParams(Object.entries(queryParams));
    return post('/auth/login', null, { params }, cancel);
  },
};

export default Auth;
