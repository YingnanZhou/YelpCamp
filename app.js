var   express      = require("express"),
      app          = express(),
      bodyParser   = require("body-parser"),
      mongoose     = require("mongoose"),
      User         = require("./models/user"), 
      Comment      = require("./models/comment"),
      Campground   = require("./models/campground"),
      methodOver   = require("method-override"),
      flash        = require("connect-flash"),
      seedDB       = require("./seeds");
      
    
var LocalStrategy  = require("passport-local"),
    passport       = require("passport");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");


mongoose.connect("mongodb://yingnan:Zhou950505@ds147073.mlab.com:47073/yelpcamp-yingnan");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOver("_method"));
app.use(flash());



//seedDB();

app.use(require("express-session")({
    secret: "i am a robot",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);



app.listen(process.env.PORT, process.env.ID, function(){
    console.log("server has started");
})