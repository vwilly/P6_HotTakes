//utilisation de express-rate-limit et la fonction rateLimit pour protéger les mdp des piratages par force brute
//https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 10, // limitation a 10 tentatives pour 5 minutes
})
//
module.exports = rateLimit(limiter); 