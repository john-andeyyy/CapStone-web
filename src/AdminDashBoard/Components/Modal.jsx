
import React from 'react';

export default function Modal({ isOpen, close, children }) {
    return (
        <div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
                    <dialog open className="modal z-50">
                        <div className="modal-box bg-[#C6E4DA]">
                            <h3 className="font-bold text-lg text-center text-[#266D53] mb-5">Confirmation</h3>
                            {children}
                        </div>
                    </dialog>
                </>
            )}
        </div>
    );
}

// import React from 'react';

// export default function Modal({ isOpen, close, children }) {
//     return (
//         <div>
//             {isOpen && (
//                 <dialog open className="modal ">
//                     <div className="modal-box bg-neutral">
//                         <h3 className="font-bold text-lg">Hello! from the modal component</h3>
//                         {children}
//                         {/* <div className="modal-action">
//                             <form method="dialog">
//                                 <button type="button" className="btn" onClick={close}>Close</button>
//                             </form>
//                         </div> */}
//                     </div>
//                 </dialog>
//             )}
//         </div>
//     );
// }
