import React from 'react';
import { useNavigate } from 'react-router-dom';

function Applications() {
  // Router
  const navigate = useNavigate();

  return (
    <div>
      <h1>Applications</h1>
      <button type="button" onClick={() => navigate('/settings')}>Settings</button>
    </div>
  );
}

export default React.memo(Applications);
