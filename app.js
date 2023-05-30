require("dotenv").config({ path: __dirname + '/.env' });
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");
app.use(express.static("public"));

const url = process.env.URL;
// console.log(url)

mongoose.connect(url, { useNewUrlParser: true })
    .then(res => {
        console.log("sweet")
    })
    .catch(err => {
        console.log(err)
    })

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = new mongoose.model("article", articleSchema);

////////////////////////////////////////////////////////////////////
app.route("/articles")
    .get((req, res) => {

        Article.find()
            .then(found => {
                res.send(found)
            })
            .catch(err => {
                res.send(err)
            })

    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save()
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })

    })
    .delete((req, res) => {
        Article.deleteMany()
            .then(success => {
                res.send("successfully deleted all articles");
            })
            .catch(fail => {
                res.send(fail)
            })
    });

/////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle})
        .then(found =>{
            res.send(found)
        })
        .catch(err =>{
            res.send(err)
        })
    })
    .put((req,res)=>{
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content})
            .then(success =>{
                res.send(success)
            })
            .catch(err =>{
                console.log(err)
            });
    })
    .patch((req,res)=>{
        Article.updateOne(
            {title: req.params.articleTitle},
            {title:req.body.title, content:req.body.content})
            .then(success=>{
                res.send(success)
            })
            .catch(err=>{
                res.send(err)
            })
    })
    .delete((req, res)=>{
        Article.deleteOne(
            {title:req.params.articleTitle})
        .then(success =>{
            res.send(success)
        })
        .catch(err=>{
            res.send(err)
        })
    })






app.listen(3000, () => {
    console.log("howdy partner")
})