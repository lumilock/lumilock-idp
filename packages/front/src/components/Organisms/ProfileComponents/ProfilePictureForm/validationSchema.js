import * as yup from 'yup';

const schema = yup.object({
  file: yup.mixed().required('Vous devez ajouter une image'),
}).required();

export default schema;
