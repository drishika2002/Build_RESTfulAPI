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

//****** REQUESTS TARGETING ALL ARTICLES ********//
 
// Creating get route to fetch articles, post route to add new articles and delete route to delete articles
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
    Article.deleteMany({}).then(() => console.log("Articles deleted successfully..."))
    .catch((e) => console.log("Caught an error while deleting post"));
})


//****** REQUESTS TARGETING SPECIFIC ARTICLES ********//

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}).then((foundArticle) => res.send(foundArticle))
    .catch((error) => res.send("No matching article found!"));
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
    ).then(() => res.send("Article updated successfully!"))
    .catch((error) => res.send("Error caught while updating the article"));
})

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle}, 
        {$set: req.body}
    ).then(() => res.send("Article updated successfully!"))
    .catch((error) => res.send("Error caught while updating the article"));
})
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}).then(() => res.send("Article deleted!"))
    .catch((error) => res.send("No matching article found!"));
})

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.listen(3000, (req, res) => {
    console.log("Server started at port 3000")
})