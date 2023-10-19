const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "admin"],
        required: true
    },
    address: {
        type: String,
         required: true
    },
    phone: {
        type: Number,
         required:true
    },
    country:{
        type: String,
        // required:true

    },
    token: {
        type: String
    },
    
});


module.exports = mongoose.model('User', userSchema);

