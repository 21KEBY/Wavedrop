import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [estConnecte, setEstConnecte] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const verifierAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await authService.obtenirUtilisateurActuel();
          setUtilisateur(user);
          setEstConnecte(true);
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
          // Déconnexion si le token est invalide
          localStorage.removeItem('token');
          setUtilisateur(null);
          setEstConnecte(false);
        }
      }
      setChargement(false);
    };

    verifierAuth();
  }, []);

  const connexion = async (email, motDePasse) => {
    try {
      const response = await authService.connexion(email, motDePasse);
      setUtilisateur(response.user || response.utilisateur);
      setEstConnecte(true);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const inscription = async (email, motDePasse) => {
    try {
      const response = await authService.inscription(email, motDePasse);
      setUtilisateur(response.user || response.utilisateur);
      setEstConnecte(true);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const deconnexion = () => {
    authService.deconnexion();
    setUtilisateur(null);
    setEstConnecte(false);
  };

  const value = {
    utilisateur,
    estConnecte,
    chargement,
    connexion,
    inscription,
    deconnexion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};