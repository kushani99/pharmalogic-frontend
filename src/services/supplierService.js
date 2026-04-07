import axios from 'axios';

const API_URL = 'http://localhost:5000/api/suppliers';


export const addSupplier = async (supplierData) => {
    try {
        const response = await axios.post(API_URL, supplierData);
        
        return response.data; 
    } catch (error) {
    
        console.error("Error in addSupplier Service:", error.response ? error.response.data : error.message);
        throw error; 
    }
};


export const getSuppliers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error in getSuppliers Service:", error.response ? error.response.data : error.message);
        throw error;
    }
};