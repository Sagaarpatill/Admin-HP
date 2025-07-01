import axios from 'axios';

// Define the base URL for your API
// Make sure this is consistent with your backend's base path for API routes
// If your backend routes are like /api/supervisors, then include /api here
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; // <--- Ensure /api is here if your backend routes include it

// Create an Axios instance with base URL and credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000 // Apply default timeout to all api instance requests
});

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Tries to get a 'token' from browser's localStorage
    return {
        Authorization: token ? `Bearer ${token}` : '', // If token exists, format it as "Bearer <token>"
    };
};

// Generic API error handling (consolidated and improved)
const handleApiError = (functionName, error) => {
    console.error(`API: ${functionName}: Error caught during API call:`);
    if (error.response) {
        // Server responded with a status other than 2xx
        console.error(`API: ${functionName}: Server Response Status:`, error.response.status);
        console.error(`API: ${functionName}: Server Response Data:`, error.response.data);
        throw new Error(`Failed to ${functionName.replace('fetch', 'fetch ')}. Server responded with status ${error.response.status}: ${error.response.data.message || error.response.data.error || error.response.statusText || 'Unknown server error'}`);
    } else if (error.request) {
        // Request was made but no response was received (e.g., network error, CORS issue)
        console.error(`API: ${functionName}: No response received from server.`);
        throw new Error(`Failed to ${functionName.replace('fetch', 'fetch ')}. No response from server. Check network or CORS settings.`);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error(`API: ${functionName}: Error setting up request:`, error.message);
        throw new Error(`Failed to ${functionName.replace('fetch', 'fetch ')}. Request setup error: ${error.message}`);
    }
};


// -------------------- CUSTOMERS API --------------------

/**
 * @function fetchCustomers
 * @description Sends a GET request to fetch a list of customers.
 * @returns {Promise<Array>} A promise that resolves with an array of customer objects.
 * @throws {Error} If the API call fails or the response structure is unexpected.
 */
export const fetchCustomers = async () => {
    try {
        // --- THIS LINE IS NOW FULLY CORRECTED ---
        console.log("API: fetchCustomers: Attempting to send request to", `${API_BASE_URL}/api/add_customers`);

        const response = await api.get('/add_customers', {
            headers: getAuthHeaders(), // Assuming getAuthHeaders() is defined
            timeout: 10000
        });

        const actualServerData = response.data;
        console.log("API: fetchCustomers: Received data:", actualServerData);

        if (Array.isArray(actualServerData)) {
            console.log("API: fetchCustomers: Fetched customers successfully. Count:", actualServerData.length);
            return actualServerData;
        } else {
            console.warn("API: fetchCustomers: Expected an array of customers or an object with a 'customers' array, received:", actualServerData);
            // Attempt to extract from a potential 'customers' property if response is an object
            if (actualServerData && Array.isArray(actualServerData.customers)) {
                console.log("API: fetchCustomers: Extracting from 'customers' property. Count:", actualServerData.customers.length);
                return actualServerData.customers;
            }
            throw new Error("Invalid data structure received from server for customers.");
        }
    } catch (error) {
        handleApiError('fetchCustomers', error); // Assuming handleApiError is defined
        // Re-throwing a more informative error for the calling component
        throw new Error(`Failed to fetch Customers. Server responded with status ${error.response ? error.response.status : 'N/A'}: ${error.response ? (error.response.data.error || JSON.stringify(error.response.data) || 'Internal server error') : error.message}`);
    }
};


/**
 * @function addCustomer
 * @description Sends a POST request to add a new customer.
 * @param {Object} customerData - The data for the new customer.
 * @returns {Promise<Object>} A promise that resolves with the newly created customer object.
 * @throws {Error} If the API call fails.
 */
