import React from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  // Router
  const navigate = useNavigate();

  return (
    <div>
      <h1>Settings</h1>
      <button type="button" onClick={() => navigate('/applications')}>Applications</button>
    </div>
  );
}

export default React.memo(Settings);
