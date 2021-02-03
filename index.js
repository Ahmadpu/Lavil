const exp = require('express')
const bp = require('body-parser')
const cors = require('cors')
const {connect} = require('mongoose')
const {success,error} = require('consola')

const path=require('path')

//Bring in the App constants
const {DB,PORT} = require('./config')
//Initialize the Application
const app = exp()
//use middlewares
app.use(cors())
app.use(bp.json())
// middleware for uploading image
app.use('uploads/',exp.static(path.join(__dirname+'./uploads')))
//use router middleware
app.use('/api/users',require('./routes/users'))

//connect the database
const startApp=async ()=>{
    try{await connect(DB,{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useNewUrlParser:true}
    
);
success({message : `DataBase has connection on ${DB}`,badge:true})

app.listen(PORT,(err)=>
    success({message : `server is running on port${PORT}`,badge:true})
);
}
catch(err){
    error({
        message:`Unable to connect to Database${error}`,
        badge : true
        })
    startApp();
    }
};

startApp();