import { api } from './api';
import { mockAuthService } from './mockData';

// MODE DÉVELOPPEMENT : Utiliser les données fictives
<<<<<<< HEAD
const MODE_DEV = false;
=======
const MODE_DEV = true;
>>>>>>> f9e5454e1386bcc944ac1accc75add4b53d691f3

export const authService = MODE_DEV ? mockAuthService : {
  inscription: async (email, motDePasse) => {
    const response = await api.post('/auth/register', { email, password: motDePasse });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  connexion: async (email, motDePasse) => {
    const response = await api.post('/auth/login', { email, password: motDePasse });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  deconnexion: () => {
    localStorage.removeItem('token');
  },

  obtenirUtilisateurActuel: async () => {
    return api.get('/auth/me');
  },
};