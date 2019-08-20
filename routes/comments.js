var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");

router.post("/",middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log(err);
        else{
        Comment.create(req.body.comment, function(err, comment){
            if(err) {
                console.log(err);
            }
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "comment added");
            res.redirect("/campgrounds/" + campground._id);
        })
        }
    })
})

router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log(err);
        res.render("comments/new", {campground: campground});
    })
    
})


router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) res.redirect("back");
        res.render("comments/edit", {comment: comment, campground_id: req.params.id});
    })
    
})

router.put("/:comment_id", middlewareObj.checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
        if(err) res.redirect("back");
        res.redirect("/campgrounds/" + req.params.id);
    })
})

router.delete("/:comment_id", middlewareObj.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) res.redirect("back");
        req.flash("success", "comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    })
})



module.exports = router;