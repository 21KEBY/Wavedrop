import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Play, Pause, SkipBack, SkipForward, Download, Volume2, Music, Repeat, Repeat1 } from 'lucide-react';
import './BarreLecteur.css';

const BarreLecteur = () => {
  const {
    musiqueActuelle,
    estEnLecture,
    volume,
    progression,
    duree,
    modeRepetition,
    pause,
    reprendre,
    suivant,
    precedent,
    changerVolume,
    changerProgression,
    changerModeRepetition,
    telecharger,
  } = useAudio();

  if (!musiqueActuelle) {
    return null;
  }

  const formatTemps = (secondes) => {
    const minutes = Math.floor(secondes / 60);
    const secs = Math.floor(secondes % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (modeRepetition === 'one') return <Repeat1 size={20} />;
    return <Repeat size={20} />;
  };

  const handleProgressionChange = (e) => {
    const nouvelleProgression = parseFloat(e.target.value);
    changerProgression(nouvelleProgression);
  };

  const handleVolumeChange = (e) => {
    const nouveauVolume = parseFloat(e.target.value);
    changerVolume(nouveauVolume);
  };

  const pourcentageProgression = duree > 0 ? (progression / duree) * 100 : 0;

  return (
    <div className="barre-lecteur">
      <div className="lecteur-container">
        {/* Informations de la musique */}
        <div className="lecteur-info">
          {musiqueActuelle.urlCover ? (
            <img 
              src={musiqueActuelle.urlCover} 
              alt={musiqueActuelle.titre}
              className="lecteur-cover"
            />
          ) : (
            <div className="lecteur-cover-placeholder">
              <Music size={24} />
            </div>
          )}
          <div className="lecteur-details">
            <h4>{musiqueActuelle.titre}</h4>
            <p>{musiqueActuelle.artiste}</p>
          </div>
        </div>

        {/* Contrôles de lecture */}
        <div className="lecteur-controles">
          <div className="controles-boutons">
            <button onClick={precedent} className="btn-controle" title="Précédent">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={estEnLecture ? pause : reprendre} 
              className="btn-controle btn-play-pause"
              title={estEnLecture ? 'Pause' : 'Lecture'}
            >
              {estEnLecture ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={suivant} className="btn-controle" title="Suivant">
              <SkipForward size={20} />
            </button>
            <button 
              onClick={changerModeRepetition}
              className={`btn-controle btn-repeat ${modeRepetition !== 'off' ? 'active' : ''}`}
              title={modeRepetition === 'off' ? 'Répétition désactivée' : modeRepetition === 'one' ? 'Répéter la piste' : 'Répéter la playlist'}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Barre de progression */}
          <div className="lecteur-progression">
            <span className="temps-actuel">{formatTemps(progression)}</span>
            <input
              type="range"
              min="0"
              max={duree}
              value={progression}
              onChange={handleProgressionChange}
              className="slider-progression"
              style={{
                background: `linear-gradient(to right, var(--wave-blue) ${pourcentageProgression}%, rgba(255,255,255,0.3) ${pourcentageProgression}%)`
              }}
            />
            <span className="temps-total">{formatTemps(duree)}</span>
          </div>
        </div>

        {/* Volume et actions */}
        <div className="lecteur-actions">
          <button 
            onClick={() => telecharger(musiqueActuelle)} 
            className="btn-action"
            title="Télécharger"
          >
            <Download size={20} />
          </button>
          
          <div className="volume-controle">
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="slider-volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarreLecteur;