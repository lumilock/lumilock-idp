const Auth = {
  // Post Login data to authenticate the user
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
  logout: () => fetch('/api/auth/logout'),
  // Post Reset Password
  reset: (params) => fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(params),
  }),
  // Post change Password after asking for reseting it
  changePassword: (params) => fetch('/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(params),
  }),
  // Get all auth profile data
  profile: () => fetch('/api/auth/profile'),
  // PATCH auth profile picture
  updatePicture: (data) => fetch('/api/auth/picture', {
    method: 'PATCH',
    body: data,
  }),
  // PATCH auth personnal information
  updatePersonnalInfo: (data) => fetch('/api/auth/personnal-information', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH auth identity
  updateIdentity: (data) => fetch('/api/auth/identity', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH auth password
  updatePassword: (data) => fetch('/api/auth/password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH auth links profile and website
  updateLinks: (data) => fetch('/api/auth/links', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH auth timezone data: zoneinfo and locale
  updateGeoData: (data) => fetch('/api/auth/geo-data', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
};

export default Auth;
