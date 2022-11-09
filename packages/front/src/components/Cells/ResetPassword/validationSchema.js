import * as yup from 'yup';

const schema = yup.object({
  resetIdentity: yup.string().required('Ce champs est obligatoire'),
}).required();

export default schema;
