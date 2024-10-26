import React, { useEffect, useState } from 'react';
import Teethmodel from './Components/Teethmodel';
import NotesModal from './Components/NotesModal';
import AddToothModal from './Components/AddToothModal'; // Import the new modal
import axios from 'axios';

export default function ParentModel2d() {
  const [teethData, setTeethData] = useState({ Upper: [], Lower: [] });
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // For add tooth modal

  const Baseurl = import.meta.env.VITE_BASEURL;
  const userid = 'Patient017';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Baseurl}/tooth2dmodel/get-data/${userid}`);
      setTeethData(response.data);
    } catch (error) {
      console.error('Error fetching teeth data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToothClick = (tooth) => {
    const jaw = teethData.Upper.some(t => t._id === tooth._id) ? 'Upper' : 'Lower';
    setSelectedTooth({ ...tooth, jaw });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTooth(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const addTooth = async (newTooth) => {
    try {
      await axios.post(`${Baseurl}/tooth2dmodel/add-tooth`, newTooth);
      fetchData(); // Refresh the teeth data after adding
    } catch (error) {
      console.error('Error adding tooth:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-primary rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Dental Records</h1>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Tooth
      </button>

      <div>
        {/* Upper Teeth Section */}
        <h2 className="text-xl font-bold mb-2">Upper Teeth</h2>
        <div className="flex justify-center space-x-1 flex-wrap mb-4">
          {teethData.Upper.length > 0 ? (
            teethData.Upper.map((tooth) => (
              <Teethmodel
                key={tooth._id}
                id={tooth._id}
                name={tooth.name}
                status={tooth.status}
                notes={tooth.note}
                onClick={() => handleToothClick(tooth)}
              />
            ))
          ) : (
            <p className="text-gray-600">No upper teeth data available.</p>
          )}
        </div>

        {/* Lower Teeth Section */}
        <h2 className="text-xl font-bold mb-2">Lower Teeth</h2>
        <div className="flex justify-center space-x-1 flex-wrap mb-4">
          {teethData.Lower.length > 0 ? (
            teethData.Lower.map((tooth) => (
              <Teethmodel
                key={tooth._id}
                id={tooth._id}
                name={tooth.name}
                status={tooth.status}
                notes={tooth.note}
                onClick={() => handleToothClick(tooth)}
              />
            ))
          ) : (
            <p className="text-gray-600">No lower teeth data available.</p>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {selectedTooth && (
        <NotesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          toothName={selectedTooth.name}
          toothStatus={selectedTooth.status}
          notes={selectedTooth || []}
          patientId={userid}
          toothId={selectedTooth._id}
          jaw={selectedTooth.jaw}
          onRefresh={fetchData}
        />
      )}

      {/* Add Tooth Modal */}
      <AddToothModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={addTooth}
        patientId={userid}
      />
    </div>
  );
}
