import { PropTypes } from 'prop-types';
import React, { useId, useMemo, useState } from 'react';
import clsx from 'clsx';
import { IoIosPerson } from 'react-icons/io';

import { sizes } from '../../../../services/Theme';
import { useUpdate } from '../../../../services/Hooks';
import {
  Else, If, Then, Typography,
} from '../../../Electrons';
import { Avatar, Squircle } from '../../../Atoms';
import styles from './AvatarField.module.scss';

const AvatarField = React.forwardRef(({
  error, size, onChange, initialPicture, variant, ...rest
}, ref) => {
  const inputId = useId();
  const [image, setImage] = useState(initialPicture);

  const AvatarComponent = useMemo(() => {
    if (variant === 'circle') {
      return <Avatar size={size} />;
    }
    return <Squircle size={size} icon={IoIosPerson} />;
  }, [size, variant]);

  const ImageComponent = useMemo(() => {
    if (variant === 'circle') {
      return <img src={image || ref?.current?.value} alt="Avatar" />;
    }
    return <Squircle size={size} icon={IoIosPerson} image={image || ref?.current?.value} />;
  }, [image, ref, size, variant]);

  const classes = {
    circle: 'Circle',
    squircle: 'Squircle',
  };

  // update image displayed
  const handleChange = (event) => {
    onChange(event?.target?.files?.[0] || null);
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
    }
    if (event.target.files.length === 0) {
      setImage(null);
    }
  };

  /**
   * Method to watch the initialPicture and update it
   * if it change
   */
  useUpdate(() => {
    setImage(initialPicture);
  }, [initialPicture]);
  return (
    <div className={styles?.Root}>
      <div
        className={clsx(
          styles?.Avatar,
          styles?.[sizes[size]],
          styles?.[classes[variant]],
        )}
      >
        <input id={inputId} ref={ref} onChange={handleChange} {...rest} />
        <If condition={!image && !ref?.current?.value}>
          <Then>
            {AvatarComponent}
          </Then>
          <Else>
            {ImageComponent}
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
  /**
   * Define the shape of the icon
   */
  variant: PropTypes.oneOf(['circle', 'squircle']),
};

AvatarField.defaultProps = {
  onChange: () => {},
  size: 'xxlarge',
  error: '',
  initialPicture: '',
  variant: 'circle',
};

export default AvatarField;
