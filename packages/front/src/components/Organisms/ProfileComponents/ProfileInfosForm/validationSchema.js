import * as yup from 'yup';

const schema = yup.object({
  familyName: yup.string().required('Le champs "nom" est requis'),
  middleName: yup.string().nullable(),
  givenName: yup.string().required('Le champs "prenom" est requis'),
  nickname: yup.string().nullable(),
  gender: yup.mixed().oneOf(['male', 'female', 'other']).required('Le champs "sexe" est requis'),
  birthdate: yup.date().nullable(),
}).required();

export default schema;
