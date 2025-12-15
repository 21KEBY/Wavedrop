import React from 'react';
import CarteMusicale from './CarteMusicale';
import './ListeMusiques.css';

const ListeMusiques = ({ musiques, chargement, recherche }) => {
  if (chargement) {
    return (
      <div className="liste-chargement">
        <div className="spinner"></div>
        <p>Chargement des musiques...</p>
      </div>
    );
  }

  if (!musiques || musiques.length === 0) {
    return (
      <div className="liste-vide">
        {recherche ? (
          <>
            <p>🔍 Aucun résultat trouvé pour "{recherche}"</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Essayez avec d'autres mots-clés</p>
          </>
        ) : (
          <p>🎵 Aucune musique disponible pour le moment</p>
        )}
      </div>
    );
  }

  return (
    <div className="liste-musiques">
      {musiques.map((musique) => (
        <CarteMusicale key={musique.id} musique={musique} />
      ))}
    </div>
  );
};

export default ListeMusiques;