import React from 'react';

const DeleteTipModal = ({ tip, onClose, onDelete }) => {
    const getProfileImage = (profilePicture) => {
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#C6E4DA] p-8 rounded-lg shadow-lg w-[400px] h-[500px] flex flex-col">
                <h2 className="font-bold text-2xl mb-4 text-center text-red-500">Confirm Delete</h2>
                <div className="flex justify-center mb-4">
                    <img
                        src={getProfileImage(tip.image)}
                        alt={tip.Title}
                        className="w-40 h-40 object-cover rounded-full shadow-md"
                    />
                </div>
                <p className="text-lg text-center flex-grow">
                    Are you sure you want to delete the tip titled:
                </p>
                <p className="text-center text-lg font-semibold mb-6">
                    <strong>"{tip.Title}"</strong>
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-[#4285F4] hover:bg-[#0C65F8] text-black py-2 px-4 rounded-lg transition duration-200"
                        onClick={onDelete}
                    >
                        Confirm Delete
                    </button>

                    <button
                        className="bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black py-2 px-4 rounded-lg mr-2 transition duration-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteTipModal;
