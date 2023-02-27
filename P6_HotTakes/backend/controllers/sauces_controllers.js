// on appelle le modèle de sauce
const Sauce = require("../models/Sauce_model");
// on appelle fs (filesystem) qui permet d'aller dans les fichiers
const fs = require('fs');

//NOUVELLE SAUCE

     exports.createSauce = (req, res, next) => {
        // on extrait le sauce de la requete via le parse
  // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        //on ne fait pas confiance aux info visiteur  donc on utilise le token plutot que l'userId
        delete sauceObject._userId;
        // déclaration de sauce qui sera une nouvelle instance du modele Sauce
        const sauce = new Sauce({
            // raccourci spread pour récupérer toutes les données de req.body
            ...sauceObject, 
            //vérification id
            userId: req.auth.userId,
            // l'image url correspont au protocole avec :// puis la valeur du port (host) dans le dossier images 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            //initialisation de parametres
            likes: 0, //initialize compte de like
		    dislikes: 0,
		    usersLiked: [],
		    usersDisliked: [],
        });
          // enregistre l'objet dans la base de donnée
        sauce.save()
        
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
     };  

//MODIF SAUCE

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    // l'id de la sauce est l'id inscrit dans l'url
    Sauce.findOne({_id: req.params.id})
        // si la sauce existe
        .then((sauce) => {
            // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                // updateOne pour mettre a jour la sauce
                //Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par lasauce passé comme second argument.
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//SUPPRIMER SAUCE
    
exports.deleteSauce = (req, res, next) => {
    //  on cherche la sauce a supprimer
        Sauce.findOne({ _id: req.params.id})
            .then(sauce => {
                // on vérifie que l'id utilisateur est bien celle du créateur de la sauce
                if (sauce.userId != req.auth.userId) {
                    res.status(401).json({message: 'Not authorized'});
                } else {
                    // Nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier.
                    const filename = sauce.imageUrl.split('/images/')[1];
                    //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé.
                    fs.unlink(`images/${filename}`, () => {
                        //Dans le callback, nous implémentons la logique d'origine en supprimant la sauce de la base de données.
                        Sauce.deleteOne({_id: req.params.id})
                            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
                    });
                }
            })
            .catch( error => {
                res.status(500).json({ error });
            });
}

//LIKE SAUCE

exports.likeSauce = (req, res, next) => {
    let likeValue = req.body.like;
	let userId = req.body.userId;
	let sauceId = req.params.id;
	
	if (likeValue === 1) {
        // like, on push le dislike avec l'id de l'userid
		Sauce.updateOne(
			{ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
			.then(() => res.status(200).json({ message: "like added !" }))
			.catch((error) => res.status(400).json({ error }));
	}
	if (likeValue === -1) {
		// dislike, on push le dislike avec l'id de l'userid
		Sauce.updateOne(
			{ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
			.then(() => res.status(200).json({ message: "Dislike added !" }))
			.catch((error) => res.status(400).json({ error }));
	}
	if (likeValue === 0) {
		// suppression de like/dislike
		Sauce.findOne({ _id: sauceId })
			.then((sauce) => {
				// suppression like
				if (sauce.usersLiked.includes(userId)) {
					Sauce.updateOne(
						{ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
						.then(() =>	res.status(200).json({ message: "Like removed !" }))
						.catch((error) => res.status(400).json({ error }));
				}
				// suppression dislike
				if (sauce.usersDisliked.includes(userId)) { 
					Sauce.updateOne(
						{ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
						.then(() => res.status(200).json({ message: "Dislike removed !" }))
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(404).json({ error }));
	}
};

//TABLEAU DES SAUCES

exports.getAllSauce = (req, res, next) => {
    // on veut la liste complète de Sauce alors on utilise find() sans argument
         Sauce.find()
         // status 200 OK et l'élément en json
          .then(sauces => res.status(200).json(sauces))
        // si erreur envoit un status 404 Not Found et l'erreur en json
          .catch(error => res.status(400).json({ error }));
      }

exports.getOneSauce = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
        Sauce.findOne({ _id: req.params.id })
        // status 200 OK et l'élément en json
          .then(sauces => res.status(200).json(sauces))
        // si erreur envoit un status 404 Not Found et l'erreur en json
          .catch(error => res.status(404).json({ error }));
}
