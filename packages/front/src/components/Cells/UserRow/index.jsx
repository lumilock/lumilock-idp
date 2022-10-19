import React from 'react';
import PropTypes from 'prop-types';
import { IoPin } from 'react-icons/io5';

import { remCalc } from '../../../services/Tools';
import { Avatar, Gender } from '../../Molecules';
import {
  Else, Icon, If, Skeleton, Then, Typography,
} from '../../Atoms';
import styles from './UserRow.module.scss';

function UserRow({
  id, image, name, gender, login, locality, selected, setSelected, disabled, loading,
}) {
  const handleClick = () => {
    setSelected((old) => (old === id ? '' : id));
  };

  return (
    <div
      className={[
        styles.Root,
        selected ? styles.Active : '',
        loading ? styles.Loading : '',
      ].join(' ').replace('  ', ' ').trim()}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
      disabled={disabled ? 'disabled' : ''}
    >
      <If condition={!loading}>
        <Then>
          <div className={styles.Head}>
            <Avatar size="small" {...(!image && { src: image })}>
              {login}
            </Avatar>
            <div className={styles.Name}>
              <Typography varian="h4" color={!selected ? 'content1' : 'background1'}>
                {name}
              </Typography>
              <Gender gender={gender} badge size="xxsmall" color={!selected ? 'content1' : 'background1'} />
            </div>
            <Typography varian="body2" color={!selected ? 'content3' : 'background3'}>
              {login}
            </Typography>
          </div>
          <div className={styles.Locality}>
            <If condition={!!locality}>
              <>
                <Icon ionIcon={IoPin} size="xxsmall" color="alert dark" />
                <Typography varian="body2" color={!selected ? 'content3' : 'background3'}>
                  {locality}
                </Typography>
              </>
            </If>
          </div>
        </Then>
        <Else>
          <div className={styles.Head}>
            <Skeleton variant="circular" width={remCalc(24)} height={remCalc(24)} animation="wave" />
            <div className={styles.Name}>
              <Skeleton width={remCalc(100)} animation="wave" />
            </div>
            <Skeleton width={remCalc(100)} animation="wave" />
          </div>
          <div className={styles.Locality}>
            <Skeleton width={remCalc(100)} animation="wave" />
          </div>
        </Else>
      </If>
    </div>
  );
}

UserRow.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  gender: PropTypes.oneOf(['male', 'female', 'other']),
  login: PropTypes.string,
  locality: PropTypes.string,
  selected: PropTypes.bool,
  setSelected: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

UserRow.defaultProps = {
  image: undefined,
  name: 'User name',
  gender: 'other',
  login: 'login',
  locality: '',
  selected: false,
  setSelected: () => {},
  disabled: false,
  loading: false,
};

export default React.memo(UserRow);
