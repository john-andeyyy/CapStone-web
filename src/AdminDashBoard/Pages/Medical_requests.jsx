import { useEffect, useState } from 'react';
import Modal from '../Components/Modal';
import axios from 'axios';

export default function MedicalRequests() {
  const BASEURL = import.meta.env.VITE_BASEURL;

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [archiveConfirmation, setArchiveConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // Default filter status

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`, {
          withCredentials: true
        });

        if (response.status === 200) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    getAppointments();
  }, [BASEURL]);

  const filteredRequests = requests.filter((request) => {
    const showBasedOnStatus = (status) => {
      switch (status) {
        case 'Pending':
          return request.medcertiStatus === 'Pending';
        case 'Approved':
          return request.medcertiStatus === 'Approved';
        case 'Rejected':
          return request.medcertiStatus === 'Rejected';
        case 'Archive':
          return request.medcertiStatus === 'Archive';
        case 'All':
          return request.medcertiStatus !== 'null'; // Exclude requests with null medcertiStatus
        default:
          return false;
      }
    };

    return (
      request.patient.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      showBasedOnStatus(statusFilter)
    );
  });

  const handleDeleteRequest = async () => {
    if (selectedRequest) {
      const confirmed = window.confirm(`Are you sure you want to delete the request for: ${selectedRequest.patient.FirstName} ${selectedRequest.patient.LastName}?`);
      if (confirmed) {
        try {
          await axios.delete(`${BASEURL}/Appointments/appointments/${selectedRequest.id}`, {
            withCredentials: true
          });
          setRequests(requests.filter((request) => request.id !== selectedRequest.id));
          setDeleteConfirmation(false);
          setSelectedRequest(null);
        } catch (error) {
          console.error('Error deleting request:', error);
        }
      }
    }
  };

  const handleArchiveRequest = async () => {
    try {
      await axios.patch(`${BASEURL}/Appointments/appointments/${selectedRequest.id}`,
        { status: 'Archive' },
        { withCredentials: true }
      );
      setRequests(requests.map((request) =>
        request.id === selectedRequest.id ? { ...request, medcertiStatus: 'Archive' } : request
      ));
      setArchiveConfirmation(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error archiving request:', error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await axios.patch(`${BASEURL}/Appointments/appointments/${selectedRequest.id}`,
        { status: 'Accepted' },
        { withCredentials: true }
      );
      setRequests(requests.map((request) =>
        request.id === selectedRequest.id ? { ...request, medcertiStatus: 'Accepted' } : request
      ));
      setAcceptConfirmation(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
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
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Archive">Archive</option>
        </select>
      </div>

      {/* Requests Section */}
      <div className="shadow-md rounded overflow-hidden">
        <div className="bg-neutral p-2 flex text-white">
          <div className="flex-1 font-bold">Name</div>
          <div className="flex-1 font-bold">Date</div>
          <div className="flex-1 font-bold hidden md:block">Procedure</div>
          <div className="flex-1 font-bold hidden md:block">Status</div> {/* Add Status Column */}
          {statusFilter === 'Pending' && (
            <div className="flex-1 font-bold text-center">Actions</div>
          )}
        </div>
        {filteredRequests.length === 0 ? (
          <div className="p-4 text-gray-500">No requests found.</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="flex justify-between border-b p-2 px-4">
              <div className="flex-1">{request.patient.FirstName} {request.patient.LastName}</div>
              <div className="flex-1">{new Date(request.date).toLocaleDateString()}</div>
              <div className="flex-1 hidden md:block">{request.procedures.map(proc => proc.name).join(', ')}</div>
              <div className="flex-1 hidden md:block">{request.medcertiStatus}</div> {/* Display Status */}
              {request.medcertiStatus === 'Pending' && statusFilter === 'Pending' && (
                <div className="flex-1 text-center">
                  <button className="text-green-500 " onClick={() => {
                    setSelectedRequest(request);
                    setAcceptConfirmation(true);
                  }}>
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                  <button className="text-red-500 mx-2" onClick={() => {
                    setSelectedRequest(request);
                    setDeleteConfirmation(true);
                  }}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <button className="text-white-500" onClick={() => {
                    setSelectedRequest(request);
                    setArchiveConfirmation(true);
                  }}>
                    <span className="material-symbols-outlined">archive</span>
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
        <p className="text-sm">Are you sure you want to delete the request for: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleDeleteRequest} className="btn btn-danger text-sm mr-2">Yes, Delete</button>
          <button onClick={() => setDeleteConfirmation(false)} className="btn btn-secondary text-sm">Cancel</button>
        </div>
      </Modal>

      {/* Accept Confirmation Modal */}
      <Modal isOpen={acceptConfirmation} close={() => setAcceptConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Acceptance</h3>
        <p className="text-sm">Are you sure you want to accept the request from: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleAcceptRequest} className="btn btn-success text-sm mr-2">Okay</button>
          <button onClick={() => setAcceptConfirmation(false)} className="btn btn-secondary text-sm">Close</button>
        </div>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal isOpen={archiveConfirmation} close={() => setArchiveConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Archiving</h3>
        <p className="text-sm">Are you sure you want to archive the request from: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleArchiveRequest} className="btn btn-success text-sm mr-2">Archive</button>
          <button onClick={() => setArchiveConfirmation(false)} className="btn btn-secondary text-sm">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
