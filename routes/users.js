const router = require('express').Router()
const {userRegistered,userlogin,editUser,forgetpassword} = require('../utils/Auth');
//Multer module requirimg for uploading file
const multer =require('multer')
const path = require('path')

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

//registration user route
router.post('/register-user',uploads.single('Image'),async(req,res)=>{
    console.log(req.file);
    console.log(req.file.path);
    await userRegistered(req.body,req.file.path,"client",res);
});
//User edit & Updated Routes
router.put('/edit-user/:Id',uploads.single('Image'),async(req,res)=>{
    await editUser(req,req.file.path,"client",res);
});
//User Forget Routes
router.put('/forget',async (req,res)=>{
    console.log("new password:",req.body);
    if(req.body){
    await forgetpassword(req,"client",res)
}else{
    res.status(404).json({
        message:"Body is empty"
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
    await userlogin(req.body,"client",res);
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