import React, { useState } from 'react';

import { Carousel, CarouselItem } from '../../Molecules';

function LoginForms() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((i) => (i === 1 ? 0 : 1));
  };

  return (
    <div>
      <button onClick={next} type="button">next</button>
      <Carousel selected={index}>
        <CarouselItem>
          <span>1</span>
        </CarouselItem>
        <CarouselItem>
          <span>2</span>
          <span>2</span>
          <span>2</span>
        </CarouselItem>
      </Carousel>
    </div>
  );
}

export default React.memo(LoginForms);
