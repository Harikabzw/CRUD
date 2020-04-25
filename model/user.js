const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: [true,"Username should be unique"], required: [true,"Username is reuired"] },
    password: { type: String, required: [true, 'Your username cannot be blank.']},
    
    email: { type: String, required: true },
    DOB: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },  
    role:{type:String,required: true},
    attempts:{type:Number,default:0}
    
});


schema.prependOnceListener("save", function (next) {
console.log('this',this)
})
module.exports = mongoose.model('User', schema);