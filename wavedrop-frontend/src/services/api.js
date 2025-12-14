const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = {
  // Faire une requête GET (récupérer des données)
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Faire une requête POST (envoyer des données)
  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Faire une requête PUT (modifier des données)
  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || response.statusText);
      error.response = response;
      throw error;
    }
    
    return response.json();
  },

  // Faire une requête POST avec FormData (pour envoyer des fichiers)
  postFormData: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        // Ne pas définir Content-Type pour FormData (géré automatiquement)
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Faire une requête DELETE (supprimer des données)
  delete: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    // Si 204 No Content, ne pas parser JSON
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  },
};

export default api;