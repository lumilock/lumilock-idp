import * as yup from 'yup';

const schema = yup.object({
  oldPassword: yup.string().required('Vous devez ajouter votre ancien mot de passe'),
  password: yup.string().required('Vous devez renseigner votre nouveau mot de passe'),
  confirmedPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe doivent être identique')
    .required('Vous devez répéter votre nouveau mot de passe'),
}).required();

export default schema;
