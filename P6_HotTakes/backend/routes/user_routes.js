
const express = require("express");
const router = express.Router();

// importation des fonctions écrites dans user_controllers
const userCtrl = require("../controllers/user_controllers");
//importation du limiteur de tentative de connection
const limiter = require('../middleware/password_limiter');
//importation du shéma de mdp
const passwordValidator = require('../middleware/password_validator');

// création des routes
router.post("/signup", passwordValidator, userCtrl.signup);

router.post("/login", limiter, userCtrl.login);


module.exports = router;
