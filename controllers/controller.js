const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");
const request = require('request');

const Jobs = require("../models/Job.js");
const Notes = require("../models/Note.js");

app.get('/', (req, res, next) => {
    Jobs.find({ "isSaved": false }).exec((err, docs) => {
        // console.log(docs);
        res.render('home.hbs', { jobs: docs });
    });
});

app.get('/saved', (req, res, next) => {
    Jobs.find({ "isSaved": true }).populate("notes").exec((err, docs) => {
        // console.log(docs);
        res.render('saved.hbs', { jobs: docs });
    });
});


let scrapeURL = "https://www.indeed.com/jobs?q=web+developer&l=remote";

// A GET route for scraping the echoJS website
app.get("/scrape", (req, res) => {
    // First, we grab the body of the html with request
    axios.get(scrapeURL).then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every div with a class of "result", and do the following:
        $("div .result").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".jobtitle")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.companyName = $(this)
                .children('.sjcl')
                .children('.company')
                .text();
            result.location = $(this)
                .children('.sjcl')
                .children('.location')
                .text();
            result.summary = $(this)
                .children('.paddedSummaryExperience')
                .children('table')
                .find('.summary')
                .text();
            result.experience = $(this)
                .children('.paddedSummaryExperience')
                .find('.experience')
                .text();

            // Create a new Job using the `result` object built from scraping
            Jobs.create(result)
                .then(function (dbJob) {
                    // View the added result in the console
                    console.log(dbJob);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save a Job, send a message to the client
        // res.send("Scrape Complete");
        res.redirect('/')


    });
});

// Route for getting all Jobs from the db
app.get("/jobs", function (req, res) {
    // Grab every document in the Jobs collection
    Jobs.find({})
        .then(function (dbJob) {
            // If we were able to successfully find Jobs, send them back to the client
            res.json(dbJob);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for marking jobs as saved (isSaved: true)
app.post("/jobs/save/:id", function (req, res) {
    // Use the job id to find and update its saved boolean
    Jobs.findOneAndUpdate({ "_id": req.params.id }, { "isSaved": true })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {
                // Or send the document to the browser
                res.send(doc);
            }
        });
});

// Route for deleting (i.e UN-SAVING - not removing from db) a saved job (isSaved: false and notes empty)
app.post("/jobs/delete/:id", function (req, res) {
    // Use the job id to find and update its saved boolean
    Jobs.findOneAndUpdate({ "_id": req.params.id }, { "isSaved": false, "notes": [] })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {
                // Or send the document to the browser
                res.send(doc);
            }
        });
});

// Route for grabbing a specific Job by id, populate it with it's notes
app.get("/jobs/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Jobs.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbJob) {
            // If we were able to successfully find a job with the given id, send it back to the client
            res.json(dbJob);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating a Job's associated Note
app.post("/jobs/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    Notes.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Job with an `_id` equal to `req.params.id`. Update the Job to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return Jobs.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbJob) {
            // If we were able to successfully update an Job, send it back to the client
            res.json(dbJob);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Delete a note
app.delete("/notes/delete/:note_id/:job_id", function (req, res) {
    // Use the note id to find and delete it
    Notes.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
        // Log any errors
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            Jobs.findOneAndUpdate({ "_id": req.params.job_id }, { $pull: { "notes": req.params.note_id } })
                // Execute the above query
                .exec(function (err) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        // Or send the note to the browser
                        res.send("Note Deleted");
                    }
                });
        }
    });
});




// Export routes for server.js to use.
module.exports = app;
