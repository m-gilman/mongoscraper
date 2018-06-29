var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
const request = require('request');


var PORT = 3000;

// Initialize Express
var app = express();

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/jobScraper");

// Configure middleware
// Set Handlebars as the default templating engine.
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Import routes and give the server access to them.
var routes = require("./controllers/controller");

app.use(routes);
app.use('/', routes);

// Require all models
const db = require("./models");


// Start the server

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});