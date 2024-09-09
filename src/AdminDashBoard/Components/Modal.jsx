import React from 'react';

export default function Modal({ isOpen, close, children }) {
    return (
        <div>
            {isOpen && (
                <dialog open className="modal ">
                    <div className="modal-box bg-modal">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        {children}
                        {/* <div className="modal-action">
                            <form method="dialog">
                                <button type="button" className="btn" onClick={close}>Close</button>
                            </form>
                        </div> */}
                    </div>
                </dialog>
            )}
        </div>
    );
}
