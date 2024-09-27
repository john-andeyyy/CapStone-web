import axios from "axios";
import { showToast } from '../../Components/ToastNotification';

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
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        const data = {
            response: response.data,
            status: response.data.message
        }
        showToast('success', 'Update successful!');

        setTimeout(() => {
        window.location.reload();
        }, 3000);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};