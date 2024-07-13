import { useState } from 'react';
import Modal from '../Components/Modal';

export default function MedicalRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([
    { id: '001', name: 'Devin Book', date: '2024-03-12', procedure: 'Checkup', status: 'pending' },
    { id: '002', name: 'James Bond', date: '2024-03-10', procedure: 'Teeth Cleaning', status: 'pending' },
    { id: '003', name: 'Pogi Ako', date: '2024-03-11', procedure: 'Root Canal', status: 'pending' },
    { id: '004', name: 'Lara Croft', date: '2024-03-05', procedure: 'X-Ray', status: 'pending' },
    { id: '005', name: 'Peter Parker', date: '2024-03-08', procedure: 'Filling', status: 'pending' },
    { id: '006', name: 'Clark Kent', date: '2024-03-09', procedure: 'Extraction', status: 'accepted' },
    { id: '007', name: 'Bruce Wayne', date: '2024-03-07', procedure: 'Consultation', status: 'declined' },
    { id: '008', name: 'Diana Prince', date: '2024-03-06', procedure: 'Orthodontics', status: 'pending' },
    { id: '009', name: 'Tony Stark', date: '2024-03-04', procedure: 'Whitening', status: 'accepted' },
  ]);

  const [statusFilter, setStatusFilter] = useState('pending');

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) && request.status === statusFilter
  );

  const handleDeleteRequest = () => {
    setRequests(requests.filter((request) => request.id !== selectedRequest.id));
    setDeleteConfirmation(false);
    setSelectedRequest(null);
  };

  const handleAcceptRequest = () => {
    setRequests(requests.map((request) =>
      request.id === selectedRequest.id ? { ...request, status: 'accepted' } : request
    ));
    setAcceptConfirmation(false);
    setSelectedRequest(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold py-4 lg:py-0">Medical Certificate Requests</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <div className="absolute left-3 top-3 h-4 w-4 text-gray-500">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label htmlFor="status" className="block mb-2">Filter by Status:</label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Requests Section */}
      <div className="shadow-md rounded overflow-hidden">
        <div className="bg-neutral p-2 flex text-white">
          <div className="flex-1 font-bold">Name</div>
          <div className="flex-1 font-bold">Date</div>
          <div className="flex-1 font-bold hidden md:block">Procedure</div>
          {statusFilter === 'pending' && (
            <div className="flex-1 font-bold text-center">Actions</div>
          )}
        </div>
        {filteredRequests.length === 0 ? (
          <div className="p-4 text-gray-500">No requests found.</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="flex justify-between border-b p-2 px-4">
              <div className="flex-1">{request.name}</div>
              <div className="flex-1">{request.date}</div>
              <div className="flex-1 hidden md:block">{request.procedure}</div>
              {request.status === 'pending' && statusFilter === 'pending' && (
                <div className="flex-1 text-center">
                  <button className="text-green-500 mr-2" onClick={() => {
                    setSelectedRequest(request);
                    setAcceptConfirmation(true);
                  }}>
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                  <button className="text-red-500" onClick={() => {
                    setSelectedRequest(request);
                    setDeleteConfirmation(true);
                  }}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirmation} close={() => setDeleteConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="text-sm">Are you sure you want to delete the request for: {selectedRequest?.name}?</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleDeleteRequest} className="btn btn-danger text-sm mr-2">Yes, Delete</button>
          <button onClick={() => setDeleteConfirmation(false)} className="btn btn-secondary text-sm">Cancel</button>
        </div>
      </Modal>

      {/* Accept Confirmation Modal */}
      <Modal isOpen={acceptConfirmation} close={() => setAcceptConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Acceptance</h3>
        <p className="text-sm">Are you sure you want to accept the request from: {selectedRequest?.name}?</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleAcceptRequest} className="btn btn-success text-sm mr-2">Okay</button>
          <button onClick={() => setAcceptConfirmation(false)} className="btn btn-secondary text-sm">Close</button>
        </div>
      </Modal>
    </div>
  );
}
