// API Service - Centralized API calls for the application
// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Generic error handler for API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Generic API request function with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// ======================
// DOCUMENTS API
// ======================

/**
 * Fetch all documents
 * @returns {Promise<Object>} Response containing documents array
 */
export const fetchDocuments = async () => {
  return apiRequest('/documents');
};

// ======================
// NOTEBOOKS API  
// ======================

/**
 * Fetch all notebooks for the knowledge base listing
 * @returns {Promise<Object>} Response containing notebooks array
 */
export const fetchNotebooks = async () => {
  return apiRequest('/notebooks');
};

/**
 * Fetch a specific notebook by ID
 * @param {string|number} id - The notebook ID
 * @returns {Promise<Object>} Response containing the notebook data
 */
export const fetchNotebook = async (id) => {
  if (!id) {
    throw new Error('Notebook ID is required');
  }
  return apiRequest(`/notebooks/${id}`);
};

/**
 * Update sources for a specific notebook
 * @param {string|number} id - The notebook ID
 * @param {Array} sources - Updated sources array
 * @returns {Promise<Object>} Response confirming the update
 */
export const updateNotebookSources = async (id, sources) => {
  if (!id) {
    throw new Error('Notebook ID is required');
  }
  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array');
  }

  return apiRequest(`/notebooks/${id}/sources`, {
    method: 'PUT',
    body: JSON.stringify({ sources }),
  });
};

/**
 * Send a chat message for a specific notebook
 * @param {string|number} id - The notebook ID
 * @param {string} message - The chat message
 * @param {Array} selectedSources - Array of selected sources
 * @returns {Promise<Object>} Response containing the AI response
 */
export const sendChatMessage = async (id, message, selectedSources = []) => {
  if (!id) {
    throw new Error('Notebook ID is required');
  }
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }

  return apiRequest(`/notebooks/${id}/chat`, {
    method: 'POST',
    body: JSON.stringify({ 
      message, 
      selectedSources 
    }),
  });
};

// ======================
// DISCOVER/SEARCH API
// ======================

/**
 * Search for discoverable resources
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {string} options.type - Resource type filter ('pdf', 'doc', 'text', 'youtube', 'all')
 * @param {number} options.limit - Maximum number of results
 * @returns {Promise<Object>} Response containing search results
 */
export const searchResources = async (query, options = {}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    throw new Error('Search query is required and must be a non-empty string');
  }

  const { type = 'all', limit = 20 } = options;
  
  // Build query parameters
  const params = new URLSearchParams({
    q: query.trim(),
    limit: limit.toString()
  });

  // Only add type filter if it's not 'all'
  if (type && type !== 'all') {
    params.set('type', type);
  }

  return apiRequest(`/discover?${params.toString()}`);
};

// ======================
// NOTEBOOK ACTIONS API
// ======================

/**
 * Create a new notebook (placeholder for future implementation)
 * @param {Object} notebookData - The notebook data to create
 * @returns {Promise<Object>} Response containing the created notebook
 */
export const createNotebook = async (notebookData) => {
  // TODO: Implement when backend endpoint is available
  console.log('Creating notebook:', notebookData);
  throw new Error('Create notebook endpoint not yet implemented');
};

/**
 * Delete a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID to delete
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteNotebook = async (id) => {
  // TODO: Implement when backend endpoint is available
  console.log('Deleting notebook:', id);
  throw new Error('Delete notebook endpoint not yet implemented');
};

/**
 * Add a new source to a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} sourceData - The source data to add
 * @returns {Promise<Object>} Response containing the updated notebook
 */
export const addNotebookSource = async (id, sourceData) => {
  // TODO: Implement when backend endpoint is available
  console.log('Adding source to notebook:', id, sourceData);
  throw new Error('Add source endpoint not yet implemented');
};

// ======================
// STUDIO ACTIONS API
// ======================

/**
 * Generate audio overview for a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Response containing the generated audio overview
 */
export const generateAudioOverview = async (id, options = {}) => {
  // TODO: Implement when backend endpoint is available
  console.log('Generating audio overview for notebook:', id, options);
  throw new Error('Audio overview generation endpoint not yet implemented');
};

/**
 * Generate study guide for a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Response containing the generated study guide
 */
export const generateStudyGuide = async (id, options = {}) => {
  // TODO: Implement when backend endpoint is available
  console.log('Generating study guide for notebook:', id, options);
  throw new Error('Study guide generation endpoint not yet implemented');
};

/**
 * Generate briefing document for a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Response containing the generated briefing doc
 */
export const generateBriefingDoc = async (id, options = {}) => {
  // TODO: Implement when backend endpoint is available
  console.log('Generating briefing doc for notebook:', id, options);
  throw new Error('Briefing doc generation endpoint not yet implemented');
};

/**
 * Generate FAQs for a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Response containing the generated FAQs
 */
export const generateFAQs = async (id, options = {}) => {
  // TODO: Implement when backend endpoint is available
  console.log('Generating FAQs for notebook:', id, options);
  throw new Error('FAQs generation endpoint not yet implemented');
};

/**
 * Generate timeline for a notebook (placeholder for future implementation)
 * @param {string|number} id - The notebook ID
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Response containing the generated timeline
 */
export const generateTimeline = async (id, options = {}) => {
  // TODO: Implement when backend endpoint is available
  console.log('Generating timeline for notebook:', id, options);
  throw new Error('Timeline generation endpoint not yet implemented');
};

// ======================
// LESSON PLANNER API
// ======================

/**
 * Fetch all lesson plans for listing page
 * @returns {Promise<Object>} Response containing lesson plans array
 */
export const fetchLessonPlans = async () => {
  return apiRequest('/lesson-planner');
};

/**
 * Fetch individual lesson plan by ID
 * @param {string|number} id - Lesson plan ID
 * @returns {Promise<Object>} Response containing lesson plan details
 */
export const fetchLessonPlan = async (id) => {
  if (!id) {
    throw new Error('Lesson plan ID is required');
  }
  return apiRequest(`/lesson-planner/${id}`);
};

// ======================
// UTILITY FUNCTIONS
// ======================

/**
 * Check if the API server is reachable
 * @returns {Promise<boolean>} True if server is reachable, false otherwise
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

/**
 * Get the current API base URL
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = () => API_BASE_URL;

// ======================
// ERROR TYPES
// ======================

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

// Export default object for convenience
export default {
  // Documents
  fetchDocuments,
  
  // Notebooks
  fetchNotebooks,
  fetchNotebook,
  updateNotebookSources,
  sendChatMessage,
  createNotebook,
  deleteNotebook,
  addNotebookSource,
  
  // Discover/Search
  searchResources,
  
  // Studio Actions
  generateAudioOverview,
  generateStudyGuide,
  generateBriefingDoc,
  generateFAQs,
  generateTimeline,
  
  // Lesson Planner
  fetchLessonPlans,
  fetchLessonPlan,
  
  // Utilities
  checkServerHealth,
  getApiBaseUrl,
  ApiError,
}; 