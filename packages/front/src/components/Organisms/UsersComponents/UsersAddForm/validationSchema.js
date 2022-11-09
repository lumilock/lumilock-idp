import * as yup from 'yup';

const schema = yup.object({
  password: yup.string().required('Un mot de passe est requis'),
  givenName: yup.string().required('Un prénom est requis'),
  familyName: yup.string().required('Un nom de famille est requis'),
  middleName: yup.string().nullable(),
  nickname: yup.string().nullable(),
  preferredUsername: yup.string().nullable(),
  profile: yup.string().nullable(),
  website: yup.string().nullable(),
  email: yup.string().nullable(),
  gender: yup.mixed().oneOf(['male', 'female', 'other']).required('Le champs "sexe" est requis'),
  birthdate: yup.date().nullable(),
  zoneinfo: yup.string().required('Un fuseau horaire est requis'),
  locale: yup.string().required('Une langue est requise'),
  phoneNumber: yup.string().nullable(),
  isActive: yup.bool().nullable(),
  isArchived: yup.bool().nullable(),
}).required();

export default schema;
