const Joi = require('@hapi/joi')
const joi = require('@hapi/joi')

const Schema = {
    user: joi.object({
    first_name : joi.string().max(20).required(),
    last_name: joi.string().max(25).required(),
    gender: joi.string().valid('male','female','other').required(),
    password: joi.string().pattern(new RegExp("^[a-zA-z0-9]{3,30}$")).required(),
    email: joi.string().email().required(),
    number: joi.number().integer().min(1000000000).message("number is less").max(9999999999).message("number is above than limit").required(),
    image: joi.string()
    })
}

module.exports = Schema;