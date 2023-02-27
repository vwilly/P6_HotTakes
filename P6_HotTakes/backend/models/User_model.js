// mangoose pour créer son shéma
const mongoose = require('mongoose');
//unique validator pour s'assurer qu'une personne se connecte a la fois
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// plugin pour ne permettre la connection qu'a un utilisateur a la fois
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);