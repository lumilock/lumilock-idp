import {
  // eslint-disable-next-line no-unused-vars
  get, post, put, destroy,
} from './base';

const Exemple = {
  index: (index, cancel = {}) => get(`/audits/${index}`, cancel),
  preparer: (elevageId, params, cancel = {}) => post(`/audits/preparer/${elevageId}`, params, cancel),
//   single: (id) =>
//     get(`/users/${id}`),
//   singleByEmail: (email) =>
//     get(`/users?email=${email}`),
//   create: (params) =>
//     post('/users', params),
//   update: (id, params) =>
//     put(`/users/${id}`, params),
//   remove: (id) =>
//     destroy(`/users/${id}`),
};

export default Exemple;
