import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().nullable(),
  phoneNumber: yup.string().nullable(),
}).required();

export default schema;
