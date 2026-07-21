import { useEffect } from 'react';
import { apiClient } from '../hooks/useApi';

function Patients() {
  useEffect(() => {
    apiClient.get('patients');
  }, []);

  return (
    <div>
      <h1>Patients</h1>
    </div>
  );
}

export default Patients;
