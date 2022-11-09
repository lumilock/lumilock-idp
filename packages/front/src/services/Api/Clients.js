const Clients = {
  // get all clients services
  services: () => fetch('/api/clients?all=true'),
  // get all clients for an admin user
  apps: () => fetch('/api/clients'),
  // get a specific client by it's id
  getById: (id) => fetch(`/api/clients/${id}`),
  // POST Create a new client
  create: (data) => fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }),
  // PUT Update a specific client
  update: (id, data) => fetch(`/api/clients/${id}`, {
    method: 'PUT',
    body: data,
  }),
  // Retreave value from a client
  register: (url) => fetch(`${url}/api/register`, {
    method: 'GET',
    mode: 'cors',
  }),
};

export default Clients;
