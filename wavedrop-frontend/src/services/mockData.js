// DONNÉES FICTIVES POUR TESTER SANS BACKEND

export const mockMusiques = [
  {
    id: 1,
    titre: "Bohemian Rhapsody",
    artiste: "Queen",
    duree: 354,
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    urlCover: "https://via.placeholder.com/150/667eea/ffffff?text=Queen"
  },
  {
    id: 2,
    titre: "Imagine",
    artiste: "John Lennon",
    duree: 183,
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    urlCover: "https://via.placeholder.com/150/764ba2/ffffff?text=Lennon"
  },
  {
    id: 3,
    titre: "Billie Jean",
    artiste: "Michael Jackson",
    duree: 294,
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    urlCover: "https://via.placeholder.com/150/f093fb/ffffff?text=MJ"
  },
  {
    id: 4,
    titre: "Hotel California",
    artiste: "Eagles",
    duree: 391,
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    urlCover: "https://via.placeholder.com/150/4facfe/ffffff?text=Eagles"
  },
];

export const mockPlaylists = [
  {
    id: 1,
    nom: "Ma playlist favorite",
    musiques: [mockMusiques[0], mockMusiques[2]]
  },
  {
    id: 2,
    nom: "Rock Classics",
    musiques: [mockMusiques[1], mockMusiques[3]]
  }
];

// Simuler un utilisateur connecté par défaut en mode DEV
let currentUser = {
  id: 1,
  email: 'demo@wavedrop.com',
  dateCreation: new Date().toISOString()
};

// Ajouter un token par défaut
if (!localStorage.getItem('token')) {
  localStorage.setItem('token', 'fake-jwt-token-dev-mode');
}

export const mockAuthService = {
  inscription: async (email, motDePasse) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = { id: 1, email, dateCreation: new Date().toISOString() };
    const token = 'fake-jwt-token-' + Date.now();
    
    currentUser = user;
    localStorage.setItem('token', token);
    
    return { user, token };
  },

  connexion: async (email, motDePasse) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = { id: 1, email, dateCreation: new Date().toISOString() };
    const token = 'fake-jwt-token-' + Date.now();
    
    currentUser = user;
    localStorage.setItem('token', token);
    
    return { user, token };
  },

  deconnexion: () => {
    currentUser = null;
    localStorage.removeItem('token');
  },

  obtenirUtilisateurActuel: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non connecté');
    }
    
    // Retourner l'utilisateur par défaut si pas encore défini
    if (!currentUser) {
      currentUser = {
        id: 1,
        email: 'demo@wavedrop.com',
        dateCreation: new Date().toISOString()
      };
    }
    
    return currentUser;
  }
};

export const mockMusiquesService = {
  obtenirToutesLesMusiques: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMusiques;
  },

  rechercherMusiques: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMusiques.filter(m => 
      m.titre.toLowerCase().includes(query.toLowerCase()) ||
      m.artiste.toLowerCase().includes(query.toLowerCase())
    );
  },

  obtenirPlaylists: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlaylists;
  },

  creerPlaylist: async (nom) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const nouvellePlaylist = {
      id: mockPlaylists.length + 1,
      nom,
      musiques: []
    };
    mockPlaylists.push(nouvellePlaylist);
    return nouvellePlaylist;
  },

  ajouterMusiqueAPlaylist: async (playlistId, musiqueId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  retirerMusiqueDPlaylist: async (playlistId, musiqueId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  uploadMusique: async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nouvelleMusique = {
      id: mockMusiques.length + 1,
      titre: formData.get('titre'),
      artiste: formData.get('artiste'),
      duree: 180,
      urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      urlCover: formData.get('cover') ? URL.createObjectURL(formData.get('cover')) : "https://via.placeholder.com/150/667eea/ffffff?text=New"
    };
    
    mockMusiques.push(nouvelleMusique);
    return nouvelleMusique;
  }
};