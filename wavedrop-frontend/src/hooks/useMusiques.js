import { useState, useEffect } from 'react';
import { musiquesService } from '../services/musiques';

export const useMusiques = () => {
  const [musiques, setMusiques] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const chargerMusiques = async () => {
    try {
      setChargement(true);
      const data = await musiquesService.obtenirToutesLesMusiques();
      setMusiques(data);
      setErreur(null);
    } catch (error) {
      console.error('Erreur lors du chargement des musiques:', error);
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerMusiques();
  }, []);

  const rechercherMusiques = async (query) => {
    try {
      setChargement(true);
      const data = await musiquesService.rechercherMusiques(query);
      setMusiques(data);
      setErreur(null);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  };

  return {
    musiques,
    chargement,
    erreur,
    chargerMusiques,
    rechercherMusiques,
  };
};