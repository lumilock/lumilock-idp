import * as yup from 'yup';

const schema = yup.object({
  identity: yup.string().required(),
  password: yup.string().required(),
  remember: yup.boolean().required(),
  needConsent: yup.boolean().required(),
  consent: yup.boolean().when('needConsent', (needConsent, sch) => sch.test({
    test: (consent) => {
      // eslint-disable-next-line no-console
      console.log(needConsent, consent, sch);
      return (needConsent && consent) || !needConsent;
    },
    message: 'If you when to loggin with this app you need to consent, else go back',
  })).required(),
}).required();

export default schema;
