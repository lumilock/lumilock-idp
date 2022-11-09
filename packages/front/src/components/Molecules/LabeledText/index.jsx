import React from 'react';
import PropTypes from 'prop-types';

import { remCalc } from '../../../services/Tools';
import {
  Else, If, Skeleton, Then, Typography,
} from '../../Electrons';
import styles from './LabeledText.module.scss';

function LabeledText({ label, text, loading }) {
  return (
    <div className={styles.Root}>
      <If condition={!loading}>
        <Then>
          <>
            <Typography variant="subtitle2" color="content3">{label}</Typography>
            <If condition={!!(typeof text === 'string')}>
              <Then>
                <Typography ellipsis variant="subtitle1" color="content1">{text}</Typography>
              </Then>
              <Else>
                {Array.isArray(text) && text?.length > 0 && text?.map((t) => (
                  <Typography ellipsis variant="subtitle1" color="content1" key={t}>{t}</Typography>
                ))}
              </Else>
            </If>
          </>
        </Then>
        <Else>
          <Skeleton width="33%" height={remCalc(15)} />
          <Skeleton width="75%" height={remCalc(21)} />
        </Else>
      </If>
    </div>
  );
}

LabeledText.propTypes = {
  label: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  loading: PropTypes.bool,
};

LabeledText.defaultProps = {
  label: 'label',
  text: 'text',
  loading: false,
};

export default React.memo(LabeledText);
