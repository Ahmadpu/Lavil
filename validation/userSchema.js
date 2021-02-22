
const joi = require('@hapi/joi')

const Schema = {
    user: joi.object({
    
    username: joi.string().lowercase().max(25).required(),
    name: joi.string().max(22).required(),
    password: joi.string().pattern(new RegExp("^[a-zA-z0-9]{3,30}$")).required(),
    email: joi.string().email().required(),
    
    })
}

module.exports = Schema;