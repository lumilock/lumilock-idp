import * as yup from 'yup';

const schema = yup.object({
  profile: yup.string().url('Format d\'url invalid').nullable(),
  website: yup.string().url('Format d\'url invalid').nullable(),
}).required();

export default schema;
