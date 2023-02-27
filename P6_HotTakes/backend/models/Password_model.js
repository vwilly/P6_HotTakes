//pssword validator est un outil pour permettre d'imposer un certain niveau de complexité au mdp
var passwordValidator = require('password-validator'); 
var passwordSchema = new passwordValidator();

// permet de demander un mdp avec maj symboles entre 8 et 2à charactères ...
passwordSchema
.is().min(8)                                   
.is().max(20)                                  
.has().uppercase(1)                           
.has().lowercase()                              
.has().symbols(1)
.has().digits(1) 
.is().not(/[\]()[{}<>@]/)                              
.has().not().spaces()    
.is().not().oneOf(['Passw0rd', 'Password123']);    

module.exports = passwordSchema;