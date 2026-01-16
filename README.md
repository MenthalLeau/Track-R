# Track-R

Track-R est une Progressive Web App (PWA) moderne conçue pour les passionnés de jeux vidéo. Elle permet de suivre sa bibliothèque de jeux, de gérer sa progression (succès, temps de jeu) et de consulter les profils d'autres joueurs, le tout synchronisé en temps réel via Supabase.

## Installation

### Prérequis
- **Node.js** version 18 ou supérieure
- **npm** (inclus avec Node.js) ou **yarn**
- Un compte **Supabase** pour la base de données et l'authentification

### Lancement en local

1. **Cloner le projet**

   Récupérez le code source sur votre machine :
   ```bash
   git clone [https://github.com/votre-utilisateur/track-r.git](https://github.com/votre-utilisateur/track-r.git)
   cd track-r
   ```

3. **Installer les dépendances**

   Installez les paquets nécessaires au fonctionnement de l'application :
   ```Bash
   npm install
   ```

4. **Configurer les variables d'environnement**

   Créez un fichier .env.local à la racine du projet et ajoutez-y vos clés Supabase (disponibles dans Project Settings > API) :
    ```Extrait de code
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
    ```

5. **Lancer le serveur de développement**

   Démarrez l'application en mode local :
   ```Bash
   npm run dev
   ```
   L'application sera accessible à l'adresse : http://localhost:5173

### Structure du projet

Voici l'organisation des fichiers sources de l'application :
```
src/
├── components/          # Composants réutilisables
│   ├── layout/          # Composants de structure (Sidebar, TopBar)
│   └── ...              # Autres composants UI (boutons, cartes...)
├── context/             # Contextes React (AuthContext pour la gestion utilisateur)
├── http/                # Fonctions d'appel API vers Supabase (game.ts, user.ts...)
├── lib/                 # Configuration des clients externes (supabaseClient.ts)
├── pages/               # Pages principales de l'application
│   ├── Dashboard.tsx    # Tableau de bord utilisateur
│   ├── Games.tsx        # Bibliothèque de jeux
│   ├── Players.tsx      # Liste et recherche des joueurs
│   ├── LoginPage.tsx    # Page de connexion
│   └── RegisterPage.tsx # Page d'inscription
├── utils/               # Utilitaires et constantes
│   └── theme.ts         # Configuration des thèmes (Dark/Light) et tokens de design
├── App.tsx              # Point d'entrée et configuration du routing
└── main.tsx             # Montage de l'application React
```

### Auteur(s)
**artaLeau**

Composée de Christian RZESZUTEK et Erwann QUEVIT
