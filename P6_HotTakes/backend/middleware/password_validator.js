const passwordSchema = require('../models/password_model');

// on observe la correspondance entre le mdp demandé et le shéma
module.exports = (req, res, next) => {
    //si il n'y a pas de correspondance renvoie de l liste
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({error : 'Password must have : '
            + passwordSchema.validate(req.body.password, {list : true})
        });
//       
    } else {
        next();
    }
};