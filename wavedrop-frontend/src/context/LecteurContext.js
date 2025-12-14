import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const LecteurContext = createContext();

export const LecteurProvider = ({ children }) => {
  const [musiqueActuelle, setMusiqueActuelle] = useState(null);
  const [estEnLecture, setEstEnLecture] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progression, setProgression] = useState(0);
  const [duree, setDuree] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [indexActuel, setIndexActuel] = useState(0);
  
  const audioRef = useRef(new Audio());

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

  useEffect(() => {
    const audio = audioRef.current;

    if (indexActuel >= 0 && indexActuel < playlist.length) {
      const musique = playlist[indexActuel];
      setMusiqueActuelle(musique);

      if (musique?.urlAudio) {
        audio.src = musique.urlAudio;
        audio.volume = volume;
        audio.play().catch((e) => console.error('Erreur de lecture:', e));
        setEstEnLecture(true);
      }
    }

    const handleTimeUpdate = () => {
      setProgression(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuree(audio.duration);
    };

    const handleEnded = () => {
      suivant();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [indexActuel, playlist, volume, suivant]);

  const jouer = (musique, nouvellePlaylist = null) => {
    if (nouvellePlaylist) {
      setPlaylist(nouvellePlaylist);
      const index = nouvellePlaylist.findIndex((m) => m.id === musique.id);
      setIndexActuel(index !== -1 ? index : 0);
    } else {
      setMusiqueActuelle(musique);
      const audio = audioRef.current;
      audio.src = musique.urlAudio;
      audio.volume = volume;
      audio.play().catch((e) => console.error('Erreur de lecture:', e));
      setEstEnLecture(true);
    }
  };

  const pause = () => {
    audioRef.current.pause();
    setEstEnLecture(false);
  };

  const reprendre = () => {
    audioRef.current.play().catch((e) => console.error('Erreur de lecture:', e));
    setEstEnLecture(true);
  };

  const changerVolume = (nouveauVolume) => {
    setVolume(nouveauVolume);
    audioRef.current.volume = nouveauVolume;
  };

  const changerProgression = (nouvelleProgression) => {
    audioRef.current.currentTime = nouvelleProgression;
    setProgression(nouvelleProgression);
  };

  const telecharger = async (musique) => {
    try {
      const response = await fetch(musique.urlAudio);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${musique.artiste} - ${musique.titre}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
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
        jouer,
        pause,
        reprendre,
        suivant,
        precedent,
        changerVolume,
        changerProgression,
        telecharger,
      }}
    >
      {children}
    </LecteurContext.Provider>
  );
};