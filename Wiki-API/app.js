'use strict';

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

main()
async function main() {
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true})
    } catch(e) {
        console.log(e)
    }
}

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Name must be specified"]
    },
    content: {
        type: String,
        required: [true, "Content must be added"]
    }
});

const Article = new mongoose.model("Article", articleSchema);

// Creating get route to fetch articles
app.route("/articles")
.get((req, res)=>{
    Article.find({}).then((foundArticles) => {
        res.send(foundArticles);
    }).catch((e) => console.log(e))
})
.post((req, res) => {
    console.log(req.query.title)
    console.log(req.query.content)
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    }).save().then((newArticle) => {
        res.send("Article saved successfully!")
    }).catch((e) => console.log("Unable to save article to the database..."))
})
.delete((req, res) => {
    Article.deleteMany({}).then(() => console.log("Article deleted successfully..."))
    .catch((e) => console.log("Caught an error while deleting post"));
})

app.set('view engine', 'ejs');



app.use(express.static("public"));



app.listen(3000, (req, res) => {
    console.log("Server started at port 3000")
})