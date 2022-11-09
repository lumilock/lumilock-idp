export const UPDATE_HEADER = 'UPDATE_HEADER';
export const INIT = 'INIT';

const initialState = {
  icon: undefined,
  title: '',
};

/**
 * Reducer that manage user infos
 */
// eslint-disable-next-line default-param-last
export function headerReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    // When we are updating the icon and the title
    case UPDATE_HEADER: {
      return { ...state, icon: payload?.icon, title: payload?.title };
    }
    // Function to re-init all the user store
    case INIT: {
      return initialState;
    }
    default:
      return state;
  }
}
