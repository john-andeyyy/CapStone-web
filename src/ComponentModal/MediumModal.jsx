import React from 'react';

const SemiFullModal = ({ isOpen, onClose, children }) => {
    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box w-[50%] h-[50%] max-w-full flex flex-col relative  bg-secondary">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 z-10"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className='overflow-auto max-h-[90%] mt-8 px-5'> 
                    {children}
                </div>
            </div>
        </dialog>
    );
};

export default SemiFullModal;
