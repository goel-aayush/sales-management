import axios from "axios";

// 1. Create an Axios Instance

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Global Error Handler Helper
const handleApiError = (error, fallbackData) => {
  if (error.response) {
    
    console.error("Server Error:", error.response.status, error.response.data);
  } else if (error.request) {
    console.error("Network Error: No response received", error.request);
  } else {
    console.error("API Config Error:", error.message);
  }
  
  // Return a safe fallback object so the UI doesn't crash
  return fallbackData;
};

// --- API FUNCTIONS ---

export const fetchSalesData = async (params) => {
  try {
    const response = await apiClient.get("/api/sales", { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, { 
      success: false, 
      data: [], 
      stats: { total_units: 0, total_amount: 0, total_discount: 0 } 
    });
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await apiClient.get("/api/sales/options");
    return response.data;
  } catch (error) {
    return handleApiError(error, { 
      success: false, 
      data: { regions: [], categories: [], paymentMethods: [], tags: [] } 
    });
  }
};

export default apiClient;