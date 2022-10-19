const Users = {
  // Get all users
  all: () => fetch('/api/users'),
  // Get a specific user by it's id
  getById: (id) => fetch(`/api/users/${id}`),
};

export default Users;
