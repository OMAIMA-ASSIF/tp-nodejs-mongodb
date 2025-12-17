const express = require('express')
const router = express.Router();

const client = require('../server');

const db = client.db("tp_nodejsMongodb");
const collection = db.collection("products");

router.get('/api/products', async(req, res) => {
    try{

        //logique de base
        let { page = 1, limit = 10, category, search, sort } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);   //pageSize

        //filtrage
        let query = {};
        if (category){
            query.category = category;
        }

        //recherche par titre ou description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        //tri
        let sortOption = {};
        if (sort) {
            const isDescending = sort.startsWith('-');
            const field = isDescending ? sort.substring(1) : sort;
            sortOption[field] = isDescending ? -1 : 1;
        } else {
            sortOption = { _id: 1 }; 
        }
        
        //Pagination 
        const skip = (page -1) * limit;

        //1.les produits pagines
        const products = await collection.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .toArray();
        //2.nombre total de produits
        const totalProducts = await collection.countDocuments(query);
        //reponse format json
        res.json({
            products,
            currentPage: page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit)
        });
    }catch (error){
        console.error("Erreur lors de la récupération des produits :", error);
        res.status(500).json({ message: "Erreur serveur interne"  })
    }

})

router.get('/api/products/stats', async (req, res) => {
    try{
        //Calcul des Statistiques Globales par Catégorie (Stades $group et $project)
        const statsByCategory = await collection.aggregate([
            {
                $groupe: {
                    _id: "category",
                    totalProducts: { $sum:1},
                    averagePrice: { $avg: "$price"},
                    maxPrice: { $max: "$price"},
                    minPrice: { $min: "$price"}
                }
            },
            {
                $sort : {
                    averagePrice: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryName: "$_id",
                    totalProducts: 1,
                    averagePrice: { $round: ["$averagePrice", 2]},
                    maxPrice: 1,
                    minPrice: 1
                }
            }
        ]).toArray();

        // Recherche des Meilleurs/Pires Produits par Notation (Stades $sort et $limit)
        const topLuxuriousProducts = await collection.aggregate([
            {
                $match : {
                    price: { $gt: 500 }
                }
            },
            {
                $sort : {
                    rating: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    price: 1,
                    rating: 1
                }
            }
        ]).toArray();

        //Décomposition par Marque et Prix Total (Stades $unwind et $group - Avancé)
        const brandPriceStats = await collection.aggregate([
            {
                $group: {
                    _id: "$brand",
                    totalStock: {
                        $sum: "$stock"
                    },
                    totalValue : {
                        $sum: { $multiply: ["$price", "$stock"] }
                    }
                }
            }
        ]).toArray();
    }catch(error){
        console.error("Erreur lors de la récupération des statistiques des produits :", error);
        res.status(500).json({ message: "Erreur serveur interne"  })
    }
})

module.exports = router;