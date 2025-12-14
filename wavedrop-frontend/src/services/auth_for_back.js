import { api } from './api';

export const authService = {
  // S'inscrire
  inscription: async (email, motDePasse) => {
    const response = await api.post('/auth/register', { 
      email, 
      password: motDePasse 
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  // Se connecter
  connexion: async (email, motDePasse) => {
    const response = await api.post('/auth/login', { 
      email, 
      password: motDePasse 
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  // Se déconnecter
  deconnexion: () => {
    localStorage.removeItem('token');
  },

  // Obtenir l'utilisateur connecté
  obtenirUtilisateurActuel: async () => {
    return api.get('/auth/me');
  },
};