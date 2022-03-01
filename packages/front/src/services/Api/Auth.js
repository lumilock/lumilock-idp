import {
  // eslint-disable-next-line no-unused-vars
  get, post, put, destroy,
} from './base';

const Auth = {
  login: (queryParams, defaultQueries, cancel = {}) => {
    const params = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
    console.log(params.toString());
    return post('/auth/login', null, { params }, cancel);
  },
};

export default Auth;
