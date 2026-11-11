import { useEffect } from "react";

function Modal({ title, onClose, children }) {
  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: remove the listener when the modal disappears
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    // Clicking the dark backdrop closes the modal
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation: clicks inside the box should NOT close it */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
