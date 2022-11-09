/**
 * This function add the Bearer token from localStorage to the header of request
 */
export default function authHeader() {
  // we get users info from the localStorage
  const tokenInfo = JSON.parse(localStorage.getItem('tokenInfo'));
  if (tokenInfo) {
    const { token } = tokenInfo;
    // we check that the token exist
    if (tokenInfo && token) {
      // then we return the header autorization bearer
      return { Authorization: `Bearer ${token}` };
    }
  }
  // else we return an empty object
  return {};
}
