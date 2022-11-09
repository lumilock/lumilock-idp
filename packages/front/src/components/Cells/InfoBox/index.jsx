import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { IoIosTrash } from 'react-icons/io';

import { colors } from '../../../services/Theme';
import { Button, Toggle } from '../../Atoms';
import TitleSection from '../TitleSection';
import styles from './InfoBox.module.scss';

function InfoBox({
  open, onClick, title, icon, className, color, children,
}) {
  return (
    <Toggle visible={!!open && open !== null} from={{ opacity: 1 }} orientation="vertical">
      <div className={clsx(styles.Root, className)}>
        <div className={styles.Card}>
          <TitleSection icon={icon} color={color} variant="underlined" title={title} />
          {children}
          <div className={styles.ButtonContainer}>
            <Button
              startIcon={IoIosTrash}
              className={styles.Button}
              onClick={onClick}
              variant="text"
              color="alert dark"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </Toggle>
  );
}

InfoBox.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.oneOf(colors),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

InfoBox.defaultProps = {
  open: false,
  title: 'Title',
  icon: undefined,
  color: 'content1',
  onClick: () => {},
  className: '',
};

export default React.memo(InfoBox);
