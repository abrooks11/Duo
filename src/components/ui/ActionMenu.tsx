import React from "react";
import useGlobalContext from "../../hooks/useGlobalContext";
import { ActionTypes } from "../../context/GlobalContext";

function ActionMenu() {
  // GLOBAL STATE:
  const { state, dispatch } = useGlobalContext();

  // function to toggle display of upload modal
  const toggleUploadModalDisplay = () => {
    dispatch({
      type: ActionTypes.DISPLAY_UPLOAD_MODAL,
      payload: !state.uploadModal,
    });
  };

  return (
    <div className="action-menu-wrapper">
      <button onClick={toggleUploadModalDisplay}>U</button>
      <button>D</button>
      <button>S</button>
    </div>
  );
}

export default ActionMenu;
