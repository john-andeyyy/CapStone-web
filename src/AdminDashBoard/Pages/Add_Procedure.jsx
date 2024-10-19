import { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import axios from 'axios';
import { showToast } from '../Components/ToastNotification';

export default function Add_Procedure() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [editProcedureModalOpen, setEditProcedureModalOpen] = useState(false);
  const [viewProcedureModalOpen, setViewProcedureModalOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [procedureToEdit, setProcedureToEdit] = useState(null);
  const [procedureToDelete, setProcedureToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState(true);
  const [procedureList, setProcedureList] = useState([]);

  const [newProcedure, setNewProcedure] = useState({ _id: '', Procedure_name: '', Duration: '', Price: '', Description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(`${BASEURL}/Procedure/show`, {
          withCredentials: true
        });
        if (Array.isArray(response.data)) {
          setProcedureList(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching procedures:', error);
      }
    };

    fetchProcedures();
  }, [BASEURL]);

  const openAddPatientModal = () => {
    setNewProcedure({ _id: '', Procedure_name: '', Duration: '', Price: '', Description: '' });
    setAddPatientModalOpen(true);
  };

  const openEditProcedureModal = (procedure, mode) => {
    setProcedureToEdit(procedure);
    setNewProcedure({ ...procedure });
    if (mode === 'Edit') {
      setEditProcedureModalOpen(true);
    } else if (mode === 'View') {
      setViewProcedureModalOpen(true);
    }
  };

  const openDeleteConfirmationModal = (procedure) => {
    setProcedureToDelete(procedure);
    setDeleteConfirmationModalOpen(true);
  };

  const confirmtongleStatus = async (status) => {
    try {
      await axios.put(`${BASEURL}/Procedure/updatestatus/${procedureToDelete._id}`,
        { status },
        { withCredentials: true }
      );

      // Update the procedure list with the new status
      setProcedureList((prevProcedureList) =>
        prevProcedureList.map((procedure) =>
          procedure._id === procedureToDelete._id
            ? { ...procedure, available: status } // Update the available status
            : procedure
        )
      );

      showToast('success', 'Status updated successfully!');
      setDeleteConfirmationModalOpen(false);
      setProcedureToDelete(null);
    } catch (error) {
      showToast('error', 'Error updating procedure status:', error);
      console.error('Error updating procedure status:', error);
    }
  };


  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Procedure_name', newProcedure.Procedure_name);
    formData.append('Duration', newProcedure.Duration);
    formData.append('Price', newProcedure.Price);
    formData.append('Description', newProcedure.Description);
    if (newProcedure.Image) {
      formData.append('Image', newProcedure.Image);
    }

    try {
      const response = await axios.post(`${BASEURL}/Procedure/add`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        showToast('success', response.data.message || 'Procedure added successfully!');
        setProcedureList([...procedureList, response.data.procedure]);
      } else {
        showToast('error', response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred.');
    }

    setAddPatientModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Procedure_name', newProcedure.Procedure_name);
    formData.append('Duration', newProcedure.Duration);
    formData.append('Price', newProcedure.Price);
    formData.append('Description', newProcedure.Description);
    if (newProcedure.Image) {
      formData.append('Image', newProcedure.Image);
    }

    try {
      const response = await axios.put(`${BASEURL}/Procedure/update/${newProcedure._id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        showToast('success', 'Procedure updated successfully!');
        setProcedureList((prev) =>
          prev.map((procedure) =>
            procedure._id === newProcedure._id ? newProcedure : procedure
          )
        );
      }
      setEditProcedureModalOpen(false);
      setProcedureToEdit(null);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = () => {
    const sortedProcedures = [...procedureList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.Procedure_name.localeCompare(b.Procedure_name);
      } else {
        return b.Procedure_name.localeCompare(a.Procedure_name);
      }
    });

    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setProcedureList(sortedProcedures);
  };

  const filteredProcedures = procedureList.filter((procedure) =>
    procedure.Procedure_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProfileImage = (profilePicture) => {

    // Check if the profile picture is available
    if (profilePicture) {
      return `data:image/jpeg;base64,${profilePicture}`; // Adjust to image format (jpeg/png)
    } else {
      return "https://via.placeholder.com/150"; // Fallback if no image
    }
  };

  const filteredAndAvailableProcedures = filteredProcedures.filter((procedure) => {
    if (availabilityFilter === null) return true; // No filter applied
    return procedure.available === availabilityFilter;
  });
  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} hrs ${minutes} mins`;
    } else {
      return `${minutes} mins`; // Only show minutes if there are no hours
    }
  };


  return (
    <div className='container mx-auto text-sm lg:text-md'>
      <div className='flex justify-between items-center pb-5'>
        <h1 className='text-2xl font-semibold l:text-sm'>Procedure List...</h1>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search procedures...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='block w-full pl-10 pr-4 py-2 bowrder border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
          <div className='absolute left-3 top-3 h-4 w-4 text-gray-500'>
            <span className="material-symbols-outlined">search</span>
          </div>

        </div>

      </div>
      <div className="flex gap-4 mb-4 ">
        <button
          className={`btn ${availabilityFilter === true ? 'btn-success' : 'btn-outline'}`}
          onClick={() => setAvailabilityFilter(true)}
        >
          Show Available
        </button>
        <button
          className={`btn ${availabilityFilter === false ? 'btn-error' : 'btn-outline'}`}
          onClick={() => setAvailabilityFilter(false)}
        >
          Show Not Available
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setAvailabilityFilter(null)}
        >
          Show All
        </button>
      </div>




      <div className='flex w-full font-semibold lg:text-xl sm:text-xl border-b p-3 bg-primary rounded-lg text-white '>
        <div className='flex-1'>Procedure Name <button onClick={handleSort} className='ml-2 text-white text-xl'>{sortOrder === 'asc' ? '↑' : '↓'}</button></div>
        <div className='flex-1 hidden lg:block'>Duration</div>
        <div className='flex-1 hidden lg:block'>Price</div>
        <div className='flex-1 hidden lg:block'>Status</div>
        <div className='flex-1 text-center'>Actions</div>
      </div>
      <div className='mt-4 text-lg overflow-auto max-h-[25rem]'>

        {filteredAndAvailableProcedures.map((procedure) => (
          <div key={procedure._id} className='flex w-full items-center border-b py-2'>
            <div className='flex-1'>{procedure.Procedure_name}</div>
            <div className='flex-1 hidden lg:block'>{formatDuration(procedure.Duration)}</div>
            <div className='flex-1 hidden lg:block'>{procedure.Price}</div>
            <div className='flex-1 hidden lg:block'>
              {/* {procedure.available ? 'yes' : 'no'} */}
              <button
                className={`text-${procedure.available ? 'red' : 'green'}-500`}
                onClick={() => openDeleteConfirmationModal(procedure)}
              >
                {/* <span className="material-symbols-outlined">
                  {procedure.available ? 'cancel' : 'check_circle '}
                </span> */}
                  {procedure.available ? 'Mark Unavailable' : 'Mark Available '}
              </button>

            </div>
            <div className='flex-1 flex gap-2 justify-center'>
              <button className='text-green-500' onClick={() => openEditProcedureModal(procedure, 'View')}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <button className='text-blue-500' onClick={() => openEditProcedureModal(procedure, 'Edit')}>
                <span className="material-symbols-outlined">edit</span>
              </button>


            </div>
          </div>
        ))}
      </div>


      <div className=' '>
        <div className='absolute bottom-3 right-3'>
          <button className='btn bg-primary hover:bg-secondary text-white' onClick={openAddPatientModal}>
            Create Procedure
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addPatientModalOpen} close={() => setAddPatientModalOpen(false)}>
        <h3 className="font-bold text-lg">Add New Procedure</h3>
        <form onSubmit={handleAddSubmit} className="flex flex-col">
          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            placeholder="Procedure Name"
            value={newProcedure.Procedure_name}
            onChange={(e) => setNewProcedure({ ...newProcedure, Procedure_name: e.target.value })}
            className="border p-2 mb-2 bg-white"
            required
          />
          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Hours Input */}
            <input
              type="number"
              placeholder="Hours"
              value={newProcedure.Duration ? Math.floor(newProcedure.Duration / 60) : ''}  // Display hours or empty if no value
              onChange={(e) => {
                const hours = e.target.value === '' ? '' : parseInt(e.target.value);
                const totalMinutes = hours === '' ? (newProcedure.Duration % 60) : (hours * 60 + (newProcedure.Duration % 60));
                setNewProcedure({ ...newProcedure, Duration: totalMinutes });
              }}
              className="border p-2 mb-2 bg-white w-20"
              min="0"
              required
            />
            <span>Hrs</span>

            {/* Minutes Input */}
            <input
              type="number"
              placeholder="Minutes"
              value={newProcedure.Duration ? newProcedure.Duration % 60 : ''}  // Display minutes or empty if no value
              onChange={(e) => {
                const minutes = e.target.value === '' ? '' : parseInt(e.target.value);
                const totalMinutes = (Math.floor(newProcedure.Duration / 60) * 60) + (minutes === '' ? 0 : minutes);
                setNewProcedure({ ...newProcedure, Duration: totalMinutes });
              }}
              className="border p-2 mb-2 bg-white w-20"
              min="0"
              max="59"
              required
            />
            <span>Mins</span>
          </div>


          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            placeholder="Price"
            value={newProcedure.Price}
            onChange={(e) => setNewProcedure({ ...newProcedure, Price: e.target.value })}
            className="border p-2 mb-2 bg-white"
            required
          />
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={newProcedure.Description}
            onChange={(e) => setNewProcedure({ ...newProcedure, Description: e.target.value })}
            className="border p-2 mb-2 bg-white"
            required
          />

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setNewProcedure({ ...newProcedure, Image: file });
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
              } else {
                setImagePreview(null); // Clear the preview if no file is selected
              }
            }}
            className="border p-2 mb-2 bg-white"
          />

          {imagePreview && (
            <img src={imagePreview} alt="Image Preview" className="mt-2 border rounded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
          )}


          <div className="modal-action">
            <button className="btn btn-primary bg-green-400 hover:bg-green-400 text-white">Add Procedure</button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setAddPatientModalOpen(false)
                setImagePreview(null)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editProcedureModalOpen} close={() => setEditProcedureModalOpen(false)}>
        <div className='text-black'>
          <h3 className="font-bold text-lg text-center ">Edit Procedure</h3>
          <form onSubmit={handleEditSubmit} className="flex flex-col">

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setNewProcedure({ ...newProcedure, Image: file });
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
              className="border p-2 mb-2 bg-white"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Image Preview" className="mt-2 border rounded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
            )}
            <div className="label">
              <span className="label-text">Procedure Name</span>
            </div>
            <input
              type="text"
              placeholder="Procedure Name"
              value={newProcedure.Procedure_name}
              onChange={(e) => setNewProcedure({ ...newProcedure, Procedure_name: e.target.value })}
              className="border p-2 mb-2 bg-white"
              required
            />
            <div className="label">
              <span className="label-text">Duration</span>
            </div>
            

            <div className="flex items-center gap-2">
              {/* Hours Input */}
              <input
                type="number"
                placeholder="Hours"
                value={newProcedure.Duration !== null ? Math.floor(newProcedure.Duration / 60) : ''}  // Show empty string if duration is null
                onChange={(e) => {
                  const hours = e.target.value === '' ? '' : parseInt(e.target.value);
                  const totalMinutes = hours === '' ? (newProcedure.Duration % 60) : (hours * 60 + (newProcedure.Duration % 60));
                  setNewProcedure({ ...newProcedure, Duration: totalMinutes });
                }}
                className="border p-2 mb-2 bg-white w-20"
                min="0"
                required
              />
              <span>Hrs</span>

              {/* Minutes Input */}
              <input
                type="number"
                placeholder="Minutes"
                value={newProcedure.Duration !== null ? newProcedure.Duration % 60 : ''}  // Show empty string if duration is null
                onChange={(e) => {
                  const minutes = e.target.value === '' ? '' : parseInt(e.target.value);
                  const totalMinutes = (Math.floor(newProcedure.Duration / 60) * 60) + (minutes === '' ? 0 : minutes);
                  setNewProcedure({ ...newProcedure, Duration: totalMinutes });
                }}
                className="border p-2 mb-2 bg-white w-20"
                min="0"
                max="59"
                required
              />
              <span>Mins</span>
            </div>
            <div className="label">
              <span className="label-text">Price</span>
            </div>
            <input
              type="number"
              placeholder="Price"
              value={newProcedure.Price}
              onChange={(e) => setNewProcedure({ ...newProcedure, Price: e.target.value })}
              className="border p-2 mb-2 bg-white"
              required
            />
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <input
              type="text"
              placeholder="Description"
              value={newProcedure.Description}
              onChange={(e) => setNewProcedure({ ...newProcedure, Description: e.target.value })}
              className="border p-2 mb-2 bg-white"
              required
            />
            <div className="modal-action">
              <button className="btn btn-success bg-blue-500 hover:bg-blue-500 text-white">
                Save Changes
              </button>

              <button
                type="button"
                className="btn btn-error text-white"
                onClick={() => {
                  setEditProcedureModalOpen(false)
                  setImagePreview(null)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>



      {/* View Modal */}
      <Modal isOpen={viewProcedureModalOpen} close={() => setViewProcedureModalOpen(false)}>

        <h3 className="font-bold text-lg text-center">View Procedure</h3>
        <div className='flex justify-center'>
          <figure>
            <img
              src={getProfileImage(newProcedure.Image)}
              className="object-cover h-36 p-1 "
            />
          </figure>
        </div>
        <div className="flex flex-col ">
          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            value={newProcedure.Procedure_name}
            readOnly
            className="border p-2 mb-2 bg-white"
          />
          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <input
            type="text"
            value={formatDuration(newProcedure.Duration)}
            readOnly
            className="border p-2 mb-2 bg-white"
          />
          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            value={newProcedure.Price}
            readOnly
            className="border p-2 mb-2 bg-white"
          />
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <textarea
            type="text"
            value={newProcedure.Description}
            readOnly
            className="border p-2 mb-2 bg-white"
          />
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error text-white"
              onClick={() => setViewProcedureModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>

      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirmationModalOpen} close={() => setDeleteConfirmationModalOpen(false)}>
        <h3 className="font-bold text-lg text-center text-white">
          Are you sure you want to make this procedure {procedureToDelete?.available ? 'unavailable' : 'available'}?
        </h3>
        <p className="text-center text-white">{procedureToDelete?.Procedure_name}</p>
        <div className="modal-action">

          {procedureToDelete && procedureToDelete.available ? (
            <button
              type="button"
              className="btn btn-error text-white"
              onClick={() => confirmtongleStatus(false)}
            >
              Mark as Not Available
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success text-white"
              onClick={() => confirmtongleStatus(true)}
            >
              Mark as Available
            </button>
          )}





          <button
            type="button"
            className="btn btn-accent"
            onClick={() => setDeleteConfirmationModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
