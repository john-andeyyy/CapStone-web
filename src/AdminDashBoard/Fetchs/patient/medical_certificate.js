import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

export const get_procedure_by_id = async (id) => {
    try {

        // const id = '66d1f1b4feda147128aad44e'
        const response = await axios.get(
            `${BASEURL}/Procedure/show/${id}`
            , {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        return console.warn(error);

    }
}