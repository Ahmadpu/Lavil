const {user} = require("./userSchema");

module.exports = {
    addUserValidation : async (req,res,next)=>{
        console.log("request of body: ",req.body)
        const value = await user.validate(req.body);
        if (value.error) {
            res.json({
                success: 0,
                message: value.error.details[0].message
            })
        }else{
            next();
        }
    }
}