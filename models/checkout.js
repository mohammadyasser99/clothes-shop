const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const checkoutSchema = new Schema({



    userid:{
        type:Schema.Types.ObjectId,
          ref:'User',
        required:true,
         unique:true,


        
    },
cart:{
    type:Object,
    required:true
},


// totalprice:{
//         type:Number,

//     }
});



module.exports = mongoose.model('Checkout',checkoutSchema);

