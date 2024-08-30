import { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import axios from 'axios';

export default function Add_Procedure() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [editProcedureModalOpen, setEditProcedureModalOpen] = useState(false);
  const [viewProcedureModalOpen, setviewProcedureModalOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [procedureToEdit, setProcedureToEdit] = useState(null);
  const [procedureToDelete, setProcedureToDelete] = useState(null);

  const [procedureList, setProcedureList] = useState([]);

  const [newProcedure, setNewProcedure] = useState({ _id: '', Procedure_name: '', Duration: '', Price: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(`${BASEURL}/Procedure/show`,
          {
            withCredentials:true
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
  }, []);

  const openAddPatientModal = () => {
    setNewProcedure({ _id: '', Procedure: '', Duration: '', Price: '' });
    setAddPatientModalOpen(true);
  };

  const openEditProcedureModal = (procedure, model) => {
    setProcedureToEdit(procedure);
    setNewProcedure({ ...procedure });
    if (model == 'Edit') {
      setEditProcedureModalOpen(true);
    } else if (model == 'View') {
      setviewProcedureModalOpen(true)
    }
  };

  const openDeleteConfirmationModal = (procedure) => {
    setProcedureToDelete(procedure);
    setDeleteConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASEURL}/Procedure/delete/${procedureToDelete._id}`);
      setProcedureList(procedureList.filter((procedure) => procedure._id !== procedureToDelete._id));
      setDeleteConfirmationModalOpen(false);
      setProcedureToDelete(null);
    } catch (error) {
      console.error('Error deleting procedure:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASEURL}/Procedure/update/${newProcedure._id}`, {
        Procedure: newProcedure.Procedure,
        Duration: newProcedure.Duration,
        Price: newProcedure.Price
      });

      if (response.status === 200) {
        alert(response.data.message)
      }
      setProcedureList((prev) =>
        prev.map((procedure) =>
          procedure._id === newProcedure._id ? newProcedure : procedure
        )
      );
      setEditProcedureModalOpen(false);
      setProcedureToEdit(null);
    } catch (error) {
      console.error('Error updating procedure:', error);
      alert(error.response.data.message);

    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASEURL}/Procedure/add`,
        {
          Procedure: newProcedure.Procedure,
          Duration: newProcedure.Duration,
          Price: newProcedure.Price
        },
        {
          withCredentials: true
        }
      );

      if (response.status === 200) {
        alert(response.data.message || 'Procedure added successfully!');
        setProcedureList([...procedureList, response.data.procedure]);
      } else {
        alert(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    }

    setAddPatientModalOpen(false);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setProcedureList((prevList) =>
      [...prevList].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.Procedure.localeCompare(b.Procedure);
        } else {
          return b.Procedure.localeCompare(a.Procedure);
        }
      })
    );
  };

  const filteredProcedures = Array.isArray(procedureList) ? procedureList.filter((procedure) => {
    // Check if Procedure is a string and include in the filter
    const procedureName = typeof procedure.Procedure_name === 'string' ? procedure.Procedure_name : '';
    return procedureName.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  return (
    <div className='container mx-auto text-sm lg:text-md'>
      <div className='flex justify-between items-center'>
        <h1 className='text-5xl font-semibold'>Procedure List</h1>
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
      <div className='text-right py-3'>
        <button className='btn bg-green-400 hover:bg-green-400 text-white' onClick={openAddPatientModal}>Create Procedure</button>
      </div>

      <div className='mt-4 text-lg'>
        <div className='flex w-full font-semibold border-b pb-2'>
          <div className='flex-1'>Procedure Name <button onClick={handleSort} className='ml-2 text-blue-500'>{sortOrder === 'asc' ? '↑' : '↓'}</button></div>
          <div className='flex-1 hidden lg:block'>Duration</div>
          <div className='flex-1 hidden lg:block'>Price</div>
          <div className='flex-1 text-center'>Actions</div>
        </div>
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

      <Modal isOpen={addPatientModalOpen} close={() => setAddPatientModalOpen(false)}>
        <h3 className="font-bold text-lg">Add New Procedure</h3>
        <form onSubmit={handleAddSubmit} className="flex flex-col">
          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            placeholder="Procedure Name"
            value={newProcedure.Procedure}
            onChange={(e) => setNewProcedure({ ...newProcedure, Procedure: e.target.value })}
            className="border p-2 mb-2"
            required
          />
          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Duration"
              value={newProcedure.Duration}
              onChange={(e) => setNewProcedure({ ...newProcedure, Duration: e.target.value })}
              className="border p-2 mr-2 w-24"
              required
            />
          </div>
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
          <button type="submit" className="btn btn-success">Save Changes</button>
        </form>
      </Modal>

      {/* VIEW AND EDIT MODAL */}
      <Modal
        isOpen={editProcedureModalOpen || viewProcedureModalOpen}
        close={() => {
          setEditProcedureModalOpen(false);
          setviewProcedureModalOpen(false);
        }}
      >
        <h3 className="font-bold text-lg">
          {viewProcedureModalOpen ? "View Procedure" : "Edit Procedure"}
        </h3>
        <form onSubmit={handleEditSubmit} className="flex flex-col">
          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            placeholder="Procedure Name"
            value={newProcedure.Procedure}
            onChange={(e) => setNewProcedure({ ...newProcedure, Procedure: e.target.value })}
            className="border p-2 mb-2"
            readOnly={viewProcedureModalOpen}
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
            readOnly={viewProcedureModalOpen}
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
            readOnly={viewProcedureModalOpen}
            required
          />
          {!viewProcedureModalOpen && (
            <button type="submit" className="btn btn-success">Save Changes</button>
          )}
        </form>
      </Modal>


      <Modal isOpen={deleteConfirmationModalOpen} close={() => setDeleteConfirmationModalOpen(false)}>
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p>Are you sure you want to delete the procedure: <strong>{procedureToDelete?.Procedure}</strong>?</p>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
          <button className="btn btn-secondary ml-2" onClick={() => setDeleteConfirmationModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
