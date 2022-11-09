import {
  UPDATE_HEADER,
  INIT,
} from './headerReducer';

export const updateAction = ({ icon, title }) => ({
  type: UPDATE_HEADER,
  payload: { icon, title },
});
export const initAction = () => ({
  type: INIT,
  payload: null,
});
