import React from 'react';

const SemiFullModal = ({ isOpen, onClose, children }) => {
    return (
        <dialog open={isOpen} className="modal">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="modal-box w-[50%] max-w-full flex flex-col relative  bg-[#C6E4DA] p-6 rounded-lg">
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
            </div>
        </dialog>
    );
};

export default SemiFullModal;