export const addCustomer = async (customerData) => {
    try {
        // Change this line:
        const response = await api.post('/add_customers', customerData, {
        // FROM: const response = await api.post('/api/add_customers', customerData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            timeout: 10000
        });
        console.log("API: addCustomer: Customer added successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('addCustomer', error);
    }
};

/**
/**
 * @function updateCustomer
 * @description Sends a PUT request to update an existing customer.
 * @param {string} id - The ID of the customer to update.
 * @param {Object} customerData - The updated data for the customer.
 * @returns {Promise<Object>} A promise that resolves with the updated customer object.
 * @throws {Error} If the API call fails.
 */
export const updateCustomer = async (id, customerData) => {
    try {
        const response = await api.put(`/add_customers/${id}`, customerData, { // <-- REMOVED THE FIRST '/api'
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            timeout: 10000
        });
        console.log("API: updateCustomer: Customer updated successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('updateCustomer', error); // Ensure handleApiError correctly processes the error
    }
};

/**
 * @function deleteCustomer
 * @description Sends a DELETE request to remove a customer.
 * @param {string} id - The ID of the customer to delete.
 * @returns {Promise<void>} A promise that resolves on successful deletion (no content).
 * @throws {Error} If the API call fails.
 */
export const deleteCustomer = async (id) => {
    try {
        console.log(`API: deleteCustomer: Attempting to delete customer with ID: ${id}`);
        // REMOVE THE EXTRA '/api/' HERE:
        const response = await api.delete(`/add_customers/${id}`, { // Corrected line
            headers: getAuthHeaders(),
            timeout: 10000
        });
        console.log("API: deleteCustomer: Customer deleted successfully (status 204 expected). Status:", response.status);
        return; // No content expected for 204
    } catch (error) {
        handleApiError('deleteCustomer', error);
    }
};

// -------------------- SUPERVISORS API --------------------
/*
 * @function fetchSupervisors
 * @description Sends a GET request to fetch a list of supervisors.
 * @returns {Promise<Array>} A promise that resolves with an array of supervisor objects.
 * @throws {Error} If the API call fails or the response structure is unexpected.
 */
export const fetchSupervisors = async () => {
    try {
        // Use the existing Axios instance 'api' for consistency
        console.log("API: fetchSupervisors: Attempting to send request to", `${api.defaults.baseURL}/supervisors`); // Debug log with full path
        const response = await api.get('/supervisors', {
            headers: getAuthHeaders(),
            // Timeout is already set on the instance, but can be overridden here if needed
        });
        const actualServerData = response.data;
        console.log("API: fetchSupervisors: Received data:", actualServerData);

        if (Array.isArray(actualServerData)) {
            console.log("API: fetchSupervisors: Fetched supervisors successfully. Count:", actualServerData.length);
            return actualServerData;
        } else if (actualServerData && Array.isArray(actualServerData.supervisors)) {
            console.warn("API: fetchSupervisors: Data is an object with 'supervisors' array. Extracting 'supervisors' property.");
            return actualServerData.supervisors;
        } else {
            console.error("API: fetchSupervisors: Unexpected final response structure. Expected array of supervisors. Actual processed data:", actualServerData);
            throw new Error("Invalid data structure received from server for supervisors.");
        }
    } catch (error) {
        handleApiError('fetchSupervisors', error); // Use your consistent error handler
    }
};

/**
 * @function addSupervisor
 * @description Sends a POST request to add a new supervisor.
 * @param {Object} supervisorData - The data for the new supervisor.
 * @returns {Promise<Object>} A promise that resolves with the newly created supervisor object.
 * @throws {Error} If the API call fails.
 */
export const addSupervisor = async (supervisorData) => {
    try {
        const response = await api.post('/add_supervisors', supervisorData, { // Removed redundant /api/ prefix
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            // Timeout already handled by instance
        });
        console.log("API: addSupervisor: Supervisor added successfully:", response.supervisorData);
        return response.supervisorData;
    } catch (error) {
        handleApiError('addSupervisor', error);
    }
};

/**
 * @function deleteSupervisor
 * @description Sends a DELETE request to remove a supervisor.
 * @param {string} id - The ID of the supervisor to delete.
 * @returns {Promise<void>} A promise that resolves on successful deletion (no content).
 * @throws {Error} If the API call fails.
 */
export const deleteSupervisor = async (id) => {
    try {
        console.log(`API: deleteSupervisor: Attempting to delete supervisor with ID: ${id}`);
        const response = await api.delete(`/Delete_Supervisor/${id}`, { // Removed redundant /api/ prefix
            headers: getAuthHeaders(),
            // Timeout already handled by instance
        });
        console.log("API: deleteSupervisor: Supervisor deleted successfully (status 204 expected). Status:", response.status);
        return;
    } catch (error) {
        handleApiError('deleteSupervisor', error);
    }
};

/**
 * @function updateSupervisorData
 * @description Sends a PUT request to update an existing supervisor.
 * @param {string} id - The ID of the supervisor to update.
 * @param {Object} supervisorData - The updated data for the supervisor.
 * @returns {Promise<Object>} A promise that resolves with the updated supervisor object.
 * @throws {Error} If the API call fails.
 */
export const updatedSupervisorData = async (id, supervisorData) => {
    try {
        const response = await api.put(`/Updated_supervisors/${id}`, supervisorData, { // Removed redundant /api/ prefix
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            // Timeout already handled by instance
        });
        console.log("API: updateSupervisorData: Supervisor updated successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('updateSupervisorData', error);
    }
};

// -------------------- DOCUMENTS API --------------------

/**
 * @function fetchDocuments
 * @description Sends a GET request to fetch documents, optionally filtered by project ID and/or categories.
 * @param {string} [projectId] - Optional: The ID of the project to fetch documents for.
 * @param {Array<string>} [categories] - Optional: An array of categories to filter documents by.
 * @returns {Promise<Array>} A promise that resolves with an array of document objects.
 * @throws {Error} If the API call fails.
 */
export const fetchDocuments = async (projectId = null, categories = null) => {
    try {
        let url = `/documents`;
        const params = new URLSearchParams();

        if (projectId) {
            params.append('projectId', projectId);
        }
        if (categories && Array.isArray(categories) && categories.length > 0) {
            params.append('categories', categories.join(','));
        }

        if (params.toString()) {
            url = `${url}?${params.toString()}`;
        }

        console.log(`API: fetchDocuments: Attempting to send request to ${API_BASE_URL}${url}`);
        const response = await api.get(url, {
            headers: getAuthHeaders(),
            timeout: 10000,
        });
        console.log("API: fetchDocuments: Received data:", response.data);
        let documentsArray = [];
        if (Array.isArray(response.data)) {
            documentsArray = response.data;
        } else if (response.data && Array.isArray(response.data.documents)) {
            documentsArray = response.data.documents;
        } else {
            console.warn("API: fetchDocuments: Expected an array of documents or an object with a 'documents' array, received:", response.data);
        }
        console.log("API: fetchDocuments: Documents fetched successfully. Count:", documentsArray.length);
        return documentsArray;
    } catch (error) {
        handleApiError('fetchDocuments', error);
    }
};

/**
 * @function createDocument
 * @description Sends a POST request to upload a new document, including its project ID.
 * @param {FormData} formData - FormData containing 'name', 'category', 'file', and 'projectId'.
 * @returns {Promise<Object>} A promise that resolves with the created document object.
 * @throws {Error} If the API call fails.
 */
export const createDocument = async (formData) => {
    try {
        console.log("API: createDocument: Attempting to send request to", `${API_BASE_URL}/documents`);
        const response = await api.post('/documents', formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': undefined, // Crucial for FormData, lets Axios set boundary
            },
            timeout: 30000,
        });
        console.log("API: createDocument: Document created successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('createDocument', error);
    }
};

/**
 * @function updateDocument
 * @description Sends a PUT request to update an existing document.
 * @param {string} id - The ID of the document to update.
 * @param {FormData} documentData - FormData containing 'name', 'category', and optionally 'file'.
 * @returns {Promise<Object>} A promise that resolves with the updated document object.
 * @throws {Error} If the API call fails.
 */
export const updateDocument = async (id, documentData) => {
    try {
        console.log(`API: updateDocument: Attempting to update document ID: ${id}`);
        const response = await api.put(`/documents/${id}`, documentData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': undefined,
            },
            timeout: 30000
        });
        console.log("API: updateDocument: Document updated successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('updateDocument', error);
    }
};

/**
 * @function updateDocumentStatus
 * @description Sends a PUT request to update a document's status.
 * @param {string} id - The ID of the document to update.
 * @param {string} status - The new status ('Verified' or 'Unverified').
 * @returns {Promise<Object>} A promise that resolves with the updated document object.
 * @throws {Error} If the API call fails.
 */
export const updateDocumentStatus = async (id, newStatus) => {
    console.log(`API: updateDocumentStatus: Toggling status for ID ${id} to ${newStatus}`);
    try {
        const response = await api.put(`/documents/${id}/status`, { status: newStatus }, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            timeout: 10000
        });
        console.log('API: updateDocumentStatus: Status updated successfully:', response.data);
        return response.data;
    } catch (error) {
        handleApiError('updateDocumentStatus', error);
    }
};

