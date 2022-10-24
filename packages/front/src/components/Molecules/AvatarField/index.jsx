import { PropTypes } from 'prop-types';
import React, { useId, useState } from 'react';

import { Avatar } from '../../Atoms';
import { Else, If, Then } from '../../Electrons';

const AvatarField = React.forwardRef(({ onChange, ...rest }, ref) => {
  const inputId = useId();
  const [image, setImage] = useState(null);

  // update image displayed
  const handleChange = (event) => {
    onChange(event);
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
    }
    if (event.target.files.length === 0) {
      setImage(null);
    }
  };

  return (
    <div>
      <input id={inputId} ref={ref} onChange={handleChange} {...rest} />
      <If condition={!image && !ref?.current?.value}>
        <Then>
          <Avatar />
        </Then>
        <Else>
          <img src={image || ref?.current?.value} alt="Avatar" />
        </Else>
      </If>
    </div>
  );
});

AvatarField.propTypes = {
  /**
   * Function fired when the file change
   */
  onChange: PropTypes.func,
};

AvatarField.defaultProps = {
  onChange: () => {},
};

export default AvatarField;
