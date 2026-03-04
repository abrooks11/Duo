import { useState } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import { ActionTypes } from '../../context/GlobalContext';

function ActionMenu() {
  // GLOBAL STATE:
  const { state, dispatch } = useGlobalContext();
  const [syncing, setSyncing] = useState(false);

  // function to toggle display of upload modal
  const toggleUploadModalDisplay = () => {
    dispatch({
      type: ActionTypes.DISPLAY_UPLOAD_MODAL,
      payload: !state.uploadModal,
    });
  };

  const handleSyncPatients = async () => {
    setSyncing(true);
    try {
      await fetch('/api/patients/sync', { method: 'POST' });
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
