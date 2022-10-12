import {
  START_LOADING_AUTH,
  END_LOADING_AUTH,
  UPDATE_USER_AUTH,
  LOGOUT_AUTH,
  INIT,
} from './authReducer';
import { Auth } from '../../services/Api';

export const updateAction = () => async (dispatch) => {
  dispatch({
    type: START_LOADING_AUTH,
  });
  await Auth.profile()
    .then((res) => {
      if (res.status !== 200 && res.status !== 302) return Promise.reject(new Error('Unauthorized'));
      return res.json();
    })
    .then((user) => {
      dispatch({
        type: UPDATE_USER_AUTH,
        payload: user,
      });
    })
    // eslint-disable-next-line no-console
    .catch((err) => {
      if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('ERROR: [Store - Auth.profile]', err);
      }
    })
    .finally(() => {
      dispatch({
        type: END_LOADING_AUTH,
      });
    });
};

export const softUpdateAction = (payload) => async (dispatch) => {
  // Starting to update store
  await dispatch({
    type: START_LOADING_AUTH,
  });
  // Updating store
  await dispatch({
    type: UPDATE_USER_AUTH,
    payload,
  });
  // Ending to update store
  await dispatch({
    type: END_LOADING_AUTH,
  });
};

export const logoutAction = () => ({
  type: LOGOUT_AUTH,
  payload: null,
});

export const initAction = () => ({
  type: INIT,
  payload: null,
});
