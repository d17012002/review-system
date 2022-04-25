const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require(__dirname + "/mongoDB.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  db.FirefoxUser.find(function (err, firefoxusers) {
    if (firefoxusers.length === 0) {
      db.Anurag.save();
      console.log("Default users added");
    }
    if (err) {
      console.log(err);
    } else {
      res.render("home");
    }
  });
});

app.get("/signin", function (req, res) {
  res.render("signin");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/error", function (req, res) {
  res.render("error");
});

app.get("/faculty", function (req, res) {
  db.Blacklist.find(function (err, list) {
    if (err) {
      console.log(err);
    } else {
      let facultyCount = 0;
      for (var i = 0; i < list.length; i++) {
        facultyCount++;
      }
      res.render("faculty", { key: list, num: facultyCount });
    }
  });
});

app.post("/error", function (req, res) {
  res.redirect("/signin");
});

app.post("/", function (req, res) {
  if (req.body.btn1 === "signin") {
    res.redirect("/signin");
  }
  if (req.body.btn2 === "signup") {
    res.redirect("/signup");
  }
});

app.post("/signin", function (req, res) {
  var Email = req.body.ename;
  var Pass = req.body.psw;
  db.FirefoxUser.find({ email: Email }, function (err, firefoxusers) {
    if (err) {
      console.log(err);
    }
    if (!firefoxusers.length) {
      res.redirect("/error");
    } else {
      firefoxusers.forEach(function (firefoxuser) {
        if (Pass == firefoxuser.password) {
          res.redirect("/main");
        } else {
          res.redirect("/error");
        }
      });
    }
  });
});

app.post("/signup", function (req, res) {
  var NAME = req.body.name;
  var EMAIL = req.body.email;
  var PASSWORD = req.body.psw;
  const newFirefoxUser = new db.FirefoxUser({
    name: NAME,
    email: EMAIL,
    password: PASSWORD,
  });
  newFirefoxUser.save();
  res.redirect("/main");
});

app.post("/main", function (req, res) {

  const Faculty = req.body.fname;
  const Reason = req.body.reason;

  

  if (req.body.button1 === "addToList") {

    if(Faculty === "Select one faculty..."){
      res.redirect("/main");
    }else{
      db.Blacklist.find({ faculty: Faculty }, function (err, lists) {
        if (!lists.length) {
          const newBlacklist = new db.Blacklist({
            faculty: Faculty,
            reason: [Reason]
          });
          newBlacklist.save();
          res.redirect("/main");
          console.log("New faculty added in the list.")
  
        } else {
          db.Blacklist.updateOne(
            { faculty: Faculty },
            {
              $push: { reason: Reason }
            },
            function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("New review added in existing faculty.")
              }
            }
          )
          res.redirect("/main");
        }
      });
    }
  }

  if (req.body.button2 === "blacklist") {
    res.redirect("/faculty");
  }
});

app.get("/4m/:id", function (req, res) {
  const owners = req.params.id;
  db.FirefoxUser.find(function (err, firefoxusers) {
    if (err) {
      console.log(err);
    } else {
      let userCount = 0;
      for (var i = 0; i < firefoxusers.length; i++) {
        userCount++;
      }
      res.render(owners, { key: firefoxusers, num: userCount });
    }
  });
});

app.get("/main", function(req, res){
  
  db.Namelist.find(function (err, names){
    if(err){
      console.log(err)
    }else{
      console.log(names);
      res.render("main", { key: names });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at: http://localhost:3000/");
});
