import * as yup from 'yup';

const schema = yup.object({
  email: yup.string(),
  phoneNumber: yup.string(),
}).required();

export default schema;
