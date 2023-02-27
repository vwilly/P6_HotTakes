// appel de model user
const User = require("../models/User_model");
// appel de jsonwbtoken
const jwt = require('jsonwebtoken');
// appel de bcrypt (pour les mdp)
const bcrypt = require("bcrypt");
// appel le modèle de mdp possible
var passwordSchema = require("../models/Password_model");
// appel de la fonction isEmail de validator avec npm install validator pour gérer la validation de l'email
const validator = require("validator");
//masque l'email grace a maskdata
const MaskData = require("maskdata");
const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 5,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};

// enregistrement de nouveaux utilisateurs grace a signup
exports.signup = (req, res, next) => {

    const validePassword = passwordSchema.validate(req.body.password);
    const valideEmail = validator.isEmail(req.body.email);
    // si l'email et le mot de passe sont bon
    if (valideEmail === true && validePassword === true) {
        // on crpte le mdp, hashé 10x
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // créer un modèle hashé
            const user = new User({
            email:  MaskData.maskEmail2(req.body.email,emailMask2Options),
            password: hash
            });
            // sauvegrde du nouvel user
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
        } else {
            console.log("Email ou mot de passe non conforme au standart ");
        }
  };

 // tentative d'identificaton avec un compte existant
 exports.login = (req, res, next) => {
    //Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
    User.findOne({ email:  MaskData.maskEmail2(req.body.email,emailMask2Options) })
        .then(user => {
            // sile mail nest pas trouvé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // si le mail est trouvé utilisation de bycript pour compaer le mdp
            bcrypt.compare(req.body.password, user.password)
                // si le mdp n'est pas valide
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // si c'est ok création de status 200 et renvoi d'un objet json
                    res.status(200).json({
                        // renvoi de l'id
                        userId: user._id,
                        // renvoi d'un token encodé
                        token: jwt.sign(
                            // le token aura le user id
                            { userId: user._id },
                            // clef secrète
                            process.env.JWT_TOKEN,
                            // durée de vie
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };


 