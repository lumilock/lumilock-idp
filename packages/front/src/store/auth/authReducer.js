export const START_LOADING_AUTH = 'START_LOADING_AUTH';
export const END_LOADING_AUTH = 'END_LOADING_AUTH';
export const UPDATE_USER_AUTH = 'UPDATE_USER_AUTH';
export const INIT = 'INIT';

const initialState = {
  loading: false,
  loaded: false,
  user: null,
};

/**
 * Reducer that manage user infos
 */
// eslint-disable-next-line default-param-last
export function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    // When we are fetching new user data
    case START_LOADING_AUTH: {
      return { ...state, loading: true, loaded: false };
    }
    // When we are updating the fetched user data
    case UPDATE_USER_AUTH: {
      return { ...state, user: payload };
    }
    // After having fetch and update user data
    case END_LOADING_AUTH: {
      return { ...state, loading: false, loaded: true };
    }
    // Function to re-init all the user store
    case INIT: {
      return initialState;
    }
    default:
      return state;
  }
}
