const Clients = {
  // get all clients services
  services: () => fetch('/api/clients?all=true'),
  // get all clients for an admin user
  apps: () => fetch('/api/clients'),
  // get a specific client by it's id
  getById: (id) => fetch(`/api/clients/${id}`),
};

export default Clients;
