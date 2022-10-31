import * as yup from 'yup';

const schema = yup.object({
  zoneinfo: yup.string().required('Un fuseau horaire est requis'),
  locale: yup.string().required('Une langue est requise'),
}).required();

export default schema;
