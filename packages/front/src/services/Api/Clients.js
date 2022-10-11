const Clients = {
  // get all clients services
  services: () => fetch('/api/clients'),
  // get all clients for an admin user
  apps: () => fetch('/api/clients?all=true'),
};

export default Clients;
