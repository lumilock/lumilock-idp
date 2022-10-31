import * as yup from 'yup';

const schema = yup.object({
  clientName: yup.string().required('Un nom est requis'),
  redirectUris: yup.string().required('L\'url de recupération est requise'),
  applicationType: yup.string().required('Le type de votre application est requis'),
  hide: yup.bool(),
}).required();

export default schema;
