import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import Button from '../../../components/Button';
import { CheckboxControlled, InputControlled } from '../../../components/Form';
import { Auth } from '../../../services/Api';

import noAppImage from '../../../assets/images/noAppImage.png';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './LoginForm.module.scss';

function LoginForm() {
  const [searchParams] = useSearchParams();
  const [clientInfos, setClientInfos] = useState(null);
  const [displayConsent, setDisplayConsent] = useState(false);

  const getAllQuery = () => {
    // save the iterator
    const queryEntries = searchParams.entries();
    // select first entry
    let iterator = queryEntries.next();
    // init return array
    const querys = [];
    // init max iter counter
    let countOut = 0;
    while (iterator.done === false && countOut < 50) {
      querys.push(iterator.value);
      iterator = queryEntries.next();
      countOut += 1;
    }
    return querys;
  };

  // React hook form
  const {
    handleSubmit, control,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });
  // Function to submit values
  const onSubmit = async (data) => {
    await Auth.login(data, getAllQuery())
      .then((response) => response.data)
      .then((response) => {
        if (response?.error === 'consent_required') {
          setClientInfos(response?.clientInfos);
          setDisplayConsent(true);
        }
      })
      .catch((err) => console.log('err:', err));
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={!displayConsent ? styles.Active : ''}>
          <div>
            <h4>Bienvenue</h4>
            <p className={`${styles.Subtitle} body1`}>Bienvenue sur Lumilock</p>
          </div>
          <InputControlled control={control} label="Identifiant" name="identity" type="text" placeholder="Entrez votre identifiant" />
          <InputControlled control={control} label="Mot de passe" name="password" type="password" placeholder="Entrez votre mot de passe" />
          <CheckboxControlled control={control} label="Rester connecter pendant 30j" name="remember" />
          <a href="/#" className={`${styles.Link} body2`}>Mot de passe oublier ?</a>
          <Button color="secondary" type="submit">Se connecter</Button>
        </fieldset>
        <fieldset className={displayConsent ? styles.Active : ''}>
          <div>
            <h4>{clientInfos?.name}</h4>
            <p className={`${styles.Subtitle} body1`}>Wants to access you Lumilock Account</p>
          </div>
          <div>
            <img src={clientInfos?.clientPicture || noAppImage} alt="NoAppImage" />
          </div>
          {/* <pre>
            {JSON.stringify(clientInfos, 2, 2)}
            <Button color="secondary" type="button" onClick={() => setDisplayConsent(false)}>Back</Button>
            <Button color="secondary" type="submit">Accepte</Button>
          </pre> */}
        </fieldset>
      </form>
    </div>
  );
}

export default React.memo(LoginForm);
