import * as yup from 'yup';

const schema = yup.object({
  password: yup.string().required('Vous devez ajouter votre ancien mot de passe'),
  newPassword: yup.string().required('Vous devez renseigner votre nouveau mot de passe'),
  confirmedPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Les mots de passe doivent être identique')
    .required('Vous devez répéter votre nouveau mot de passe'),
}).required();

export default schema;
