import React, { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { IoIosRefresh, IoIosSave } from 'react-icons/io';

import { Button } from '../../Atoms';
import styles from './FormCard.module.scss';

function FormCard({
  handleSubmit, handleReset, resetTitle, submitTitle, resetIcon, submitIcon, children,
}) {
  return (
    <form className={styles.Form} method="path" action="#" onSubmit={handleSubmit}>
      <div className={styles.Card}>
        <div className={styles.InputsContainer}>
          {Children.map(children, (child) => (
            isValidElement(child) ? <div className={styles.InputBox}><child.type {...child.props} /></div> : child))}
        </div>
        <div className={styles.Buttons}>
          <Button type="button" variant="text" color="alert dark" startIcon={resetIcon} onClick={handleReset}>{resetTitle}</Button>
          <Button type="submit" color="content1" startIcon={submitIcon}>{submitTitle}</Button>
        </div>
      </div>
    </form>
  );
}

FormCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handleReset: PropTypes.func,
  handleSubmit: PropTypes.func,
  resetTitle: PropTypes.string,
  resetIcon: PropTypes.func,
  submitTitle: PropTypes.string,
  submitIcon: PropTypes.func,
};

FormCard.defaultProps = {
  handleReset: () => {},
  handleSubmit: () => {},
  resetTitle: 'Annuler',
  resetIcon: IoIosRefresh,
  submitTitle: 'Modifier',
  submitIcon: IoIosSave,
};

export default React.memo(FormCard);
