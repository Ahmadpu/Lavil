const mongoose =require('mongoose')
exports.getErrorMessage=(err)=>{
    let errorObject = {
        code: 500,
        message:""
    }
    if(err.code==11000){
        errorObject.code =404
        errorObject.message = "Duplicate Message,Record already present!"
        return errorObject
    }else if(err.name==="NotFound"){
        errorObject.code=404
        errorObject.message="Record not Found"
        return errorObject
    }else if(err.message instanceof mongoose.Error.CastError){
        errorObject.code=404
        errorObject,message = "Record Not Found"
        return errorObject
    }else if(err instanceof mongoose.CastError){
        errorObject.code = 404
        errorObject.message="Record not Found"
        return errorObject
    }
    else{
        errorObject.code=500
        errorObject.message="Internal Server Error"
        return errorObject
    }
}