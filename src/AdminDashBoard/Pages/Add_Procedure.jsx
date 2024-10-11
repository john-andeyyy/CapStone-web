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

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASEURL}/Procedure/delete/${procedureToDelete._id}`, {
        withCredentials: true,
      });
      setProcedureList(procedureList.filter((procedure) => procedure._id !== procedureToDelete._id));
      showToast('success', 'Delete successful!');

      setDeleteConfirmationModalOpen(false);
      setProcedureToDelete(null);
    } catch (error) {
      showToast('error', 'Error deleting procedure:', error);
      console.error('Error deleting procedure:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASEURL}/Procedure/update/${newProcedure._id}`, {
        Procedure_name: newProcedure.Procedure_name,
        Duration: newProcedure.Duration,
        Price: newProcedure.Price,
        Description: newProcedure.Description
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        showToast('success', 'Procedure updated successfully!');
        // alert(response.data.message || 'Procedure updated successfully!');
        setProcedureList((prev) =>
          prev.map((procedure) =>
            procedure._id === newProcedure._id ? newProcedure : procedure
          )
        );
      }
      setEditProcedureModalOpen(false);
      setProcedureToEdit(null);
    } catch (error) {
      console.error('Error updating procedure:', error);
      showToast('error', error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASEURL}/Procedure/add`, {
        Procedure_name: newProcedure.Procedure_name,
        Duration: newProcedure.Duration,
        Price: newProcedure.Price,
        Description: newProcedure.Description
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        showToast('success', response.data.message || 'Procedure added successfully!');

        // alert(response.data.message || 'Procedure added successfully!');
        setProcedureList([...procedureList, response.data.procedure]);
      } else {
        showToast('error', response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred.');
    }

    setAddPatientModalOpen(false);
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
            className='block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
          <div className='absolute left-3 top-3 h-4 w-4 text-gray-500'>
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
      </div>




      <div className='flex w-full font-semibold lg:text-xl sm:text-xl border-b p-3 bg-primary rounded-lg text-white '>
        <div className='flex-1'>Procedure Name <button onClick={handleSort} className='ml-2 text-white text-xl'>{sortOrder === 'asc' ? '↑' : '↓'}</button></div>
        <div className='flex-1 hidden lg:block'>Duration</div>
        <div className='flex-1 hidden lg:block'>Price</div>
        <div className='flex-1 text-center'>Actions</div>
      </div>

      <div className='mt-4 text-lg overflow-auto max-h-80'>
        {filteredProcedures.map((procedure) => (
          <div key={procedure._id} className='flex w-full items-center border-b py-2'>
            <div className='flex-1'>{procedure.Procedure_name}</div>
            <div className='flex-1 hidden lg:block'>{procedure.Duration}</div>
            <div className='flex-1 hidden lg:block'>{procedure.Price}</div>
            <div className='flex-1 flex gap-2 justify-center'>
              <button className='text-green-500' onClick={() => openEditProcedureModal(procedure, 'View')}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <button className='text-blue-500' onClick={() => openEditProcedureModal(procedure, 'Edit')}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className='text-red-500' onClick={() => openDeleteConfirmationModal(procedure)}>
                <span className="material-symbols-outlined">delete</span>
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
            className="border p-2 mb-2"
            required
          />
          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <input
            type="text"
            placeholder="Duration"
            value={newProcedure.Duration}
            onChange={(e) => setNewProcedure({ ...newProcedure, Duration: e.target.value })}
            className="border p-2 mb-2"
            required
          />
          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            placeholder="Price"
            value={newProcedure.Price}
            onChange={(e) => setNewProcedure({ ...newProcedure, Price: e.target.value })}
            className="border p-2 mb-2"
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
            className="border p-2 mb-2"
            required
          />
          <div className="modal-action">
            <button className="btn btn-primary bg-green-400 hover:bg-green-400 text-white">Add Procedure</button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setAddPatientModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editProcedureModalOpen} close={() => setEditProcedureModalOpen(false)}>
        <div className='text-white'>
          <h3 className="font-bold text-lg text-center ">Edit Procedure</h3>
          <form onSubmit={handleEditSubmit} className="flex flex-col">
            <div className="label">
              <span className="label-text">Procedure Name</span>
            </div>
            <input
              type="text"
              placeholder="Procedure Name"
              value={newProcedure.Procedure_name}
              onChange={(e) => setNewProcedure({ ...newProcedure, Procedure_name: e.target.value })}
              className="border p-2 mb-2"
              required
            />
            <div className="label">
              <span className="label-text">Duration</span>
            </div>
            <input
              type="text"
              placeholder="Duration"
              value={newProcedure.Duration}
              onChange={(e) => setNewProcedure({ ...newProcedure, Duration: e.target.value })}
              className="border p-2 mb-2"
              required
            />
            <div className="label">
              <span className="label-text">Price</span>
            </div>
            <input
              type="number"
              placeholder="Price"
              value={newProcedure.Price}
              onChange={(e) => setNewProcedure({ ...newProcedure, Price: e.target.value })}
              className="border p-2 mb-2"
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
              className="border p-2 mb-2"
              required
            />
            <div className="modal-action">
              <button className="btn btn-success bg-blue-500 hover:bg-blue-500 text-white">
                Save Changes
              </button>

              <button
                type="button"
                className="btn btn-error text-white"
                onClick={() => setEditProcedureModalOpen(false)}
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
        <div className="flex flex-col ">
          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            value={newProcedure.Procedure_name}
            readOnly
            className="border p-2 mb-2"
          />
          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <input
            type="text"
            value={newProcedure.Duration}
            readOnly
            className="border p-2 mb-2"
          />
          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            value={newProcedure.Price}
            readOnly
            className="border p-2 mb-2"
          />
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <textarea
            type="text"
            value={newProcedure.Description}
            readOnly
            className="border p-2 mb-2"
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
        <h3 className="font-bold text-lg text-center text-white">Delete Procedure</h3>
        <p>Are you sure you want to delete {procedureToDelete?.Procedure_name}?</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-error text-white"
            onClick={confirmDelete}
          >
            Delete
          </button>
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
