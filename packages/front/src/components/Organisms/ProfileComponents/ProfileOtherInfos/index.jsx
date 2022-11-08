import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { IoIosHelpCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { authInfoSelector } from '../../../../store/auth/authSelector';
import {
  Else, If, Skeleton, Then, Typography,
} from '../../../Electrons';
import { TitleSection } from '../../../Cells';
import styles from './ProfileOtherInfos.module.scss';

const OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

function ProfileOtherInfos({
  defaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  // Memos
  const hasDefaultData = useMemo(() => (!!defaultData && Object?.keys(defaultData)?.length > 0), [defaultData]);
  const {
    isActive,
    isArchived,
    createDateTime,
    lastChangedDateTime,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);

  const FormattedDate = (date) => new Date(date).toLocaleString(undefined, OPTIONS);

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosHelpCircle} title="Informations Complémentaires" variant="underlined" />
      <div className={styles.InfosContainer}>
        <If condition={!loading}>
          <Then>
            <>
              <Typography varian="subtitle1" color="content3">
                {clsx('Date de création du compte :', FormattedDate(createDateTime))}
              </Typography>
              <Typography varian="subtitle1" color="content3">
                {clsx('Date de création du compte :', FormattedDate(lastChangedDateTime))}
              </Typography>
              <If condition={!hasDefaultData}>
                <>
                  <Typography varian="subtitle1" color="content3">
                    {isActive ? 'Le compte est actif' : 'Le compte n\'est pas actif'}
                  </Typography>
                  <Typography varian="subtitle1" color="content3">
                    {isArchived ? 'Le compte est archivé' : 'Le compte n\'est pas archivé'}
                  </Typography>
                </>
              </If>
            </>
          </Then>
          <Else>
            <>
              <Skeleton width="26rem" />
              <Skeleton width="26rem" />
              <If condition={!hasDefaultData}>
                <>
                  <Skeleton width="12rem" />
                  <Skeleton width="14rem" />
                </>
              </If>
            </>
          </Else>
        </If>
      </div>
    </div>
  );
}

ProfileOtherInfos.propTypes = {
  defaultData: PropTypes.shape({
    isActive: PropTypes.bool,
    isArchived: PropTypes.bool,
    createDateTime: PropTypes.string,
    lastChangedDateTime: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

ProfileOtherInfos.defaultProps = {
  defaultData: undefined,
  loading: false,
};

export default React.memo(ProfileOtherInfos);
