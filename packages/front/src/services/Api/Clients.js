const Clients = {
  // get all clients services
  services: () => fetch('/api/clients?all=true'),
  // get all clients for an admin user
  apps: () => fetch('/api/clients'),
};

export default Clients;
