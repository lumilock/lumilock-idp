import React, { useCallback, useState } from 'react';
import { usePrevious } from '../../../services/Hooks';
import { LoginForm } from '../../Cells';

import { Carousel, CarouselItem } from '../../Molecules';

import styles from './LoginForms.module.scss';

function LoginForms() {
  const [index, setIndex] = useState(0);
  const prevIndex = usePrevious(index);

  const next = () => {
    setIndex((i) => (i === 1 ? 0 : 1));
  };

  /**
   * Method that display the enter direction depending on previous and next index
   */
  const calcEnter = useCallback(
    () => (prevIndex < index ? 'right' : 'left'),
    [index, prevIndex],
  );

  /**
   * Method that display the leave direction depending on previous and next index
   */
  const calcLeave = useCallback(
    () => (prevIndex > index ? 'right' : 'left'),
    [index, prevIndex],
  );

  return (
    <div className={styles.Root}>
      <button onClick={next} type="button">next</button>
      <Carousel selected={index}>
        <CarouselItem enter={calcEnter()} leave={calcLeave()}>
          <LoginForm />
        </CarouselItem>
        <CarouselItem enter={calcEnter()} leave={calcLeave()}>
          <span>2</span>
          <span>2</span>
          <span>2</span>
        </CarouselItem>
      </Carousel>
    </div>
  );
}

export default React.memo(LoginForms);
