import { useEffect } from 'react';
import { apiClient } from '../hooks/useApi';

function Claims() {
  useEffect(() => {
    apiClient.get('claims');
  }, []);

  return (
    <div>
      <h1>Claims</h1>
    </div>
  );
}

export default Claims;
