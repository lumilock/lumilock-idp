import * as yup from 'yup';

const schema = yup.object({
  identity: yup.string().required(),
  password: yup.string().required(),
  consent: yup.boolean().oneOf([true], 'Pour consentir, vous devez autoriser l\'application à accèder à vos données.'),
}).required();

export default schema;
