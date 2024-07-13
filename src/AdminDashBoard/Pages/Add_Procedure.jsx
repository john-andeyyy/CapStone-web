import { useState } from 'react';
import Modal from '../Components/Modal';

export default function Add_Procedure() {
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [editProcedureModalOpen, setEditProcedureModalOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [procedureToEdit, setProcedureToEdit] = useState(null);
  const [procedureToDelete, setProcedureToDelete] = useState(null);
  const [procedureList, setProcedureList] = useState([
    { id: '001', name: 'Teeth Cleaning', duration: '30', durationUnit: 'mins', price: 'P 500.00' },
    { id: '002', name: 'Cavity Filling', duration: '45', durationUnit: 'mins', price: 'P 1,000.00' },
    { id: '003', name: 'Root Canal Treatment', duration: '1', durationUnit: 'hour', price: 'P 2,500.00' },
    { id: '004', name: 'Dental Crown', duration: '1', durationUnit: 'hour', price: 'P 3,000.00' },
    { id: '005', name: 'Tooth Extraction', duration: '30', durationUnit: 'mins', price: 'P 800.00' },
    { id: '006', name: 'Dental Implant', duration: '2', durationUnit: 'hours', price: 'P 25,000.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
    { id: '007', name: 'Whitening Treatment', duration: '45', durationUnit: 'mins', price: 'P 1,200.00' },
  ]);
  const [newProcedure, setNewProcedure] = useState({ id: '', name: '', duration: '', durationUnit: 'mins', price: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const openAddPatientModal = () => {
    setNewProcedure({ id: '', name: '', duration: '', durationUnit: 'mins', price: '' });
    setAddPatientModalOpen(true);
  };

  const openEditProcedureModal = (procedure) => {
    setProcedureToEdit(procedure);
    setNewProcedure({ ...procedure });
    setEditProcedureModalOpen(true);
  };

  const openDeleteConfirmationModal = (procedure) => {
    setProcedureToDelete(procedure);
    setDeleteConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    setProcedureList(procedureList.filter((procedure) => procedure.id !== procedureToDelete.id));
    setDeleteConfirmationModalOpen(false);
    setProcedureToDelete(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProcedureList((prev) =>
      prev.map((procedure) =>
        procedure.id === newProcedure.id ? newProcedure : procedure
      )
    );
    setEditProcedureModalOpen(false);
    setProcedureToEdit(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setProcedureList((prev) => [...prev, newProcedure]);
    setAddPatientModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProcedures = procedureList.filter((procedure) =>
    procedure.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto text-sm lg:text-md '>
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
        <button className='btn bg-green-400 hover:bg-green-400 text-white ' onClick={openAddPatientModal}>Create Procedure</button>

      </div>
      <div className='mt-4 text-lg'>
        <div className='flex w-full font-semibold border-b pb-2 '>
          {/* <div className='flex-1'>ID</div> */}
          <div className='flex-1'>Procedure Name</div>
          <div className='flex-1'>Duration</div>
          <div className='flex-1'>Price</div>
          <div className='flex-1 text-center'>Actions</div>
        </div>
        {filteredProcedures.map((procedure) => (
          <div key={procedure.id} className='flex w-full items-center border-b py-2'>
            {/* <div className='flex-1'>{procedure.id}</div> */}
            <div className='flex-1'>{procedure.name}</div>
            <div className='flex-1'>{procedure.duration} {procedure.durationUnit}</div>
            <div className='flex-1'>{procedure.price}</div>
            <div className='flex-1 flex gap-2 justify-center'>
              <button className='text-blue-500' onClick={() => openEditProcedureModal(procedure)}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className='text-red-500' onClick={() => openDeleteConfirmationModal(procedure)}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={addPatientModalOpen}
        close={() => setAddPatientModalOpen(false)}
      >
        <h3 className="font-bold text-lg">Add New Procedure</h3>
        <form onSubmit={handleAddSubmit} className="flex flex-col">
          <div className="label">
            <span className="label-text">ID</span>
          </div>
          <input
            type="text"
            placeholder="ID"
            value={newProcedure.id}
            onChange={(e) => setNewProcedure({ ...newProcedure, id: e.target.value })}
            className="border p-2 mb-2"
            required
          />

          <div className="label">
            <span className="label-text">Procedure Name</span>
          </div>
          <input
            type="text"
            placeholder="Procedure Name"
            value={newProcedure.name}
            onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
            className="border p-2 mb-2"
            required
          />

          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="number"
              placeholder="Duration"
              value={newProcedure.duration}
              onChange={(e) => setNewProcedure({ ...newProcedure, duration: e.target.value })}
              className="border p-2 mr-2 w-24"
              required
            />
            <select
              value={newProcedure.durationUnit}
              onChange={(e) => setNewProcedure({ ...newProcedure, durationUnit: e.target.value })}
              className="border p-2"
            >
              <option value="mins">mins</option>
              <option value="hours">hours</option>
            </select>
          </div>

          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="text"
            placeholder="Price"
            value={newProcedure.price}
            onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })}
            className="border p-2 mb-2"
            required
          />
          <button type="submit" className="btn btn-success">Add Procedure</button>
        </form>
      </Modal>

      <Modal
        isOpen={editProcedureModalOpen}
        close={() => setEditProcedureModalOpen(false)}
      >
        <h3 className="font-bold text-lg">Edit Procedure</h3>
        <form onSubmit={handleEditSubmit} className="flex flex-col">
          <div className="label">
            <span className="label-text">ID</span>
          </div>
          <input
            type="text"
            placeholder="ID"
            value={newProcedure.id}
            onChange={(e) => setNewProcedure({ ...newProcedure, id: e.target.value })}
            className="border p-2 mb-2"
            readOnly
          />
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <input
            type="text"
            placeholder="Procedure Name"
            value={newProcedure.name}
            onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
            className="border p-2 mb-2"
            required
          />

          <div className="label">
            <span className="label-text">Duration</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="number"
              placeholder="Duration"
              value={newProcedure.duration}
              onChange={(e) => setNewProcedure({ ...newProcedure, duration: e.target.value })}
              className="border p-2 mr-2 w-24"
              required
            />
            <select
              value={newProcedure.durationUnit}
              onChange={(e) => setNewProcedure({ ...newProcedure, durationUnit: e.target.value })}
              className="border p-2"
            >
              <option value="mins">mins</option>
              <option value="hours">hours</option>
            </select>
          </div>
          <div className="label">
            <span className="label-text">Price</span>
          </div>

          <input
            type="text"
            placeholder="Price"
            value={newProcedure.price}
            onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })}
            className="border p-2 mb-2"
            required
          />
          <button type="submit" className="btn btn-success">Update Procedure</button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteConfirmationModalOpen}
        close={() => setDeleteConfirmationModalOpen(false)}
      >
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p>Are you sure you want to delete the procedure: {procedureToDelete?.name}?</p>
        <div className='text-center pt-5'>
          <button onClick={confirmDelete} className="btn bg-red-500 hover:bg-red-500 text-white">Yes, Delete</button>

        </div>
      </Modal>
    </div>
  );
}
