const router = require('express').Router()
const {userRegistered,userlogin,editUser,forgetpassword} = require('../utils/Auth');
const {addUserValidation} = require('../validation/userValidation')
const formidable = require('formidable');
//Multer module requirimg for uploading file
const multer =require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

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
router.post('/register-user-test',uploads.none(),addUserValidation,Validation,(req,res)=>{
    console.log(req.body);
});
router.post('/register-user',uploads.single('Image'),addUserValidation,Validation,(req,res)=>{
    
     
// const form = formidable({ multiples: true, uploadDir: __dirname }); 
 
// form.parse(req, (err, fields, files) => {
//   console.log('fields:', fields);
//   console.log('files:', files);
// });
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
router.put('/forget', uploads.single('Image'), async (req,res) => {
    console.log("new password:",JSON.stringify(req.body));
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