const router = require('express').Router()
const {userRegistered,userlogin,editUser,forgetpassword} = require('../utils/Auth');
const {addUserValidation} = require('../validation/userValidation')
//Multer module requirimg for uploading file
const multer =require('multer')
const path = require('path')
const {body,validationResult} = require('express-validator/check');
    function validate(method) {
        switch(method){
            case 'userRegistered':{
                return [
                    body('username','Username doesnot exists').exists(),
                    body('email','Invalid Email').exists().isEmail(),
                    body('name','Invalid Email').optional(),
                    body('password','password must be atleast 8 characters').exists().isLength({min:8,max:15}),
                    body('Image','please upload your Image').exists()

                ]
            }
        }
    }

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null,  Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png')
     {cb(null,true);}
    //reject a file
    else{cb(null,true);}
 };
 var uploads = multer({storage:storage,filefilter:fileFilter})
const Validation = (req,res,next)=>{
    if(!req.body){
        res.status(404)
    }else if(!req.file.path)
    {
        res.status(400).json({
            message:"not uploaded the pic"
        })
        return
    }else{
        next();
    }
}
//registration user route
router.post('/register-user',uploads.single('Image'),validate('userRegistered'),async(req,res)=>{
    
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(422).json({errors:errors.array() });
        return
    }
    console.log(req.body);
    // await userRegistered(req.body,req.file.path,"client",res);
});
//User edit & Updated Routes
router.put('/edit-user/:Id',uploads.single('Image'),async(req,res)=>{
    await editUser(req,req.file.path,"client",res);
});
//User Forget Routes
router.put('/forget',async (req,res)=>{
    console.log("new password:",req.body);
    if(req.body){
        console.log('object Missing!');
    await forgetpassword(req,"client",res)
}
if(!req.body && req.body === undefined){
    console.log('Empty in body!')
    res.status(404).json({
        message:"Body is empty!"
    })
}
});
//registration admin route
router.post('/register-tailor',uploads.single('Image'),async(req,res)=>{
    await userRegistered(req.body,req.file.path,"tailor",res);
    console.log(req.file);
});
//registration superAdmin route
router.post('/register-superadmin',async(req,res)=>{
    await userRegistered(req.body, req.file.path, "admin", res);
});
//login user route
router.post('/login-user',async(req,res)=>{
    console.log(req.body);
    // await userlogin(req.body,"client",res);
});
//login admin route
router.post('/login-tailor',async(req,res)=>{
    await userlogin(req.body,"tailor",res);
});
//login superAdmin route
router.post('/login-superadmin',async(req,res)=>{
    await userlogin(req.body,"admin",res);
});
//profileuser route
router.get( '/profile-user',async()=>{});
//protected user route
router.post('/protected-user',async()=>{});
//protected admin route
router.post('/protected-admin',async()=>{});
//protected superAdmin route
router.post('/protected-superadmin',async()=>{});

module.exports = router;