import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function TheDeanTeam() {
    const [members, setMembers] = useState([]);
    const BASEURL = import.meta.env.VITE_BASEURL;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${BASEURL}/members/group-members`);
                setMembers(response.data); // Ensure this is an array
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, []);

    const getProfileImage = (profilePicture) => {

        // Check if the profile picture is available
        if (profilePicture) {
            return `data:image/jpeg;base64,${profilePicture}`; // Adjust to image format (jpeg/png)
        } else {
            return "https://via.placeholder.com/150"; // Fallback if no image
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto ">
            <h1 className="text-3xl font-bold mb-4 text-green-500">DenTeam:</h1>

            <div className=" p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.length > 0 ? (
                    members.map(member => (
                        <div key={member._id} className="card card-compact bg-secondary shadow-xl">
                            <figure>
                                <img
                                    src={getProfileImage(member.ProfilePicture)} // Handle base64 image
                                    alt={`${member.FirstName} ${member.LastName}`}
                                    className="object-cover h-48 pt-5 " // Ensures the image covers the card
                                />
                            </figure>
                            <div className="card-body">
                                <h1 className="card-title">{`${member.FirstName} ${member.LastName}`}</h1>
                                <h4>Role: {member.Role}</h4>
                                <p>Contact Number: {member.ContactNumber}</p>
                                <div className='flex space-x-5'>
                                    <a href={member.Facebooklink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Facebook Profile
                                    </a>
                                    <a href={member.Email} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center">No members found.</p>
                )}
            </div>
        </div>
    );
}
