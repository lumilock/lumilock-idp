async function requestCatch(err = undefined, debuMsg = '', setFormError = undefined, callbackError = undefined, mainCallback = undefined) {
  if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(debuMsg, err);
  }
  if (err?.status === 400) {
    const error = await err.json();

    if (!!setFormError && typeof error?.message === 'object' && Object.keys(error?.message)?.length > 0) {
      Object.keys(error?.message).forEach((key) => {
        setFormError(key, { type: 'custom', message: error?.message?.[key] });
      });
    } else if (callbackError) {
      callbackError();
    }
  }
  if (mainCallback) {
    mainCallback();
  }
}

export default requestCatch;
