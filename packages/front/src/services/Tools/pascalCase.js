import { camelCase, startCase } from 'lodash';

function pascalCase(str) {
  return startCase(camelCase(str)).replace(/ /g, '');
}

export default pascalCase;
