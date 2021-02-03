
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

const bodyParser = require('body-parser');

const productsRoutes = require('./routes/products')
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

//MongoDB configuration of REST API
const dbConfig = require('./api/config/dbconfig');
//MongoDB configuration of CRUD

//const dbConfigCRUD = require('./api/config/database.config')
//require global mongoose
const mongoose = require('mongoose');



mongoose.Promise = global.Promise;
// MongoDB connection

                    // mongoose.connect('mongodb+srv://node-rest:<node-rest>@node-rest-shop.b6c66.mongodb.net/<node-rest-shop>?retryWrites=true&w=majority',
                    // {  useNewUrlParser: true }
                    // )
//connecting the database REST_api 
mongoose.connect(dbConfig.url,{
    useNewUrlParser : true
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
app.use(morgan('dev'));
app.use('./uploads', express.static(path.join(__dirname, './uploads')));

            // bodyparser 
//parse requests of content -type-application/json
app.use(bodyParser.json());

//  parse requests of content-type-application
app.use(express.urlencoded({extended:false}));
app.use(express.json());

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
app.use('/products' , productsRoutes);
app.use('/orders' , ordersRoutes);
app.use('/user', userRoutes);

//require Notes routes
require('../CRUD&REST-api/api/routes/note.routes')(app);

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