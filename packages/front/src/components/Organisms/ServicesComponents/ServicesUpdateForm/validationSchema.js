import * as yup from 'yup';

const schema = yup.object({
  clientName: yup.string().required('Un nom est requis'),
  appUrl: yup.string().required('l\'url du front de votre application est requise'),
  hide: yup.bool().nullable(),
  redirectUris: yup.array().required('La liste des url de redirection est requise'),
  permissions: yup.array().required('La liste des permissions est requise'),
  applicationType: yup.string().required('Le type de votre application est requis'),
  file: yup.mixed().required('Le logo de l\'application est requis'),
  isActive: yup.bool().nullable(),
  isArchived: yup.bool().nullable(),

}).required();

export default schema;
