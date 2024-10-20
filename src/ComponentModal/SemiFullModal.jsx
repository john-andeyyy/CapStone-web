// SemiFullModal.js
import React from 'react';

const SemiFullModal = ({ isOpen, onClose, children }) => {
    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box w-[90%] h-[90%] max-w-full flex flex-col  relative p-5">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Modal content */}
                {children}
            </div>
        </dialog>
    );
};

export default SemiFullModal;
