import { useState } from "react";
import Modal from "./Modal";

// For actions that cannot be undone: the button stays locked until the word is typed.
function ConfirmDialog({ title, message, confirmWord = "DELETE", confirmLabel, onConfirm, onCancel }) {
  const [typed, setTyped] = useState("");

  return (
    <Modal title={title} onClose={onCancel}>
      <div className="form">
        <p className="dialog-message">{message}</p>

        <div className="field">
          <label htmlFor="confirm-word">
            Type <strong>{confirmWord}</strong> to confirm
          </label>
          <input
            id="confirm-word"
            className="input"
            autoComplete="off"
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger-solid"
            disabled={typed !== confirmWord}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
