// import {
//   // eslint-disable-next-line no-unused-vars
//   get, post, put, destroy,
// } from './base';

const Auth = {
  login: (queryParams, defaultQueries) => {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', 'http://192.168.99.1:3001');
    headers.append('Cache', 'no-cache');

    const search = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
    // eslint-disable-next-line no-console
    console.log(`/auth/login?${search}`);
    return fetch(`/auth/login?${search}`, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      body: {},
    });
  },
  // loginOld: (queryParams, defaultQueries, cancel = {}) => {
  //   const params = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
  //   console.log(params.toString());
  //   return post('/auth/login', null, { params }, cancel);
  // },
};

export default Auth;
