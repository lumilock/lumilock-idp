import React from 'react';

function ResetPassword() {
  return (
    <div>
      <p>Mot de passe oublié ?</p>
      <p>Enter the identity associated with your account and we&apos;ll send you a link to reset your password.</p>
      <p>Identity:</p>
      <p>Send</p>
      <p>Don&apos;t have an account ? Contact an administrator</p>
    </div>
  );
}

export default React.memo(ResetPassword);
