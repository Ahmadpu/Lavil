
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.usersSignUp = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=> 
    {
        if(user.length >= 1){
            res.status(409).json({
                message : "Email exists"
            });
        }else
        {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err) {
                    return res.status(500).json({
                        error : err
                    });
                }
                else
                {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    user.save().then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message : 'User Created',
                            createdUser:{
                                email : result.email,
                                password : result.password,
                                _id : result._id
                            } 
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error : err
                        });
                    });        
                }
            });
        }
    });
}

    exports.usersLogin = (req,res,next)=>
    {
        console.log(req.body.email)
        User.find({email: req.body.email})
        .exec()
        .then(user=>
        {
            
            console.log("user find",user)
            if(user.length<1){
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            console.log("user[0].password",user[0].password)
            console.log("req.body.password",req.body.password)
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message : "Auth Failed"
                    });
                }   if(result){
                    const token = jwt.sign({
                        email : user[0].email,
                        userId : user[0]._id
                        },
                        process.env.JWT_KEY,
                        {expiresIn : "1h"},
                        );
                    
                    return res.status(200).json({
                        message : "Auth successful",
                        token : token
                    });
                }
                res.status(401).json({
                    message : "Auth Failed"
                });
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                message : "Catch portion",
                error : err
            });
        });
    }
    exports.userDelete = (req,res,next)=>
    {
        User.remove({_id : req.params.userId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message : 'User Deleted',
                result
            });
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        });
    }
exports.userAll = (req,res,next)=>{
    User.find()

} 
exports.forgotpassword = (req,res,next)=>{
    User.find({email:req.body.email}).exec().then(user=>{
        if(user){
            console.log('password to change',req.body.password);
            console.log(user.password,'new password');
            user.password=req.body.password;
            console.log('password changed:',user.password);
        }
    })
}