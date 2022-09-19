const Auth = {
  login: (queryParams, defaultQueries) => {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Cache', 'no-cache');

    const search = new URLSearchParams([...Object.entries(queryParams), ...defaultQueries]);
    return fetch(`/api/auth/login?${search.toString()}`, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow',
      body: null,
    });
  },
};

export default Auth;
