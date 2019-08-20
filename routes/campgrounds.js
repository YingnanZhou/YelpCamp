var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");


router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) console.log(err);
        else {
            res.render("campgrounds/index", {campgrounds, campgrounds});
        }
    })
})

router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log(author.username);
    var newCompground = {name: name, price: price, image: image, description: description, author: author};
    
    
    Campground.create(newCompground, function(err, newlyCreated){
        if(err) console.log(err);
        else res.redirect("/campgrounds");
    })
})

router.get("/new", middlewareObj.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) console.log(err);
        else{
            res.render("campgrounds/show",{foundCampground: foundCampground});
        }
    })
})




router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
    
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) res.redirect("/campgrounds");
        res.render("campgrounds/edit", {foundCampground: foundCampground});
    })
    
})

router.put("/:id", middlewareObj.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) res.redirect("/campgrounds");
        else res.redirect("/campgrounds/" + req.params.id);
    })
})

router.delete("/:id", middlewareObj.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) res.redirect("/campgrounds");
        res.redirect("/campgrounds");
    })
})





module.exports = router;