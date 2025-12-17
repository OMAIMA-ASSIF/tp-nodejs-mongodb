require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function seedDatabase() {
  try {
    // 1. Se connecter à MongoDB
    await client.connect();
    console.log("Connecté à MongoDB pour le seeding...");
    
    const db = client.db("tp_nodejsMongodb");
    const collection = db.collection("products");

    // 2. Récupérer les données de l'API
    console.log("Récupération des données depuis l'API...");
    const response = await axios.get('https://dummyjson.com/products');
    const products = response.data.products;

    // 3. Supprimer la collection existante (Seed propre)
    await collection.deleteMany({});
    console.log("Collection existante vidée.");

    // 4. Insérer les nouveaux produits
    const result = await collection.insertMany(products);
    console.log(`${result.insertedCount} produits ont été insérés avec succès !`);

  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  } finally {
    // 5. Déconnecter le client
    await client.close();
    console.log("Déconnexion de MongoDB.");
  }
}

seedDatabase();