import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IoIosFemale, IoIosHelp, IoIosMale } from 'react-icons/io';

import { Icon, If } from '../../Atoms';
import styles from './Gender.module.scss';

function Gender({ gender, badge, ...rest }) {
  const genderIcon = useMemo(() => {
    if (gender === 'male') {
      return IoIosMale;
    } if (gender === 'female') {
      return IoIosFemale;
    }
    return IoIosHelp;
  }, [gender]);

  return (
    <div className={[
      styles.Base,
      badge && styles.Badge,
    ].join(' ').replaceAll('  ', ' ').trim()}
    >
      <If condition={gender !== 'other'}>
        <Icon {...rest} ionIcon={genderIcon} />
      </If>
    </div>
  );
}

Gender.propTypes = {
  gender: PropTypes.oneOf(['male', 'female', 'other']),
  badge: PropTypes.bool,
};

Gender.defaultProps = {
  gender: 'other',
  badge: false,
};

export default React.memo(Gender);
