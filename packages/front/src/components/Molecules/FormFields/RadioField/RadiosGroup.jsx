import React, { useId } from 'react';
import PropTypes from 'prop-types';

import { remCalc } from '../../../../services/Tools';
import RadioControlled from './RadioControlled';
import {
  Else, If, Skeleton, Then, Typography,
} from '../../../Electrons';

function RadiosGroup({ label, loading, radios }) {
  const compId = useId();

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
      {radios?.map((r) => (
        <RadioControlled
          key={`${compId}${r?.name}-${r?.value}`}
          loading={loading}
          {...r}
        />
      ))}
    </div>
  );
}

RadiosGroup.propTypes = {
  label: PropTypes.string,
  loading: PropTypes.bool,
  radios: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};

RadiosGroup.defaultProps = {
  label: '',
  loading: false,
  radios: [],
};

export default React.memo(RadiosGroup);
