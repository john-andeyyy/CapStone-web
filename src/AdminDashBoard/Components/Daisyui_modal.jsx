import React, { useState } from 'react';

const Daisyui_modal = ({ children, isModalOpen, setIsModalOpen }) => {
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button className="btn" onClick={openModal}>
                Open Modal
            </button>
            {isModalOpen && (
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle " open>
                    <div className="modal-box bg-accent">
                        {children} {/* This will render whatever you pass as children */}
                        <div className="modal-action">
                            {/* <button className="btn" onClick={closeModal}>
                                Close
                            </button> */}
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default Daisyui_modal;
