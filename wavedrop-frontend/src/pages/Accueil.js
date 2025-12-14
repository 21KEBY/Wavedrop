import React, { useState } from 'react';
import { useMusiques } from '../hooks/useMusiques';
import ListeMusiques from '../components/Musiques/ListeMusiques';
import { Search } from 'lucide-react';
import './Accueil.css';

const Accueil = () => {
  const { musiques, chargement, rechercherMusiques } = useMusiques();
  const [recherche, setRecherche] = useState('');

  const handleRecherche = (e) => {
    const query = e.target.value;
    setRecherche(query);
    
    if (query.trim()) {
      rechercherMusiques(query);
    }
  };

  return (
    <div className="accueil-page">
      <div className="accueil-container">
        <header className="accueil-header">
          <h1>Découvrez votre musique</h1>
          <p>Des milliers de titres à écouter et télécharger</p>
        </header>

        <div className="accueil-recherche">
          <div className="recherche-container">
            <Search size={20} className="recherche-icon" />
            <input
              type="text"
              placeholder="Rechercher un titre ou un artiste..."
              value={recherche}
              onChange={handleRecherche}
              className="recherche-input"
            />
          </div>
        </div>

        <div className="accueil-content">
          <div className="section-header">
            <h2>{recherche ? 'Résultats de recherche' : 'Toutes les musiques'}</h2>
            <span className="musiques-count">
              {musiques.length} {musiques.length > 1 ? 'musiques' : 'musique'}
            </span>
          </div>

          <ListeMusiques musiques={musiques} chargement={chargement} />
        </div>
      </div>
    </div>
  );
};

export default Accueil;