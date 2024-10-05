import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';
export default function Grouplist() {
    const BASEURL = import.meta.env.VITE_BASEURL;
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [isTableView, setIsTableView] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [selectedMemberData, setselectedMemberData] = useState('');
    const [isViewModalOpen, setisViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        ContactNumber: '',
        Facebooklink: '',
        ProfilePicture: null, // File input
        Role: '',
        Email: '',
    }); // State to hold form data for editing

    useEffect(() => {
        let isMounted = true; // flag to track component mount status

        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${BASEURL}/members/group-members`);
                if (isMounted) { // only set state if mounted
                    setMembers(response.data);
                    console.log(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    // setError(err.message);
                    alert(err.message);
                }
            } finally {
                if (isMounted) {
                    // setLoading(false);
                }
            }
        };

        fetchMembers();

        return () => {
            isMounted = false; // cleanup function sets isMounted to false
        };
    }, []);

    const getProfileImage = (profilePicture) => {
        if (profilePicture) {
            return `data:image/jpeg;base64,${profilePicture}`;
        } else {
            return "https://via.placeholder.com/150";
        }
    };

    // Filtered members based on search term
    const filteredMembers = members.filter(member =>
        `${member.FirstName} ${member.LastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle edit click
    const handleEditClick = (id) => {
        setSelectedMemberId(id);
        setIsModalOpen(true);

        setFormData({
            FirstName: selectedMemberData.FirstName,
            LastName: selectedMemberData.LastName,
            MiddleName: selectedMemberData.MiddleName || '',
            ContactNumber: selectedMemberData.ContactNumber,
            Facebooklink: selectedMemberData.Facebooklink || '',
            ProfilePicture: selectedMemberData.ProfilePicture || null,
            Role: selectedMemberData.Role,
            Email: selectedMemberData.Email,
        });

    };

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image upload
    const handleImageChange = (e) => {
        setFormData({ ...formData, ProfilePicture: e.target.files[0] });
    };

    // Handle form submission for updating member data
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        axios.put(`${BASEURL}/members/group-members/${selectedMemberId}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                showToast('info', 'Member updated successfully!');

                setIsModalOpen(false); // Close the modal
                // Optionally refetch the member list to show the updated data
                axios.get(`${BASEURL}/members/group-members`)
                    .then(response => setMembers(response.data));
            })
            .catch(error => {
                alert("Error updating member: " + error.message);
            });
    };

    const handleDelete = (userid) => {
        axios.delete(`${BASEURL}/members/group-members/${userid}`)
            .then(() => {
                setMembers(prevMembers => prevMembers.filter(mem => mem._id !== userid));
                showToast('info', 'Member Delete successfully!');

            })
            .catch((error) => {
                alert('Error:', error.message);
            })
            .finally(() => {
                setisDeleteModalOpen(false);
            });
    }

    return (
        <div>
            <h1 className='text-2xl font-bold text-green-500 p-10'>The DenTeam Members:</h1>

            {/* Search input field */}
            <div className="max-w-7xl mx-auto p-8">
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            {/* Toggle buttons for views */}
            <div className="max-w-7xl mx-auto p-8 flex space-x-4">
                <button
                    onClick={() => setIsTableView(false)}
                    className={`px-4 py-2 rounded-md ${!isTableView ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Card View
                </button>
                <button
                    onClick={() => setIsTableView(true)}
                    className={`px-4 py-2 rounded-md ${isTableView ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Table View
                </button>
            </div>

            {/* Render members based on the selected view */}
            {isTableView ? (
                <div className="overflow-auto max-h-72"> {/* Set your desired max height */}
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-secondary ">
                            <tr>
                                <th className="p-2 border-b sticky top-0 bg-secondary  z-10">Name</th>
                                <th className="p-2 border-b sticky top-0 bg-secondary  z-10">Role</th>
                                <th className="p-2 border-b sticky top-0 bg-secondary  z-10">Contact Number</th>
                                <th className="p-2 border-b sticky top-0 bg-secondary  z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map(member => (
                                    <tr key={member._id} className="hover:bg-secondary">
                                        <td className="p-2 border-b">{`${member.FirstName} ${member.LastName}`}</td>
                                        <td className="p-2 border-b">{member.Role}</td>
                                        <td className="p-2 border-b">{member.ContactNumber}</td>
                                        <td className="p-2 border-b space-x-5 text-center">
                                            <button
                                                onClick={() => {
                                                    setisViewModalOpen(true);
                                                    setselectedMemberData(member);
                                                }}
                                                className="text-green-500"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleEditClick(member._id);
                                                    setselectedMemberData(member);
                                                }}
                                                className="text-blue-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setisDeleteModalOpen(true);
                                                    setselectedMemberData(member);
                                                }}
                                                className="text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">No members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            ) : (
                <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <div key={member._id} className="card card-compact bg-secondary shadow-xl">
                                <div className='text-right pt-3 pr-3'>
                                    <button onClick={() => handleEditClick(member._id)} className="text-blue-500">Edit</button>
                                </div>
                                <figure>
                                    <img
                                        src={getProfileImage(member.ProfilePicture)}
                                        alt={`${member.FirstName} ${member.LastName}`}
                                        className="object-cover h-48 pt-5"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h1 className="card-title">{`${member.FirstName} ${member.LastName}`}</h1>
                                    <h4>Role: {member.Role}</h4>
                                    <p>Contact Number: {member.ContactNumber}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center">No members found.</p>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-primary p-8 rounded-md shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Edit Member</h2>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                name="FirstName"
                                value={formData.FirstName}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Last Name"
                            />
                            <input
                                type="text"
                                name="MiddleName"
                                value={formData.MiddleName}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Middle Name"
                            />
                            <input
                                type="text"
                                name="ContactNumber"
                                value={formData.ContactNumber}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Contact Number"
                            />
                            <input
                                type="text"
                                name="Facebooklink"
                                value={formData.Facebooklink}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Facebook Link"
                            />
                            <input
                                type="file"
                                name="ProfilePicture"
                                onChange={handleImageChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <input
                                type="text"
                                name="Role"
                                value={formData.Role}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Role"
                            />
                            <input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleInputChange}
                                className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Email"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-red-500 rounded-md"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* //! DELETE */}
            {isDeleteModalOpen && selectedMemberData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full">
                        <h1 className="text-center font-bold text-xl mb-4">Delete Confirmation</h1>
                        <div className="mb-6 text-center">
                            <h2 className="text-lg">
                                Are you sure you want to delete the group member{" "}
                                <span className="font-semibold">{selectedMemberData.FirstName}</span>?
                            </h2>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setisDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(selectedMemberData._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedMemberData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-secondary p-8 rounded-md shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Member Details</h2>
                        {/* Display profile picture if it exists */}
                        {selectedMemberData.ProfilePicture && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={getProfileImage(selectedMemberData.ProfilePicture)}
                                    alt={`${selectedMemberData.FirstName} ${selectedMemberData.LastName}`}
                                    className="w-40 h-full object-cover rounded-md"
                                />
                            </div>
                        )}
                        <div className="mb-2">
                            <strong>First Name:</strong> {selectedMemberData.FirstName}
                        </div>
                        <div className="mb-2">
                            <strong>Last Name:</strong> {selectedMemberData.LastName}
                        </div>
                        <div className="mb-2">
                            <strong>Middle Name:</strong> {selectedMemberData.MiddleName || 'N/A'}
                        </div>
                        <div className="mb-2">
                            <strong>Contact Number:</strong> {selectedMemberData.ContactNumber}
                        </div>
                        <div className="mb-2">
                            <strong>Facebook Link:</strong> {selectedMemberData.Facebooklink || 'N/A'}
                        </div>
                        <div className="mb-2">
                            <strong>Role:</strong> {selectedMemberData.Role}
                        </div>
                        <div className="mb-2">
                            <strong>Email:</strong> {selectedMemberData.Email}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setisViewModalOpen(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
