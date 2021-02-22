const {user} = require("./userSchema");
const path = require('path')
module.exports = {
    addUserValidation : async (req,res,next)=>{

        const value = await user.validate(req.body);
        if (value.error) {
            res.json({
                success: 0,
                message: value.error.details[0].message
            })
        }else{
            console.log(" VALIDATION PASSED ")
            next();
        }
    }
}