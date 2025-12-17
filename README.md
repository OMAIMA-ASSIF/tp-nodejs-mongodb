# TP Node.js & MongoDB - Catalogue de Produits

Ce projet est une API REST construite avec **Node.js**, **Express** et **MongoDB**. Il permet de gérer un catalogue de produits avec des fonctionnalités avancées de filtrage, recherche, pagination et agrégation de données.

## 🚀 Fonctionnalités

* **Seeding automatique** : Remplissage de la base de données via l'API DummyJSON.
* **API de Produits robuste** :
    * Filtrage par catégorie.
    * Recherche textuelle (Regex) dans le titre et la description.
    * Tri dynamique (ex: `price` pour croissant, `-price` pour décroissant).
    * Pagination complète (calcul du nombre de pages et du total).
* **Analyses de données (Agrégation)** :
    * Statistiques globales par catégorie (prix moyen, min, max).
    * Calcul de la valeur totale du stock par marque.

## 🛠️ Installation et Configuration

1. **Cloner le projet** :
   ```bash
   git clone <URL_DE_TON_DEPOT_GITHUB>
   cd TP_NODEJS_MONGODB
