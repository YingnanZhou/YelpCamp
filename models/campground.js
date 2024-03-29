var mongoose = require("mongoose");
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    createAt: {type: Date, default: Date.now},
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username:String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundsSchema);