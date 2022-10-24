import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useEffectOnce, usePrevious, useUpdate } from '../../../services/Hooks';
import { Carousel, CarouselItem } from '../../Molecules';
import {
  ConsentForm, LoginForm, PasswordForm, ResetPassword,
} from '../../Cells';
import { If } from '../../Electrons';
import styles from './LoginForms.module.scss';

function LoginForms() {
  // Router
  const [searchParams] = useSearchParams();
  // States
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [consent, setConsent] = useState({});
  const prevIndex = usePrevious(index);

  const page = searchParams.get('page');

  /**
   * Method that display the enter direction depending on previous and next index
   */
  const calcEnter = useCallback(
    () => ((prevIndex || -1) < index ? 'right' : 'left'),
    [index, prevIndex],
  );

  /**
   * Method that display the leave direction depending on previous and next index
   */
  const calcLeave = useCallback(
    () => ((prevIndex || -1) > index ? 'right' : 'left'),
    [index, prevIndex],
  );

  // Checking page
  useUpdate(() => {
    switch (page) {
      case 'consent': {
        setIndex(1);
        break;
      }
      case 'reset': {
        setIndex(2);
        break;
      }
      case 'reset-password': {
        setIndex(3);
        break;
      }
      default: {
        setIndex(0);
        break;
      }
    }
  }, [page]);

  // Waiting the mounted state
  useEffectOnce(() => {
    setIsMounted(true);
  });

  return (
    <div className={[styles.Root, isMounted ? styles.Display : ''].join(' ').trim()}>
      <If condition={isMounted}>
        <Carousel selected={index}>
          <CarouselItem enter={calcEnter()} leave={calcLeave()}>
            <LoginForm setConsent={setConsent} />
          </CarouselItem>
          <CarouselItem enter={calcEnter()} leave={calcLeave()}>
            <ConsentForm values={consent} setConsent={setConsent} />
          </CarouselItem>
          <CarouselItem enter={calcEnter()} leave={calcLeave()}>
            <ResetPassword />
          </CarouselItem>
          <CarouselItem enter={calcEnter()} leave={calcLeave()}>
            <PasswordForm />
          </CarouselItem>
        </Carousel>
      </If>
    </div>
  );
}

export default React.memo(LoginForms);
