//dotenv permet de sécuriser les données sensibles sensibles au sein de votre application
require("dotenv").config();
// appel de express 
const express = require('express');
// créaion de l'application express
const app = express();
//importation des routes (sauces et users)
const saucesRoutes = require("./routes/sauce_routes");
const userRoutes = require("./routes/user_routes");
// on importe path, donne accés au chemin du système de fichiers
const path = require('path');

// importation de Helmet, une collection de fonctions middleware qui définissent des en-têtes HTTP liés à la sécurité
const helmet = require('helmet');
//middleware pour empécher les attaques par injections
const mongoSanitize = require('express-mongo-sanitize');



//on importe mangoose
const mongoose = require('mongoose');
//connection a mongoDB avec mdp et identifiant
// le .env qui renvoit a des données masquées dans le fichier .env
mongoose.connect(
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.DB_CLUSTER +
  "/" +
  process.env.DB_NAME +
  "?retryWrites=true&w=majority",

  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// interception de la requète pour la mettre au bon format
app.use(express.json());
// on spécifie quelles ressources peuvent être demandées de manière légitime
app.use((req, res, next) => {
   // origine, droit d'accéder c'est tout le monde '*'
    res.setHeader('Access-Control-Allow-Origin', '*');
    // headers, ce sont les headers acceptés 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // methods,  ce sont les méthodes acceptés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
// utilisation de helmet
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// utilisation de mongosanitize
app.use(mongoSanitize());

// on utilise le router de saucesRoutes
app.use("/api/sauces", saucesRoutes);
// on utilise le router de userRoutes
app.use("/api/auth", userRoutes);
// pour cette route utiliser le fichier statique
app.use("/images", express.static(path.join(__dirname, "images")));


//exportation de la constante pour pouvoir y accéder depuis d'autres fichier
module.exports = app;