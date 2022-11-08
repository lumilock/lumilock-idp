import * as yup from 'yup';

const schema = yup.object({
  isActive: yup.boolean(),
  isArchived: yup.boolean(),
}).required();

export default schema;
