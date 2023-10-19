const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    image:{data:Buffer,
        type:String,
        required:true
    },
    description:{
        type:String,
        //required:true
    },
    category:{
        type:String,
        required:true
    },
    size:{
        type:String,
       // required:true
    },
    color:{
        type:String,
        required:true
    },
    stoke:{ 
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    
});
module.exports = mongoose.model('Product', productSchema);