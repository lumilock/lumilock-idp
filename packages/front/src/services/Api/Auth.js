// import {
//   // eslint-disable-next-line no-unused-vars
//   get, post, put, destroy,
// } from './base';

const Auth = {
  login: (queryParams, defaultQueries) => {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Allow-Credentials', '*');
    headers.append('Cache', 'no-cache');

    const search = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
    // eslint-disable-next-line no-console
    console.log(`/api/auth/login?${search.toString()}`);
    return fetch(`/api/auth/login?${search.toString()}`, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow',
      body: null,
    });

    // return post(`/api/auth/login?${search.toString()}`, {}, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    //   crossdomain: true,
    //   withCredentials: true,
    // });
  },
  // loginOld: (queryParams, defaultQueries, cancel = {}) => {
  //   const params = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
  //   console.log(params.toString());
  //   return post('/auth/login', null, { params }, cancel);
  // },
};

export default Auth;
