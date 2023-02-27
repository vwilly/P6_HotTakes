// on appelle jsonwebtoken pour le middleware d'authentification
const jwt = require('jsonwebtoken');
// on exporte la requete
module.exports = (req, res, next) => {
   try {
    // on utilise le header authorization de la requete, on split le tableau et on récupère l'élément à l'indice 1 
       const token = req.headers.authorization.split(' ')[1];
       // décoder le token en vérifiant qu'il correspond avec sa clef secrète
       const decodedToken = jwt.verify(token,  process.env.JWT_TOKEN);
       // on récupère le user id décodé par le jwt.vérify
       const userId = decodedToken.userId;
       // on rajoute l'objet userId à l'objet requete
       req.auth = {
        // si les userId snt les memes on valide et passe au next() sinon error
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};