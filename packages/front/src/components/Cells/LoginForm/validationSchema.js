import * as yup from 'yup';

const schema = yup.object({
  identity: yup.string().required(),
  password: yup.string().required(),
}).required();

export default schema;
