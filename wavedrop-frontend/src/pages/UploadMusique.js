import React, { useState } from 'react';
import { Upload, Music, X, CheckCircle } from 'lucide-react';
import { musiquesService } from '../services/musiques';
import './UploadMusique.css';

const UploadMusique = () => {
  const [fichierAudio, setFichierAudio] = useState(null);
  const [fichierCover, setFichierCover] = useState(null);
  const [titre, setTitre] = useState('');
  const [artiste, setArtiste] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [progression, setProgression] = useState(0);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const handleFichierAudio = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      if (fichier.type.startsWith('audio/')) {
        setFichierAudio(fichier);
        setErreur('');
        // Auto-remplir le titre si vide
        if (!titre) {
          setTitre(fichier.name.replace(/\.[^/.]+$/, ''));
        }
      } else {
        setErreur('Veuillez sélectionner un fichier audio valide (MP3, WAV, etc.)');
      }
    }
  };

  const handleFichierCover = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      if (fichier.type.startsWith('image/')) {
        setFichierCover(fichier);
        setErreur('');
      } else {
        setErreur('Veuillez sélectionner une image valide (JPG, PNG, etc.)');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces(false);

    // Validation
    if (!fichierAudio) {
      setErreur('Veuillez sélectionner un fichier audio');
      return;
    }
    if (!titre.trim()) {
      setErreur('Veuillez entrer un titre');
      return;
    }
    if (!artiste.trim()) {
      setErreur('Veuillez entrer un artiste');
      return;
    }

    setEnCours(true);
    setProgression(0);

    try {
      const formData = new FormData();
      formData.append('audio', fichierAudio);
      if (fichierCover) {
        formData.append('cover', fichierCover);
      }
      formData.append('title', titre);
      formData.append('artistName', artiste);

      // Simuler la progression (à adapter avec votre API)
      const interval = setInterval(() => {
        setProgression(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await musiquesService.uploadMusique(formData);
      
      clearInterval(interval);
      setProgression(100);
      setSucces(true);

      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFichierAudio(null);
        setFichierCover(null);
        setTitre('');
        setArtiste('');
        setProgression(0);
        setSucces(false);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setErreur('Erreur lors de l\'upload. Veuillez réessayer.');
    } finally {
      setEnCours(false);
    }
  };

  const retirerFichier = (type) => {
    if (type === 'audio') {
      setFichierAudio(null);
    } else {
      setFichierCover(null);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <Upload size={48} className="upload-icon-header" />
          <h1>Uploader une musique</h1>
          <p>Partagez votre musique avec la communauté Wavedrop</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {erreur && (
            <div className="upload-erreur">
              {erreur}
            </div>
          )}

          {succes && (
            <div className="upload-succes">
              <CheckCircle size={20} />
              <span>Musique uploadée avec succès !</span>
            </div>
          )}

          {/* Upload fichier audio */}
          <div className="form-section">
            <label className="section-title">
              <Music size={20} />
              Fichier audio *
            </label>
            
            {!fichierAudio ? (
              <label className="upload-zone">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFichierAudio}
                  className="file-input"
                  disabled={enCours}
                />
                <Upload size={40} />
                <p>Cliquez ou glissez votre fichier audio</p>
                <span>MP3, WAV, OGG (max 50MB)</span>
              </label>
            ) : (
              <div className="fichier-selectionne">
                <Music size={24} />
                <div className="fichier-info">
                  <p className="fichier-nom">{fichierAudio.name}</p>
                  <p className="fichier-taille">
                    {(fichierAudio.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!enCours && (
                  <button
                    type="button"
                    onClick={() => retirerFichier('audio')}
                    className="btn-retirer-fichier"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Upload cover (optionnel) */}
          <div className="form-section">
            <label className="section-title">
              Image de couverture (optionnel)
            </label>
            
            {!fichierCover ? (
              <label className="upload-zone upload-zone-small">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFichierCover}
                  className="file-input"
                  disabled={enCours}
                />
                <Upload size={30} />
                <p>Ajouter une image</p>
                <span>JPG, PNG (max 5MB)</span>
              </label>
            ) : (
              <div className="fichier-selectionne">
                <img 
                  src={URL.createObjectURL(fichierCover)} 
                  alt="Cover preview" 
                  className="cover-preview"
                />
                <div className="fichier-info">
                  <p className="fichier-nom">{fichierCover.name}</p>
                  <p className="fichier-taille">
                    {(fichierCover.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!enCours && (
                  <button
                    type="button"
                    onClick={() => retirerFichier('cover')}
                    className="btn-retirer-fichier"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="form-section">
            <label className="section-title">Informations de la musique</label>
            
            <div className="form-group">
              <label htmlFor="titre">Titre *</label>
              <input
                type="text"
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Nom de la musique"
                disabled={enCours}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="artiste">Artiste *</label>
              <input
                type="text"
                id="artiste"
                value={artiste}
                onChange={(e) => setArtiste(e.target.value)}
                placeholder="Nom de l'artiste"
                disabled={enCours}
                required
              />
            </div>
          </div>

          {/* Barre de progression */}
          {enCours && (
            <div className="upload-progression">
              <div className="progression-info">
                <span>Upload en cours...</span>
                <span>{progression}%</span>
              </div>
              <div className="progression-barre">
                <div 
                  className="progression-remplissage" 
                  style={{ width: `${progression}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Bouton submit */}
          <button 
            type="submit" 
            className="btn-upload"
            disabled={enCours || !fichierAudio || !titre || !artiste}
          >
            {enCours ? 'Upload en cours...' : 'Uploader la musique'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMusique;
