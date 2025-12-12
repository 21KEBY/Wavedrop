import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Play, Pause, Download, Music } from 'lucide-react';
import './CarteMusicale.css';

const CarteMusicale = ({ musique }) => {
  const { jouer, musiqueActuelle, estEnLecture, pause, telecharger } = useAudio();

  const estEnCoursDeJouer = musiqueActuelle?.id === musique.id && estEnLecture;

  const handleClick = () => {
    if (estEnCoursDeJouer) {
      pause();
    } else {
      jouer(musique);
    }
  };

  const formatDuree = (secondes) => {
    const minutes = Math.floor(secondes / 60);
    const secs = Math.floor(secondes % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`carte-musicale ${estEnCoursDeJouer ? 'en-lecture' : ''}`}>
      <div className="carte-cover">
        {musique.urlCover ? (
          <img src={musique.urlCover} alt={musique.titre} />
        ) : (
          <div className="cover-placeholder">
            <Music size={32} />
          </div>
        )}
        <button className="btn-play" onClick={handleClick}>
          {estEnCoursDeJouer ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <div className="carte-info">
        <h3 className="carte-titre">{musique.titre}</h3>
        <p className="carte-artiste">{musique.artiste}</p>
        <p className="carte-duree">{formatDuree(musique.duree)}</p>
      </div>

      <div className="carte-actions">
        <button 
          className="btn-telecharger" 
          onClick={() => telecharger(musique)}
          title="Télécharger"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default CarteMusicale;