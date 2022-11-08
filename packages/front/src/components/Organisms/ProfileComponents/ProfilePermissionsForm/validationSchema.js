import * as yup from 'yup';

const schema = yup.object({
  clientId: yup.string().required(),
  role: yup.string().required('Vous devez selectinner un Role'),
  permissions: yup.array().of(yup.string()),
}).required();

export default schema;
