import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { usePrevious, useUpdate } from '../../../services/Hooks';
import { Carousel, CarouselItem } from '../../Molecules';
import { ConsentForm, LoginForm, ResetPassword } from '../../Cells';

import styles from './LoginForms.module.scss';

function LoginForms() {
  // Router
  const [searchParams] = useSearchParams();
  // States
  const [index, setIndex] = useState(0);
  const [consent, setConsent] = useState({});
  const prevIndex = usePrevious(index);

  const reset = searchParams.get('reset');

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

  useUpdate(() => {
    if (consent?.clientInfos?.id) {
      setIndex(1);
    } else {
      setIndex(0);
    }
  }, [consent]);

  useUpdate(() => {
    if (reset) {
      setIndex(2);
    } else {
      setIndex(0);
    }
  }, [reset]);

  return (
    <div className={styles.Root}>
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
      </Carousel>
    </div>
  );
}

export default React.memo(LoginForms);
