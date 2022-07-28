const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const userSchema =  new Schema({
userName:{
    type: String,
    required :["Please enter a username ",true],
}

},
{
    timestamps: true
})


module.exports = mongoose.Schema("User", userSchema)