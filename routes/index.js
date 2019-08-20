var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");



router.get("/", function(req, res){
    res.render("landing");
})

router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
        
    })
})

router.get("/login", function(req, res) {
    res.render("login", {message:req.flash("error")});
})

router.post("/login",passport.authenticate("local",{
    
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
}), function(req, res){
});

router.get("/logout", function(req, res) {
    req.flash("success", "logged you out");
    req.logout();
    res.redirect("/campgrounds");
})


module.exports = router;