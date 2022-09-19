import React, { useCallback, useState } from 'react';

import { usePrevious, useUpdate } from '../../../services/Hooks';
import { ConsentForm, LoginForm } from '../../Cells';
import { Carousel, CarouselItem } from '../../Molecules';

import styles from './LoginForms.module.scss';

function LoginForms() {
  const [index, setIndex] = useState(0);
  const [consent, setConsent] = useState({});
  const prevIndex = usePrevious(index);

  const next = () => {
    setIndex((i) => (i === 2 ? 0 : i + 1));
  };

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

  return (
    <div className={styles.Root}>
      <button onClick={next} type="button">next</button>
      <Carousel selected={index}>
        <CarouselItem enter={calcEnter()} leave={calcLeave()}>
          <LoginForm setConsent={setConsent} />
        </CarouselItem>
        <CarouselItem enter={calcEnter()} leave={calcLeave()}>
          <ConsentForm values={consent} setConsent={setConsent} />
        </CarouselItem>
        <CarouselItem enter={calcEnter()} leave={calcLeave()}>
          <span>3</span>
          <span>3</span>
          <span>3</span>
        </CarouselItem>
      </Carousel>
    </div>
  );
}

export default React.memo(LoginForms);
