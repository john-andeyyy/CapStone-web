import { useEffect, useState } from 'react';
import Modal from '../Components/Modal';
import axios from 'axios';
import { showToast } from '../Components/ToastNotification';
import { Link, useNavigate } from 'react-router-dom';

export default function MedicalRequests() {
  const navigate = useNavigate()
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
    setLoading(true);
    try {
      const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`, {
        withCredentials: true
      });
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
      request.patient &&
      request.patient.FirstName &&
      request.patient.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      showBasedOnStatus(statusFilter)
    );
  });


  const handleDeleteRequest = async () => {
    if (selectedRequest) {
      setActionLoading(true);
      try {
        await axios.put(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
          Status: 'Rejected' // Note: Directly set the status in the request body
        }, {
          withCredentials: true
        });


        showToast('success', `You have rejected  the Request! `);

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
      await axios.put(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
        Status: 'Archive'
      }, {
        withCredentials: true
      });

      showToast('success', `You have archived the Request!`);

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
      await axios.put(`${BASEURL}/SendDentalCertificate/${selectedRequest.id}`, {
        Status: 'Approved'
      }, {
        withCredentials: true
      });

      showToast('success', `You have approved the Request!`);

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
      {/* Status Dropdown and Search Bar */}
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

      {/* Filter by Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex mb-4">
          <label htmlFor="status" className="block mb-2 font-semibold mt-3">Filter by Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block p-2 border border-gray-300 rounded-md ml-5"
          >
            {/* <option value="All">All</option> */}
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Archive">Archive (delete)</option>
          </select>
        </div>
      </div>
      {/* Request List */}
      <div className="p-2 flex text-white bg-primary">
        <div className="flex-1 font-bold">Name</div>
        <div className="flex-1 font-bold">Date</div>
        <div className="flex-1 font-bold hidden md:block">Procedure</div>
        <div className="flex-1 font-bold hidden md:block">Status</div>
        {/* Only show actions when not in 'Approved' or 'All' filter */}
        {statusFilter !== 'Approved' && statusFilter !== 'All' && <div className="flex-1 font-bold text-center">Actions</div>}
      </div>

      {loading ? (
        <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <>
          <div className="shadow-md rounded overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="p-4 text-center font-bold ">No requests found.</div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between border-b p-2 px-4 cursor-pointer hover:bg-base-300"

                >
                  {/* Patient's Name */}
                  <div className="flex-1">{request.patient.FirstName} {request.patient.LastName}</div>
                  {/* Request Date */}
                  <div className="flex-1">{new Date(request.date).toLocaleDateString()}</div>
                  {/* Procedures */}
                  <div className="flex-1 hidden md:block">{request.procedures.map(proc => proc.name).join(', ')}</div>
                  {/* Status */}
                  <div className={`flex-1 hidden md:block ${request.medcertiStatus === 'Pending' ? 'text-green-500' : ''}`}>
                    {request.medcertiStatus}
                  </div>


                  {/* Action Buttons */}

                  {statusFilter !== 'Approved' && statusFilter !== 'All' && (
                    <div className=" text-center">
                      {/* Approve Button */}
                      <button className="text-blue-500 mx-2" onClick={() => {
                        navigate(`/appointment/${request.id}`);

                      }}>
                        <span className="material-symbols-outlined">visibility</span>
                      </button>

                      {request.medcertiStatus !== 'Approved' && (
                        <button className="text-green-500 mx-2" onClick={() => {
                          setSelectedRequest(request);
                          setAcceptConfirmation(true);
                        }}>
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                      )}
                      {/* Reject Button */}
                      {request.medcertiStatus !== 'Approved' && request.medcertiStatus !== 'Rejected' && (
                        <button className="text-red-500 mx-2" onClick={() => {
                          setSelectedRequest(request);
                          setDeleteConfirmation(true);
                        }}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                      {/* Archive Button */}
                      {(request.medcertiStatus !== 'Approved' && request.medcertiStatus !== 'Archive') && (
                        <button className="text-gray-500 mx-2" onClick={() => {
                          setSelectedRequest(request);
                          setArchiveConfirmation(true);
                        }}>
                          <span className="material-symbols-outlined">archive</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {/* Accept Request Modal */}
      <Modal title="Accept Request" isOpen={acceptConfirmation} onClose={() => setAcceptConfirmation(false)}>
        <p className="text-center">Are you sure you want to approve request ID: {selectedRequest?.id}?</p>
        <div className="flex justify-center mt-4">
          {actionLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <>
              <button
                className="bg-[#4285F4] hover:bg-[#0C65F8] btn mr-2"
                onClick={() => {
                  setActionLoading(true); // Start loading
                  handleAcceptRequest(); // Trigger accept action
                }}
                disabled={actionLoading} // Disable button during loading
              >
                Confirm
              </button>
              <button
                className="bg-[#D9D9D9] hover:bg-[#ADAAAA] btn"
                onClick={() => setAcceptConfirmation(false)}
                disabled={actionLoading} // Disable cancel during loading
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Request Modal */}
      <Modal title="Delete Request" isOpen={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
        <p className="text-center">Are you sure you want to reject request ID: {selectedRequest?.id}?</p>
        <div className="flex justify-center mt-4">
          {actionLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <>
              <button
                className="bg-[#4285F4] btn hover:bg-[#0C65F8] mr-2"
                onClick={() => {
                  setActionLoading(true); // Start loading
                  handleDeleteRequest(); // Trigger delete action
                }}
                disabled={actionLoading}
              >
                Confirm
              </button>
              <button
                className="bg-[#D9D9D9] btn hover:bg-[#ADAAAA]"
                onClick={() => setDeleteConfirmation(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Archive Request Modal */}
      <Modal title="Archive Request" isOpen={archiveConfirmation} onClose={() => setArchiveConfirmation(false)}>
        <p className="text-center">Are you sure you want to archive request ID: {selectedRequest?.id}?</p>
        <div className="flex justify-center mt-4">
          {actionLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <>
              <button
                className="bg-[#4285F4] btn hover:bg-[#0C65F8]  mr-2"
                onClick={() => {
                  setActionLoading(true); // Start loading
                  handleArchiveRequest(); // Trigger archive action
                }}
                disabled={actionLoading}
              >
                Confirm
              </button>
              <button
                className="bg-[#D9D9D9] btn hover:bg-[#ADAAAA]"
                onClick={() => setArchiveConfirmation(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>

    </div>
  );
}
