const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    products:[
        {
            productid:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
               // required:true
            },
            name:{
                type:String,
                // required:true,
                // ref:'Product'
            },
            image:{
                type:String,
                // required:true,
                // ref:'Product'
            },


        }
    ],
      
    totalprice:{
        type:Number,

    },
    // name:{
    //     type:String,
    //     required:true,
    //     ref:'Product'
    // },
    
});
// cartSchema.set('toJSON', { virtuals: true });
// cartSchema.set('toObject', { virtuals: true });

// cartSchema.virtual('totalprice').get(function(){
//     type:"string";
//     let total = 0;
//     for(let i=0;i<this.products.length;i++){
//         total = total + this.products[i].price * this.products[i].quantity;
//     }
//     return total;
// })




module.exports = mongoose.model('Cart', cartSchema);