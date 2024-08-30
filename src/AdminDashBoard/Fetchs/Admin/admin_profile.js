import axios from "axios";

const BASEURL = import.meta.env.VITE_BASEURL;

export const get_profile = async () => {

    try {
        const temp_response = await axios.get(`${BASEURL}/Admin/auth/Admin`,
            {
                withCredentials: true
            }
        )
        const response = temp_response.data
        return ({
            Email: response.Email || '',
            FirstName: response.FirstName || '',
            LastName: response.LastName || '',
            MiddleName: response.MiddleName || '',
            contactNumber: response.ContactNumber || '',
            ProfilePicture: response.ProfilePicture || '',
            ProfilePicturePreview: response.ProfilePicture || '',
            contactNumber: response.contactNumber || '',
            Username: response.Username || '',
            // status: response.data.message
        })
    } catch (error) {
        console.log(error);
    }
}

export const update_profile = async (profileData) => {
    try {
        const response = await axios.put(
            `${BASEURL}/Admin/auth/Update`,
            profileData, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure the correct content type
                },
            }
        );
        const data = {
            response: response.data,
            status: response.data.message
        }
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};