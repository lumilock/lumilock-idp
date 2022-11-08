const Users = {
  // Get all users
  all: () => fetch('/api/users'),
  // Get a specific user by it's id
  getById: (id) => fetch(`/api/users/${id}`),
  // Get permissions for a specific user
  getPermissions: (id) => fetch(`/api/users/${id}/permissions`),
  // POST Create a new user
  create: (data) => fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH personnal information of a specific user
  updatePersonnalInfo: (id, data) => fetch(`/api/users/${id}/personnal-information`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH identity of a specific user
  updateIdentity: (id, data) => fetch(`/api/users/${id}/identity`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH links profile and website of a specific user
  updateLinks: (id, data) => fetch(`/api/users/${id}/links`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH timezone data: zoneinfo and locale of a specific user
  updateGeoData: (id, data) => fetch(`/api/users/${id}/geo-data`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PATCH states data: iasActive and isArchived of a specific user
  updateStates: (id, data) => fetch(`/api/users/${id}/states`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
};

export default Users;
