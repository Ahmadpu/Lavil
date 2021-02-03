
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_getall = (req,res,next) => {
    Order.find()
    .populate('product')
    .exec()
    .then(docs=> {
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc =>{
                return{
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type: 'GET',
                        url : 'http://localhost:3000/orders/'+doc._id
                    }
                }
            }) 
        });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });
}
exports.orders_getId = (req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order=>{
        if (!order){
            return res.status(404).json({
                message : 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request : {
                type : 'GET',
                url : "http://localhost:3000/orders"
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    })
}
exports.order_delete = (req,res,next) => {
    Order.remove({_id : req.params.orderid})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Order Deleted',
            msn : 'rrr',
            messageResult: result,
            request : {
                type : 'POST',url : "http://localhost:3000/orders",
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}
exports.orders_postId = (req,res,next) => {
    const id = req.params.postid;
    if(id === 'postid'){
        res.status(200).json({
            message : 'postid is requested'
        })
    }
}
exports.orders_post = (req,res,next) => {
        Product.findById(req.body.productId)
        .then(product=>{
            if(!product){
                return res.status(404).json({
                    message : 'Product not found'
                });
            }
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                quantity : req.body.quantity,
                product : req.body.product
            });
            return order.save() 
        }) 
           .then(result => {
                console.log(result);
                res.status(201).json({
                    message : "Order Stored",
                    creatededOrder :{
                        _id : result._id,
                        product : result.product,
                        quantity : result.quantity,
                    } ,
                    request : {
                        type:'GET',
                        url : "http://localhost:3000/orders/"+result._id
                    }
                });
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json({
                    error : err
                });
            })
        }