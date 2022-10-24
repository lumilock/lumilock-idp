import { PropTypes } from 'prop-types';
import React, { useId, useState } from 'react';
import clsx from 'clsx';

import { sizes } from '../../../../services/Theme';
import { Avatar } from '../../../Atoms';
import {
  Else, If, Then, Typography,
} from '../../../Electrons';
import styles from './AvatarField.module.scss';

const AvatarField = React.forwardRef(({
  error, size, onChange, initialPicture, ...rest
}, ref) => {
  const inputId = useId();
  const [image, setImage] = useState(initialPicture);

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
    <div className={styles?.Root}>
      <div
        className={clsx(
          styles?.Avatar,
          styles?.[sizes[size]],
        )}
      >
        <input id={inputId} ref={ref} onChange={handleChange} {...rest} />
        <If condition={!image && !ref?.current?.value}>
          <Then>
            <Avatar size={size} />
          </Then>
          <Else>
            <img src={image || ref?.current?.value} alt="Avatar" />
          </Else>
        </If>
      </div>
      <If condition={!!error}>
        <Typography variant="body2" color="alert">{error}</Typography>
      </If>
    </div>
  );
});

AvatarField.propTypes = {
  /**
   * Function fired when the file change
   */
  onChange: PropTypes.func,
  /**
   * Define the size of the
   */
  size: PropTypes.oneOf(sizes),
  /**
   * The error message to display under the input
   */
  error: PropTypes.string,
  /**
   * The initial picture image to display
   */
  initialPicture: PropTypes.string,
};

AvatarField.defaultProps = {
  onChange: () => {},
  size: 'xxlarge',
  error: '',
  initialPicture: '',
};

export default AvatarField;
