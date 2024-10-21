import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Hero_Crud() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [formData, setFormData] = useState({
    Title: '',
    description: '',
    Image: null,
    // isHero: false,
  });
  const [heroItems, setHeroItems] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // New loading state for update
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch hero items from the API
  useEffect(() => {
    const fetchHeroItems = async () => {
      try {
        const response = await axios.get(`${BASEURL}/Landingpage/landing-pages`);
        setHeroItems(response.data);
      } catch (error) {
        console.error('Error fetching hero items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroItems();
  }, [BASEURL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));

    // Handle image preview
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (itemId) => {
    const form = new FormData();

    // Append form data, including Image only if it's provided
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'Image' && value) {
        form.append(key, value);
      } else if (key !== 'Image') {
        form.append(key, value);
      }
    });

    try {
      setUpdating(true); // Set loading state to true

      // Use a PUT request to update the item
      const response = await axios.put(`${BASEURL}/Landingpage/landing-pages/${itemId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update heroItems locally
      setHeroItems((prevItems) =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, ...formData, Image: formData.Image ? response.data.Image : item.Image } : item
        )
      );

      // Reset form and state
      setFormData({
        Title: '',
        description: '',
        Image: null,
      });
      setIsEditing(null);
      setImagePreview(null);

      // Show success alert
      alert('Hero item updated successfully!');

    } catch (error) {
      console.error('Error saving hero item:', error);
    } finally {
      setUpdating(false); // Set loading state back to false
    }
  };


  // Handle edit action
  const handleEdit = (item) => {
    setFormData({
      Title: item.Title,
      description: item.description,
      Image: null,
      // isHero: item.isHero,
    });
    setIsEditing(item._id);
    setImagePreview(null);
  };

  const getImageUrl = (image) => {
    return image
      ? `data:image/jpeg;base64,${image}`
      : "https://via.placeholder.com/150"; // Placeholder image for no image
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Hero:</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {heroItems.slice(0, 2).map(item => (
          <div key={item._id} className={`border rounded-lg shadow-lg p-6 flex flex-col bg-[#C6E4DA] transition-transform duration-200 hover:shadow-xl ${isEditing === item._id ? 'h-auto' : 'max-h-[110rem] overflow-hidden'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-4">
                <img
                  src={getImageUrl(item.Image)}
                  alt={item.Title}
                  className="w-32  h-auto object-cover rounded-lg shadow-md"
                />
                <p className="font-semibold text-sm text-black">{item.isHero ? 'This is a Hero' : ''}</p>
                {isEditing === item._id && ( // Show preview only when editing
                  <div className="mt-2">
                    <img
                      src={imagePreview || "https://via.placeholder.com/150"} // Default placeholder if no image is uploaded
                      alt="Preview"
                      className="w-32 h-auto object-cover rounded-lg shadow-md"
                    />
                    <p className="font-semibold text-sm text-black">Preview</p>
                    <div className="relative mt-2">
                      <input
                        type="file"
                        id="file-upload"
                        name="Image"
                        onChange={handleChange}
                        accept="image/*"
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                      />
                      <label
                        htmlFor="file-upload"
                        className="border p-2 rounded-lg mb-2 shadow-sm focus:outline-none text-center cursor-pointer bg-[#4285F4] hover:bg-[#0C65F8] text-black transition duration-200"
                      >
                        Choose file
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow text-black">
                {isEditing === item._id ? ( // Show edit fields if this card is being edited
                  <>
                    <label className="font-medium">Title</label>
                    <input
                      type="text"
                      name="Title"
                      value={formData.Title}
                      onChange={handleChange}
                      className="border p-2 rounded-lg mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Title"
                      required
                    />
                    <label className="font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border p-2 rounded-lg mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Description"
                      required
                      style={{ height: '200px', resize: 'vertical' }}
                    />
                  </>
                ) : (
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{item.Title}</h3>
                    <p className="font-bold text-sm text-black">{item.isHero ? 'This is a Hero' : 'Not a Hero'}</p>
                  </div>
                )}
              </div>
            </div>
            <p className="font-medium text-black">Description:</p>
            <div className="max-h-32 overflow-y-auto mb-4 pl-1 pr-2">
              <p className="text-black">{item.description}</p>
            </div>
            <div className="flex justify-between mt-auto">
              {isEditing === item._id ? (
                <>
                  <button
                    onClick={() => {
                      handleSubmit(item._id);
                      setIsEditing(null); // Reset editing state after submission
                    }}
                    className={`bg-[#4285F4] hover:bg-[#0C65F8] text-black px-4 py-2 rounded-lg transition ${updating ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={updating} // Disable button while updating
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(null);
                      setFormData({
                        Title: '', description: '', Image: null,
                        // isHero: false
                      });
                      setImagePreview(null);
                    }}
                    className="bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-[#3EB489] hover:bg-[#62A78E] text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
