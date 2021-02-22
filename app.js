
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multer = require('multer')
const formData = require('form-data')
const expressFormData = require('express-form-data')
const os = require("os");
//Routes declaration
const productsRoutes = require('./routes/products')
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const usersRoutes = require('./routes/users');

//MongoDB configuration of REST API
const dbConfig = require('./config/app');
//MongoDB configuration of CRUD
//const dbConfigCRUD = require('./api/config/database.config')
//require global mongoose
const mongoose = require('mongoose');
// const { json } = require('body-parser');



mongoose.Promise = global.Promise;
// MongoDB connection

                    // mongoose.connect('mongodb+srv://node-rest:<node-rest>@node-rest-shop.b6c66.mongodb.net/<node-rest-shop>?retryWrites=true&w=majority',
                    // {  useNewUrlParser: true }
                    // )
//connecting the database REST_api 
mongoose.connect(dbConfig.DB,{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Db connected successfully");
}).catch(err=>{
        console.log("db not connected due to some error",err);
        process.exit();
})
// connecting the database CRUD
// mongoose.connect(dbConfigCRUD.url,{
//     useNewUrlParser : true
// }).then(()=>{
//     console.log('Successfully connected to the database');
// }).catch(err=>{
//     console.log('Could not connect to the database ...',err);
//     process.exit();
// })


//Morgan third-party middleware
// app.use(morgan('dev'));
app.use('./uploads', express.static(path.join(__dirname, './uploads')));

            // bodyparser 
//parse requests of content -type-application/json
app.use(bodyParser.json());



//  parse requests of content-type-application
app.use(express.json());
app.use(express.urlencoded({extended:false}));//true
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };
app.use(expressFormData.parse(options));

app.use(expressValidator());

// headers handling cors error.

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested with, Content-Type, Accept, Authorization',
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})

//Routes which handles requests
app.get('/' , (req , res)=>{
return res.json({note:"Welcome to Lavil!"})
});
var upload = multer()

app.put('/forget', (req,res)=>{
    console.log("new password:",JSON.stringify(req.body));
    return res.json({note:"Welcome to Lavil!"})
});
app.use('/products' , productsRoutes);
app.use('/orders' , ordersRoutes);
app.use('/user', userRoutes);
app.use('/users',usersRoutes);
//require Notes routes
require('./routes/note.routes')(app);

// Handling Error
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
app.use((error,req,res,next) => {
    res.status(error.status || 500).json({
        error: error.message
    });
});
module.exports = app;