import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Inscription = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const { inscription } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    // Validation
    if (motDePasse !== confirmMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }

    if (motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setChargement(true);

    try {
      await inscription(email, motDePasse);
      navigate('/');
    } catch (error) {
      setErreur('Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Wavedrop</h1>
          <h2>Inscription</h2>
          <p>Rejoignez la vague musicale</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {erreur && <div className="auth-erreur">{erreur}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmMotDePasse}
              onChange={(e) => setConfirmMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={chargement}>
            {chargement ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà un compte ?{' '}
            <a href="/connexion">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;