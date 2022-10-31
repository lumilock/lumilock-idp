import React from 'react';
import PropTypes from 'prop-types';

import { remCalc } from '../../../../../services/Tools';
import CheckboxControlled from '../CheckboxControlled';
import {
  Else, If, Skeleton, Then, Typography,
} from '../../../../Electrons';

function CheckboxGroup({ label, loading, checkbox }) {
  return (
    <div>
      <If condition={!loading}>
        <Then>
          <Typography component="p" variant="subtitle2" color="content3">{label}</Typography>
        </Then>
        <Else>
          <Skeleton height={remCalc(15)} width="25%" animation="wave" />
        </Else>
      </If>
      {checkbox?.map((c) => (
        <CheckboxControlled
          key={c?.name}
          loading={loading}
          {...c}
        />
      ))}
    </div>
  );
}

CheckboxGroup.propTypes = {
  label: PropTypes.string,
  loading: PropTypes.bool,
  checkbox: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};

CheckboxGroup.defaultProps = {
  label: '',
  loading: false,
  checkbox: [],
};

export default React.memo(CheckboxGroup);
