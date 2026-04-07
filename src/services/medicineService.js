import axios from 'axios';

const API_URL = 'http://localhost:5000/api/medicines'; 


export const addMedicine = async (medicineData) => {

    const response = await axios.post(`${API_URL}/add`, medicineData); 
    return response.data;
};

// ✅ Get All Medicines
export const getMedicines = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// ✅ Get Return History
export const getReturnHistory = async () => {
    
    const response = await axios.get(`${API_URL}/returns/all`); 
    return response.data;
};

// ✅ Delete Medicine
export const deleteMedicine = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`); 
    return response.data;
};

// ✅ Update Medicine
export const updateMedicine = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
};