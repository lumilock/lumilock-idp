/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { IoPin } from 'react-icons/io5';

import {
  Else, Icon, If, Skeleton, Then, Typography,
} from '../../Electrons';
import colors from '../../../services/Theme/colors';
import styles from './UserProfile.module.scss';
import { remCalc } from '../../../services/Tools';
import Avatar from '../../Atoms/Avatar';
import Gender from '../Gender';

function UserProfile({
  picture, name, login, locality, gender, nameColor, loginColor, localityColor, loading,
}) {
  return (
    <div className={styles.Root}>
      <If condition={loading}>
        <Then>
          <>
            <Skeleton variant="circular" width={remCalc(48)} height={remCalc(48)} animation="wave" />
            <div className={styles.Title}>
              <div className={styles.Name}>
                <Skeleton width={remCalc(92)} height={remCalc(20)} animation="wave" />
              </div>
              <div className={styles.Subtitle}>
                <Skeleton width={remCalc(64)} height={remCalc(15)} animation="wave" />
                <div className={styles.Locality}>
                  <Skeleton variant="rounded" width={remCalc(10)} height={remCalc(10)} animation="wave" />
                  <Skeleton width={remCalc(64)} height={remCalc(15)} animation="wave" />
                </div>
              </div>
            </div>
          </>
        </Then>
        <Else>
          <>
            <Avatar
              size="large"
              image={picture}
            >
              {login}
            </Avatar>
            <div className={styles.Title}>
              <div className={styles.Name}>
                <Typography variant="h3" color={nameColor}>{name}</Typography>
                <Gender gender={gender} badge size="xxsmall" />
              </div>
              <div className={styles.Subtitle}>
                <Typography variant="body2" color={loginColor}>{login}</Typography>
                <div className={styles.Locality}>
                  <Icon ionIcon={IoPin} size="xxsmall" color="alert dark" />
                  <Typography variant="body2" color={localityColor}>{locality}</Typography>
                </div>
              </div>
            </div>
          </>
        </Else>
      </If>
    </div>
  );
}

UserProfile.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  login: PropTypes.string,
  locality: PropTypes.string,
  gender: PropTypes.oneOf(['male', 'female', 'other']),
  nameColor: PropTypes.oneOf(colors),
  loginColor: PropTypes.oneOf(colors),
  localityColor: PropTypes.oneOf(colors),
  loading: PropTypes.bool,
};

UserProfile.defaultProps = {
  picture: undefined,
  name: 'name',
  login: 'login',
  locality: 'Locality',
  gender: 'other',
  nameColor: 'content1',
  loginColor: 'content1',
  localityColor: 'content1',
  loading: false,
};

export default React.memo(UserProfile);
