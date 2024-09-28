import { useEffect, useState } from 'react';
import Modal from '../Components/Modal';
import axios from 'axios';
import { showToast } from '../Components/ToastNotification';

export default function MedicalRequests() {
  const BASEURL = import.meta.env.VITE_BASEURL;

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [archiveConfirmation, setArchiveConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const getAppointments = async () => {
    console.log('getAppointments start')

    setLoading(true);
    try {
      const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`, {
        withCredentials: true
      });
      console.log( 'getAppointments done')
      if (response.status === 200) {

        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAppointments();

  }, []);

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
          return ['Pending', 'Approved', 'Rejected', 'Archive'].includes(request.medcertiStatus);
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
      setActionLoading(true);
      try {
        await axios.get(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
          headers: {
            'Status': 'Rejected'
          },
          withCredentials: true
        });
        showToast('success', 'Request has been Rejected!');

        setRequests(requests.filter((request) => request.id !== selectedRequest.id));
        setDeleteConfirmation(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error deleting request:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleArchiveRequest = async () => {
    setActionLoading(true);
    try {
      await axios.get(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
        headers: {
          'Status': 'Archive'
        },
        withCredentials: true
      });
      showToast('success', 'Request has been Archive!');

      setRequests(requests.map((request) =>
        request.id === selectedRequest.id ? { ...request, medcertiStatus: 'Archive' } : request
      ));
      setArchiveConfirmation(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error archiving request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setActionLoading(true); 
    try {
      await axios.get(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
        headers: {
          'Status': 'Accepted'
        },
        withCredentials: true
      });
      showToast('success', 'Request has been Accepted!');

      setRequests(requests.map((request) =>
        request.id === selectedRequest.id ? { ...request, medcertiStatus: 'Accepted' } : request
      ));
      setAcceptConfirmation(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setActionLoading(false); 
    }
  };

  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
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
          <option value="Archive">Archive (delete)</option>
        </select>
      </div>

      {/* Show Loading */}
      {loading ? (
        <div className="text-center">Loading lists...</div>
      ) : (
        <>
          {/* Requests Section */}
          <div className="shadow-md rounded overflow-hidden">
            <div className="bg-neutral p-2 flex text-white">
              <div className="flex-1 font-bold">Name</div>
              <div className="flex-1 font-bold">Date</div>
              <div className="flex-1 font-bold hidden md:block">Procedure</div>
              <div className="flex-1 font-bold hidden md:block">Status</div>
              {statusFilter === 'Pending' || statusFilter === 'Archive' && (
                <div className="flex-1 font-bold text-center">Actions</div>
              )}
            </div>
            {filteredRequests.length === 0 ? (
              <div className="p-4 text-gray-500">No requests found.</div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between border-b p-2 px-4 cursor-pointer hover:bg-base-300"
                  onClick={() => openDetailModal(request)}
                >
                  <div className="flex-1">{request.patient.FirstName} {request.patient.LastName}</div>
                  <div className="flex-1">{new Date(request.date).toLocaleDateString()}</div>
                  <div className="flex-1 hidden md:block">{request.procedures.map(proc => proc.name).join(', ')}</div>
                  <div className="flex-1 hidden md:block">{request.medcertiStatus}</div>
                  {request.medcertiStatus === 'Pending' && statusFilter === 'Pending' || request.medcertiStatus === 'Archive' && statusFilter === 'Archive' && (
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
        </>
      )}

      {/* Action Loading Indicator */}
      {actionLoading && <div className="text-center my-2">Processing...</div>}

      {/* Modals for Confirmation */}
      <Modal isOpen={deleteConfirmation} close={() => setDeleteConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="text-sm">Are you sure you want to delete the request for: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleteConfirmation(false)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteRequest}>Delete</button>
        </div>
      </Modal>

      <Modal isOpen={archiveConfirmation} close={() => setArchiveConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Archive</h3>
        <p className="text-sm">Are you sure you want to archive the request for: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setArchiveConfirmation(false)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleArchiveRequest}>Archive</button>
        </div>
      </Modal>

      <Modal isOpen={acceptConfirmation} close={() => setAcceptConfirmation(false)}>
        <h3 className="font-bold text-lg">Confirm Acceptance</h3>
        <p className="text-sm">Are you sure you want to accept the request for: {selectedRequest?.patient.FirstName} {selectedRequest?.patient.LastName}?</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setAcceptConfirmation(false)}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleAcceptRequest}>Accept</button>
        </div>
      </Modal>

      {/* Detail Modal for Selected Request */}
      <Modal isOpen={detailModalOpen} close={() => setDetailModalOpen(false)}>
        {selectedRequest && (
          <>
            <h3 className="font-bold text-lg">Request Details</h3>
            <p><strong>Patient Name:</strong> {selectedRequest.patient.FirstName} {selectedRequest.patient.LastName}</p>
            <p><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</p>
            <p><strong>Procedures:</strong> {selectedRequest.procedures.map(proc => proc.name).join(', ')}</p>
            <p><strong>Status:</strong> {selectedRequest.medcertiStatus}</p>
            <p><strong>Notes:</strong> {selectedRequest.notes}</p>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDetailModalOpen(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
