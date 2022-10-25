import * as yup from 'yup';

const schema = yup.object({
  familyName: yup.string().required(),
  gender: yup.string().required(),
  // password: yup.string().required(),
}).required();

export default schema;
