const Users = {
  // Get all users
  all: () => fetch('/api/users'),
  // Get a specific user by it's id
  getById: (id) => fetch(`/api/users/${id}`),
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
};

export default Users;
