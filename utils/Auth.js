const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const {SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const path = require('path')
const mailgun = require('mailgun-js');
const DOMAIN = 'sandboxf26a5c38b52e4da68cd059e6c4d2daba.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY,domain:DOMAIN});

const userRegistered = async(userDets,Image,role,res) =>
{
   
    //Validate the username
    try{
        let userNameNotTaken = await validateUserName(userDets.username) ;
        
        if(!userNameNotTaken){
            res.status('400').json({
                message: "Username already taken",
                success:false
            });
        }
        //Validate the email
        let emailNotRegistered = await validateEmail(userDets.email);
        if(!emailNotRegistered){
            res.status('400').json({
                message: "Email already taken"
                ,success:false
            });
        }
        //Get the hashed password
        const password = await bcrypt.hash(userDets.password,12);
        console.log(password);
        // Create new User    
        const newUser = new User({
            ... userDets,
            password ,
            role,
            Image
        });
        
        console.log(newUser);  
        newUser.save();
        return res.status(200).json({
            message:"User has been registered successfully,Please Login!",
            success:true
        });
    }catch(err){
        //Implement the blogger
        console.log(err);
        return res.status(500).json({
            message:"Unable to register your account!"
            ,success:false
        });
    }
};
// function for user login
const userlogin = async(userCreds,role,res)=>{
    let {username,password} = userCreds ;
    //Find User in the database
    const user =await User.findOne({username});
    console.log(user.role,"!Sign in");
    if(!username){
        return res.status(404).json({
            message:"User has not been found",
            success : false
        });
    }
    //Check that the user is came from the right portal
    if(user.role !== role){
        console.log(role);
        console.log("saved user role is: ",user.role);
        return res.status(404).json({
            message:"User is not login from right portal",
            success : false
        })
    }
    //if it is from the right portal and now 
    //check the password of it using bcrypt 
    const ismatch = bcrypt.compare(password,user.password);
    if(ismatch){
        //if it is matched with db passsword 
        //then sign the token and assign it to user
        let token = jwt.sign(
            {
                user_id : user._id,
                role : user.role,
                username:user.username,
                email:user.email
            },SECRET,{expiresIn:"7days"}
        );
        let result = {
            username : user.username,
            email: user.email,
            role: user.role,
            token:`Bearer${token}`,
            expiresIn : 168
        };
        return res.status(200).json({
                ... result,
                message: "Congrats! You are logged in",
                success:true,
        })

    }else{
        return res.status(403).json({
            message:"password Incorrect, UnAuthorized user",
            success : false
        })
    }
}


const validateUserName = async username =>{
   let user= await User.findOne({username})
   return user ? false:true;
}
const validateEmail = async email =>{
let user= await User.findOne({email})
    return user ? false:true;
 }
 module.exports={
     userlogin,
     userRegistered
    }
    exports.forgotPassword = (req,res) => {
        const {email} = req.body;

        User.findOne({email}, (err,user) => {
            if(err || !user){
                return res.status(400).json({error: "User with this email does not existes"});
            }
            const token = jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20m' });
            const data = {
                from : 'noreply@hello.com',
                to:email,
                subject:'Forgot Password Link',
                html:`
                    <h2>Please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`
            };
            return user.updateOne({resetlink: token},(err,success)=>{
                if(err){
                    return res.status(400).json({error: "reset password link error"});
                }else{ }
            })
        })
    }