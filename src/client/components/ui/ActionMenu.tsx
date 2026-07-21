import { useState } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';

function ActionMenu() {
  const { state, dispatch } = useGlobalContext();
  const [syncing, setSyncing] = useState(false);

  const toggleUploadModalDisplay = () => {
    dispatch({
      type: 'ui/DISPLAY_UPLOAD_MODAL',
      payload: { isOpen: !state.ui.uploadModal },
    });
  };

  const handleSyncPatients = async () => {
    setSyncing(true);
    try {
      await fetch('/api/patients/sync', { method: 'POST' });
      await fetch('/api/patients/sync-balances', { method: 'POST' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="action-menu-wrapper">
      <button onClick={toggleUploadModalDisplay}>U</button>
      <button>D</button>
      <button onClick={handleSyncPatients} disabled={syncing}>
        {syncing ? '...' : 'S'}
      </button>
    </div>
  );
}

export default ActionMenu;
