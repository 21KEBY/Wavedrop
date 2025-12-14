import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const LecteurContext = createContext();

// Créer l'instance Audio EN DEHORS du composant pour garantir qu'elle persiste
let audioInstance = null;
const getAudioInstance = () => {
  if (!audioInstance) {
    audioInstance = new Audio();
    console.log('🎵 Audio singleton créé');
  }
  return audioInstance;
};

export const LecteurProvider = ({ children }) => {
  const [musiqueActuelle, setMusiqueActuelle] = useState(null);
  const [estEnLecture, setEstEnLecture] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progression, setProgression] = useState(0);
  const [duree, setDuree] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [indexActuel, setIndexActuel] = useState(0);
  const [modeRepetition, setModeRepetition] = useState('off'); // 'off', 'one', 'all'
  
  // Référence vers l'instance singleton
  const audioRef = useRef(getAudioInstance());

  // Définir 'suivant' avec useCallback pour éviter les problèmes de dépendances
  const suivant = useCallback(() => {
    if (indexActuel < playlist.length - 1) {
      setIndexActuel(indexActuel + 1);
    } else {
      setIndexActuel(0); // Revenir au début
    }
  }, [indexActuel, playlist.length]);

  const precedent = useCallback(() => {
    if (indexActuel > 0) {
      setIndexActuel(indexActuel - 1);
    } else {
      setIndexActuel(playlist.length - 1); // Aller à la fin
    }
  }, [indexActuel, playlist.length]);

  // Attacher les événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgression(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuree(audio.duration);
    };

    const handleEnded = () => {
      // Gérer les différents modes de répétition
      if (modeRepetition === 'one') {
        // Répéter la piste actuelle
        audio.currentTime = 0;
        audio.play().catch((e) => console.error('Erreur de lecture:', e));
      } else if (modeRepetition === 'all') {
        // Répéter toute la playlist
        if (indexActuel < playlist.length - 1) {
          setIndexActuel(prev => prev + 1);
        } else {
          setIndexActuel(0); // Revenir au début
        }
      } else {
        // Mode off : passer à la suivante, s'arrêter à la fin
        if (indexActuel < playlist.length - 1) {
          setIndexActuel(prev => prev + 1);
        } else {
          setEstEnLecture(false);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Cleanup pour réattacher avec les nouvelles valeurs
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [modeRepetition, indexActuel, playlist.length]); // Mettre à jour quand ces valeurs changent

  // Gérer le changement de piste SÉPARÉMENT
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (indexActuel >= 0 && indexActuel < playlist.length) {
      const musique = playlist[indexActuel];
      setMusiqueActuelle(musique);

      if (musique?.urlAudio && audio.src !== musique.urlAudio) {
        console.log('🎵 Chargement:', musique.titre);
        audio.src = musique.urlAudio;
        audio.volume = volume;
        audio.play().catch((e) => console.error('Erreur de lecture:', e));
        setEstEnLecture(true);
      }
    }
  }, [indexActuel, playlist, volume]);

  const jouer = (musique, nouvellePlaylist = null) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (nouvellePlaylist) {
      setPlaylist(nouvellePlaylist);
      const index = nouvellePlaylist.findIndex((m) => m.id === musique.id);
      setIndexActuel(index !== -1 ? index : 0);
    } else {
      setMusiqueActuelle(musique);
      audio.src = musique.urlAudio;
      audio.volume = volume;
      audio.play().catch((e) => console.error('Erreur de lecture:', e));
      setEstEnLecture(true);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setEstEnLecture(false);
  };

  const reprendre = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch((e) => console.error('Erreur de lecture:', e));
    setEstEnLecture(true);
  };

  const changerVolume = (nouveauVolume) => {
    setVolume(nouveauVolume);
    if (audioRef.current) {
      audioRef.current.volume = nouveauVolume;
    }
  };

  const changerProgression = (nouvelleProgression) => {
    if (audioRef.current) {
      audioRef.current.currentTime = nouvelleProgression;
      setProgression(nouvelleProgression);
    }
  };

  const changerModeRepetition = () => {
    // Cycle : off → all → one → off
    setModeRepetition(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const telecharger = async (musique) => {
    try {
      // Utiliser le backend comme proxy pour éviter CORS
      const downloadUrl = `http://localhost:3000/download/${musique.id}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${musique.artiste} - ${musique.titre}.mp3`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de la musique');
    }
  };

  return (
    <LecteurContext.Provider
      value={{
        musiqueActuelle,
        estEnLecture,
        volume,
        progression,
        duree,
        playlist,
        modeRepetition,
        jouer,
        pause,
        reprendre,
        suivant,
        precedent,
        changerVolume,
        changerProgression,
        changerModeRepetition,
        telecharger,
      }}
    >
      {children}
    </LecteurContext.Provider>
  );
};