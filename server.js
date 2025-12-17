require('dotenv').config(); // Charge le fichier .env
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connexion au serveur
    await client.connect();
    
    // Envoi d'un ping pour confirmer la connexion
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}

run().catch(console.dir);


module.exports = client;