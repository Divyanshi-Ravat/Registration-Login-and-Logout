const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userschema = new schema({
        email: {
            type : String,
            required: true
        },
        password: {
            type : String,
            required : true
        }
})

module.exports = mongoose.model('loginuser',userschema );