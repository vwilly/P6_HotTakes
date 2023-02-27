// pour créer le routeur on a besoin d'express
const express = require('express');
// on créer un routeur avec la méthode Router() d'expres
const router = express.Router();
//importation des interactions sauces
const saucesCtrl = require("../controllers/sauces_controllers");
//middleware d'autentification pour securiser les interractions
const auth = require('../middleware/auth');
// pour l'ajout d'image
const multer = require('../middleware/multer_config');


// création des routes
router.post("/", auth, multer, saucesCtrl.createSauce);

router.post("/:id/like",auth, saucesCtrl.likeSauce);

router.put("/:id", auth, multer, saucesCtrl.modifySauce);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

router.get("/", auth, saucesCtrl.getAllSauce);

router.get("/:id", auth, saucesCtrl.getOneSauce);

//exportation pour app
module.exports = router;