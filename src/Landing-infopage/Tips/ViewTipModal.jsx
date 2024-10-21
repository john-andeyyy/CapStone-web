import React from 'react';

const ViewTipModal = ({ tip, onClose }) => {
    const getProfileImage = (profilePicture) => {
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-accent p-6 rounded shadow-lg w-1/3">
                <div className="flex justify-end">
                    <button
                        className=" text-gray-500 py-2"
                        onClick={onClose}
                    >
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>
                <h2 className="font-bold text-xl mb-4 text-[#266D53] text-center">Tip Details</h2>
                <div className="flex justify-center mb-4">
                    <img
                        src={getProfileImage(tip.image)}
                        alt={tip.Title}
                        className="w-32 h-32 object-cover rounded-full shadow-md"
                    />
                </div>
                <p className="text-black font-bold text-center uppercase">Title:</p>
                <h2 className="font-bold text-lg  text-center mb-10 text-[#266D53]">{tip.Title}</h2>
                <p className="text-black uppercase  font-bold">Description:</p>
                <p>{tip.Description}</p>
            </div>
        </div>
    );
};

export default ViewTipModal;