/**
 * @function deleteDocument
 * @description Sends a DELETE request to remove a document.
 * @param {string} id - The ID of the document to delete.
 * @returns {Promise<void>} A promise that resolves on successful deletion (no content).
 * @throws {Error} If the API call fails.
 */
export const deleteDocument = async (id) => {
    try {
        console.log(`API: deleteDocument: Attempting to delete document with ID: ${id}`);
        const response = await api.delete(`/documents/${id}`, {
            headers: getAuthHeaders(),
            timeout: 10000
        });
        console.log("API: deleteDocument: Document deleted successfully (status 204 expected). Status:", response.status);
        return;
    } catch (error) {
        handleApiError('deleteDocument', error);
    }
};


// -------------------- PROJECTS API --------------------

/**
 * @function createProject
 * @description Sends a POST request to create a new project.
 * @param {FormData | Object} projectData - The project data. Can be FormData for file uploads, or a plain object for JSON.
 * @returns {Promise<Object>} A promise that resolves with the created project object.
 * @throws {Error} If the API call fails or the response structure is unexpected.
 */
export const createProject = async (projectData) => {
    try {
        console.log("API: createProject: Attempting to send request to", `${API_BASE_URL}/projects`);
        const response = await api.post('/projects', projectData, {
            headers: projectData instanceof FormData ? { ...getAuthHeaders(), 'Content-Type': undefined } : { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            timeout: 10000
        });

        console.log("API: createProject: Project created successfully. Response data:", response.data);
        if (response.data && response.data.success === true && response.data.project) {
            return response.data.project;
        } else {
            console.error("API: createProject: Unexpected successful response structure:", response.data);
            throw new Error("Project creation acknowledged, but server response was not as expected.");
        }
    } catch (error) {
        handleApiError('createProject', error);
    }
};

/**
 * @function deleteProject
 * @description Sends a DELETE request to remove a project.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<Object>} A promise that resolves with the server's response data for deletion.
 * @throws {Error} If the API call fails.
 */
export const deleteProject = async (projectId) => {
    try {
        console.log(`API: deleteProject: Attempting to delete project with ID: ${projectId}`);
        const response = await api.delete(`/projects/${projectId}`, {
            headers: getAuthHeaders(),
            timeout: 10000
        });
        console.log("API: deleteProject: Project deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        handleApiError('deleteProject', error);
    }
};

/**
 * @function fetchProjects
 * @description Sends a GET request to fetch all projects.
 * @returns {Promise<Array>} A promise that resolves with an array of project objects.
 * @throws {Error} If the API call fails or the response structure is unexpected.
 */
export const fetchProjects = async () => {
    try {
        console.log("API: fetchProjects: Attempting to send request to", `${API_BASE_URL}/projects`);
        const response = await api.get('/projects', {
            headers: getAuthHeaders(),
            timeout: 10000
        });

        console.log("API: fetchProjects: Received data:", response.data);
        if (response.data && Array.isArray(response.data.projects)) {
            console.log("API: fetchProjects: Fetched projects successfully. Count:", response.data.projects.length);
            return response.data.projects;
        } else {
            console.error("API: fetchProjects: Unexpected final response structure. Expected object with 'projects' array. Actual processed data:", response.data);
            throw new Error("Invalid data structure received from server for projects.");
        }
    } catch (error) {
        handleApiError('fetchProjects', error);
    }
};


/**
 * @function fetchProject
 * @description Sends a GET request to fetch a single project by its ID.
 * @param {string} projectId - The ID of the project to fetch.
 * @returns {Promise<Object>} A promise that resolves with a single project object,
 * including nested customer and supervisor details.
 * @throws {Error} If the API call fails or the response structure is unexpected.
 */
export const fetchProject = async (projectId) => {
    try {
        console.log(`API: fetchProject: Attempting to send request to ${API_BASE_URL}/projects/${projectId}`);
        const response = await api.get(`/projects/${projectId}`, {
            headers: getAuthHeaders(),
            timeout: 10000,
        });

        console.log("API: fetchProject: Received data:", response.data);
        if (response.data && typeof response.data === 'object' && response.data.projectId !== undefined) {
            console.log("API: fetchProject: Project fetched successfully:", response.data);
            return response.data;
        } else {
            console.error("API: fetchProject: Unexpected response structure. Expected a single project object. Actual data:", response.data);
            throw new Error("Invalid data structure received from server for single project.");
        }
    } catch (error) {
        handleApiError('fetchProject', error);
    }
  }


  // fetch Architects 
export const fetchArchitects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/Architects`, { // <-- Corrected: Removed the extra `/api`
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const architects = response.data; // Ensure you're getting data from response.data
    console.log("Fetched architect data:", architects);

    if (!Array.isArray(architects)) {
      console.warn("Data is not an array:", architects);
      return [];
    }

    return architects;
  } catch (error) {
    console.error("Error fetching architect:", error);
    // Provide a user-friendly error message if needed
    // return [];
    throw new Error(error.response?.data?.error || "Sorry! the data you are looking for could not be found");
  }
};


// Add Architects
export const addArchitect = async (architectData) => {
  try {
    const token = localStorage.getItem('token');
    // Use the 'api' instance and the correct relative path
    const response = await api.post(`/architects-add`, architectData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data; // FIX 1: Corrected: Return the actual data from the response
  } catch (error) {
    console.error("Error adding architect:", error.response || error); // Good for debugging

    let errorMessage = "Failed to add architect"; // Default message

    // FIX 2: Correctly extract error message from server response
    if (error.response && error.response.data) {
      if (error.response.data.error) { // If your backend sends an 'error' field
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) { // If backend sends a 'message' field
        errorMessage = error.response.data.message;
      } else {
        // Fallback: If structure is unknown, stringify the whole data object
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      // For network errors or other client-side errors (e.g., timeout)
      errorMessage = error.message;
    }

    throw new Error(errorMessage); // Throw a new Error with the refined message
  }
};

export const updateArchitect = async (ar_id, architectData) => {
  try {
    const token = localStorage.getItem('token');
    // Use the 'api' instance and the correct relative path
    const response = await api.put(`/architects/${ar_id}`, architectData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data; // FIX 1: Corrected: Return the actual data from the response
  } catch (error) {
    console.error(`Error updating architect with ID ${ar_id}:`, error.response || error); // Good for debugging

    let errorMessage = "Failed to update architect"; // Default message

    // FIX 2: Correctly extract error message from server response
    if (error.response && error.response.data) {
      if (error.response.data.error) { // If your backend sends an 'error' field
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) { // If your backend sends a 'message' field
        errorMessage = error.response.data.message;
      } else {
        // Fallback: If structure is unknown, stringify the whole data object
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      // For network errors or other client-side errors (e.g., timeout)
      errorMessage = error.message;
    }

    throw new Error(errorMessage); // Throw a new Error with the refined message
  }
};

// Delete Architects
export const deletearchitect = async (id) => {
  try {
    const token = localStorage.getItem('token');
    // Use the 'api' instance which already has your base URL
    await api.delete(`/Architects-Delete/${id}`, { // Use 'api' instead of axios, and ensure path is correct
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    // For a successful delete, typically no data is returned, so just implicitly return undefined or true
    return true; // Or return nothing if you just want to signal success
  } catch (error) {
    console.error(`Error deleting architect with ID ${id}:`, error.response || error);

    let errorMessage = "Failed to delete Architect";
    if (error.response && error.response.data) {
      if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) { // If backend sends a 'message' field
        errorMessage = error.response.data.message;
      } else {
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // FIX HERE: Use 'new Error' with capital 'E'
    throw new Error(errorMessage);
  }
};