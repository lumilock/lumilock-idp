import React from 'react';
import PropTypes from 'prop-types';
import { IoIosRefresh, IoIosSave } from 'react-icons/io';

import { Button } from '../../Atoms';
import styles from './ProfileCard.module.scss';

function ProfileCard({ handleSubmit, handleReset, children }) {
  return (
    <form className={styles.Form} method="path" action="#" onSubmit={handleSubmit}>
      <div className={styles.Card}>
        {children}
        <div className={styles.Buttons}>
          <Button type="button" variant="text" color="standard" startIcon={IoIosRefresh} onClick={handleReset}>Annuler</Button>
          <Button type="submit" color="content1" startIcon={IoIosSave}>Modifier</Button>
        </div>
      </div>
    </form>
  );
}

ProfileCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handleReset: PropTypes.func,
  handleSubmit: PropTypes.func,
};

ProfileCard.defaultProps = {
  handleReset: () => {},
  handleSubmit: () => {},
};

export default React.memo(ProfileCard);
