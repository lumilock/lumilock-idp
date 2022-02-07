import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import { IoPeople } from 'react-icons/io5';
import Button from '../../../components/Button';
import { CheckboxControlled, InputControlled } from '../../../components/Form';
import Squircle from '../../../components/Squircle';
import { Auth } from '../../../services/Api';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';

import styles from './LoginForm.module.scss';
import Icon from '../../../components/Icon';

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
    handleSubmit, control, setValue,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });

  /**
   * Function to submit values
   * */
  const onSubmit = async (data) => {
    // exclude needConsent from query values
    const { needConsent, ...rest } = data;
    // try to loggin in
    await Auth.login(rest, getAllQuery())
      .then((response) => response.data)
      .then((response) => {
        // if success but need consent for relaying party
        if (response?.error === 'consent_required') {
          setClientInfos(response?.clientInfos);
          setDisplayConsent(true);
          setValue('needConsent', true, { shouldValidate: true });
        }
      })
      .catch((err) => console.log('err:', err));
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>

        {/* Login form */}
        <fieldset className={!displayConsent ? styles.Active : ''}>
          <div>
            <h4>Bienvenue</h4>
            <p className={`${styles.Subtitle} body1`}>Bienvenue sur Lumilock</p>
          </div>
          <InputControlled control={control} label="Identifiant" name="identity" type="text" placeholder="Entrez votre identifiant" />
          <InputControlled control={control} label="Mot de passe" name="password" type="password" placeholder="Entrez votre mot de passe" />
          <CheckboxControlled control={control} label="Rester connecter pendant 30j" name="remember" />
          <Button color="secondary" type="submit">Se connecter</Button>
          <a href="/#" className={`${styles.Link} body2`}>Mot de passe oublier ?</a>
        </fieldset>

        {/* Consent Form */}
        <fieldset className={displayConsent ? styles.Active : ''}>
          {/* Title section */}
          <div>
            <h4>Consent</h4>
            <p className={`${styles.Subtitle} body1`}>An third party app required your consent</p>
          </div>
          {/* App section */}
          <div className={styles.AppSection}>
            <Squircle image={clientInfos?.clientPicture || ''} size="L" />
            <div className={styles.Infos}>
              <h6>{clientInfos?.name}</h6>
              <p className="body2">Wants to access you Lumilock Account</p>
            </div>
          </div>
          {/* Sharing data scition */}
          <div className={styles.SharingSection}>
            <p className="subtitle1">Sharing data:</p>
            <ul className={styles.SharingItem}>
              <li>
                <Icon
                  ionIcon={IoPeople}
                  size="small"
                />
                <p className="body2">User infos</p>
              </li>
            </ul>
          </div>
          <CheckboxControlled control={control} label="Accept to share data" name="consent" />
          {/* Info */}
          <div className={styles.Disclaimer}>
            <p className="subtitle1">{`Make sure that you trust ${clientInfos?.name}`}</p>
            <p className="body2">You may be sharing sensitive info with this site or app. But you will can disable data sharing  in the settings of your profile</p>
          </div>
          <div className={styles.Actions}>
            <Button color="secondary" variant="standard" type="button" onClick={() => { setDisplayConsent(false); setValue('needConsent', false, { shouldValidate: true }); }}>Back</Button>
            <Button color="secondary" type="submit">Accepte</Button>
          </div>
          {/* <pre>
            {JSON.stringify(clientInfos, 2, 2)}
          </pre> */}
        </fieldset>

      </form>
    </div>
  );
}

export default React.memo(LoginForm);
