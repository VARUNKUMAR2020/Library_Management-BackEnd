const mongo = require("mongoose");

const user = new mongo.Schema({
  name:String,
  email:String,
  password:String
})

const User = mongo.model("User",user);

module.exports = User;