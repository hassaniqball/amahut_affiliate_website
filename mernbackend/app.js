const express = require("express");
const app = express();
require("D:/AmaHut Web Project/mernbackend/src/db/conn.js");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index-13");
})

app.get("/index-13", (req, res) =>{
    res.render("index-13");
})

app.get("/category-list", (req, res) =>{
    res.render("category-list");
})
app.get("/about", (req, res) =>{
    res.render("about");
})
app.get("/contact", (req, res) =>{
    res.render("contact");
})
app.get("/dashboard", (req, res) =>{
    res.render("dashboard");
})
app.get("/faq", (req, res) =>{
    res.render("faq");
})
app.get("/forgotPass", (req, res) =>{
    res.render("forgotPass");
})
app.get("/profile", (req, res) =>{
    res.render("profile");
})
app.get("/login", (req, res) => {
    res.render("login");
})

app.listen(port, () => {
    console.log("server is running!");
})
