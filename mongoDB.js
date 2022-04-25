const databaseURL = require(__dirname + "/databaseURL.js")
const mongoose = require("mongoose");
mongoose.connect(databaseURL);

const firefoxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is compulsory"],
  },
  email: {
    type: String,
    required: [true, "email is compulsory"],
  },
  password: {
    type: String,
    required: [true, "password is compulsory"],
  },
});

const FirefoxUser = mongoose.model("FirefoxUser", firefoxSchema);

const blacklistSchema = new mongoose.Schema({
  faculty: {
    type: String,
    required: [true, "name is compulsory"]
  },
  reason: [String]
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

const nameListSchema = new mongoose.Schema({
  Name: String
})

const Namelist = mongoose.model("Namelist", nameListSchema);

module.exports.Anurag = new FirefoxUser({
  name: "Anurag Kumar",
  email: "anuragkumar2020@vitbhopal.ac.in",
  password: "anurag123",
});

module.exports.FirefoxUser = FirefoxUser;
module.exports.Blacklist = Blacklist;
module.exports.Namelist = Namelist;