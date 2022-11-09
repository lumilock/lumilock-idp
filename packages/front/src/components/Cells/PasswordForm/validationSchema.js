import * as yup from 'yup';

const schema = yup.object({
  password: yup.string().required('Ce champs est obligatoire'),
  passwordConfirmed: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Ce champs doit être identique au champs "mot de passe"')
    .required('Ce champs est obligatoire'),
}).required();

export default schema;
