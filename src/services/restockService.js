import axios from 'axios';


const API_URL = 'http://localhost:5000/api/purchases/add'; 

export const updateStock = async (restockData) => {
    try {
        
        const response = await axios.post(API_URL, restockData);
        return response.data;
    } catch (error) {
        console.error("Restock Service Error:", error);
        throw error;
    }
};

export const getPurchaseHistory = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/purchases/history');
        return response.data;
    } catch (error) {
        console.error("History Service Error:", error);
        throw error;
    }
};