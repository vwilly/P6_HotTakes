const multer = require('multer');
// on définit les images/formats reçu en appartenance de format ( comme un dictionnaire)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
//diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
//la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  filename: (req, file, callback) => {
     // non remplce les espaces par _
    const name = file.originalname.split(' ').join('_');
        // permet de créer une extension de fichiers correspondant au mimetype envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    // on associe     nom associé à une date pour le rendre le plus unique  et un point et son extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image
//single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
module.exports = multer({storage: storage}).single('image');



