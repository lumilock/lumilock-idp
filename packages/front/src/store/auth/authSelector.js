import { createSelector } from 'reselect';

// All data of the auth store
export const authSelector = ({ auth }) => auth;

// Current state of the auth store
export const authStateSelector = ({ auth }) => ({
  loading: auth.loading,
  loaded: auth.loaded,
  hasData: !!auth.user,
});

// Current user information
export const authInfoSelector = ({ auth }) => auth.user;

// Current user id
export const authIdSelector = ({ auth }) => auth?.user?.id;

// Get only user profile infos
export const authProfileSelector = createSelector(
  authInfoSelector,
  (user) => {
    if (!user) return {};
    return {
      name: user?.name,
      login: user?.login,
      picture: user?.picture,
    };
  },
);

// Get only permissions and roles
export const permissionsSelector = createSelector(
  authInfoSelector,
  (user) => {
    if (!user) return 'none';
    return {
      permissions: user?.permissions,
      role: user?.role,
    };
  },
);
